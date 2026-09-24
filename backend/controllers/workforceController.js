const Ticket = require("../models/Ticket");
const User = require("../models/User");

// ==========================================
// RECOMMEND TECHNICIANS FOR A TICKET
// ==========================================

const recommendTechnicians = async (req, res) => {
    try {
        const { ticketId } = req.params;

        // ==========================================
        // 1. FIND TICKET
        // ==========================================

        const ticket =
            await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).json({
                message:
                    "Ticket not found"
            });
        }

        // ==========================================
        // 2. FIND VERIFIED + AVAILABLE TECHNICIANS
        // ==========================================

        const technicians =
            await User.find({
                role: "Technician",
                availability: "Available",
                skillsVerified: true
            }).select("-password");

        if (technicians.length === 0) {
            return res.status(200).json({
                message: "No available verified technicians found",
                recommendations: []
            });
        }

        // ==========================================
        // 3. CALCULATE TECHNICIAN DATA
        // ==========================================

        const recommendations =
            await Promise.all(
                technicians.map(
                    async (technician) => {

                        // ------------------------------------------
                        // ACTIVE WORKLOAD
                        // ------------------------------------------

                        const activeTickets =
                            await Ticket.countDocuments({
                                assignedTo:
                                    technician._id,

                                status: {
                                    $in: [
                                        "Assigned",
                                        "In Progress"
                                    ]
                                }
                            });

                        // ------------------------------------------
                        // CAPACITY
                        // ------------------------------------------

                        const availableCapacity =
                            Math.max(
                                technician.maxActiveTickets -
                                    activeTickets,
                                0
                            );

                        const hasCapacity =
                            activeTickets <
                            technician.maxActiveTickets;

                        // ------------------------------------------
                        // SKILL MATCH
                        // ------------------------------------------

                        const skillMatch =
                            technician.skills.some(
                                (skill) =>
                                    skill.toLowerCase() ===
                                    ticket.category.toLowerCase()
                            );

                        // ------------------------------------------
                        // SERVICE RATING
                        // ------------------------------------------

                        const ratingData =
                            await Ticket.aggregate([
                                {
                                    $match: {
                                        assignedTo:
                                            technician._id,

                                        rating: {
                                            $ne: null
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: null,

                                        averageRating: {
                                            $avg: "$rating"
                                        },

                                        totalRatings: {
                                            $sum: 1
                                        }
                                    }
                                }
                            ]);

                        const averageRating =
                            ratingData.length > 0
                                ? Number(
                                      ratingData[0]
                                          .averageRating
                                  .toFixed(2)
                                  )
                                : null;

                        const totalRatings =
                            ratingData.length > 0
                                ? ratingData[0]
                                      .totalRatings
                                : 0;

                        // ==========================================
                        // SCORE
                        // ==========================================

                        let score = 0;

                        // Skill Match
                        if (skillMatch) {
                            score += 50;
                        }

                        // Availability
                        score += 20;

                        // Capacity
                        if (hasCapacity) {
                            score += 20;
                        }

                        // Workload
                        if (activeTickets === 0) {
                            score += 10;
                        } else if (
                            activeTickets <= 2
                        ) {
                            score += 5;
                        }

                        // Rating
                        //
                        // Rating is a supporting signal.
                        // Maximum rating contribution = 10.
                        //

                        let ratingScore = 0;

                        if (
                            averageRating !== null
                        ) {
                            ratingScore =
                                (averageRating / 5) *
                                10;

                            score += ratingScore;
                        }

                        // ==========================================
                        // RETURN TECHNICIAN DATA
                        // ==========================================

                        return {
                            technician: {
                                id: technician._id,
                                name: technician.name,
                                email: technician.email,

                                skills:
                                    technician.skills,

                                skillsVerified:
                                    technician.skillsVerified,

                                availability:
                                    technician.availability,

                                maxActiveTickets:
                                    technician.maxActiveTickets
                            },

                            activeTickets,

                            availableCapacity,

                            skillMatch,

                            hasCapacity,

                            averageRating,

                            totalRatings,

                            ratingScore: Number(
                                ratingScore.toFixed(2)
                            ),

                            score: Number(
                                score.toFixed(2)
                            )
                        };
                    }
                )
            );

        // ==========================================
        // 4. REMOVE FULL-CAPACITY TECHNICIANS
        // ==========================================

        const eligibleTechnicians =
            recommendations.filter(
                (recommendation) =>
                    recommendation.hasCapacity
            );

        if (
            eligibleTechnicians.length === 0
        ) {
            return res.status(200).json({
                message: "No available technicians with capacity found",
                recommendations: []
            });
        }

        // ==========================================
        // 5. SORT BY SCORE
        // ==========================================

        eligibleTechnicians.sort(
            (a, b) =>
                b.score - a.score
        );

        // ==========================================
        // 6. RETURN RECOMMENDATIONS
        // ==========================================

        res.status(200).json({
            message:
                "Technician recommendations generated",

            ticket: {
                id: ticket._id,
                title: ticket.title,
                category: ticket.category,
                priority: ticket.priority,
                status: ticket.status
            },

            scoring: {
                skillMatch:
                    "50 points",

                availability:
                    "20 points",

                capacity:
                    "20 points",

                lowWorkload:
                    "up to 10 points",

                rating:
                    "up to 10 points"
            },

            recommendations:
                eligibleTechnicians
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Failed to generate technician recommendations",
            error: error.message
        });
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    recommendTechnicians
};