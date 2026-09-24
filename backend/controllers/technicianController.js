const User = require("../models/User");
const Ticket = require("../models/Ticket");

const {
    createNotification
} = require("../services/notificationService");

// ==========================================
// GENERATE 6 DIGIT OTP
// ==========================================

const generateOtp = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// ==========================================
// GET ALL TECHNICIANS
// ==========================================

const getTechnicians = async (req, res) => {
    try {
        const technicians = await User.find({
            role: "Technician"
        })
            .select("-password")
            .sort({ name: 1 });

        const techniciansWithWorkload = await Promise.all(
            technicians.map(async (technician) => {

                const activeTickets = await Ticket.countDocuments({
                    assignedTo: technician._id,
                    status: {
                        $in: [
                            "Assigned",
                            "In Progress"
                        ]
                    }
                });

                return {
                    ...technician.toObject(),

                    activeTickets,

                    availableCapacity: Math.max(
                        technician.maxActiveTickets - activeTickets,
                        0
                    )
                };
            })
        );

        res.status(200).json(techniciansWithWorkload);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch technicians",
            error: error.message
        });
    }
};

// ==========================================
// GET TECHNICIAN BY ID
// ==========================================

const getTechnicianById = async (req, res) => {
    try {
        const technician = await User.findOne({
            _id: req.params.id,
            role: "Technician"
        }).select("-password");

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        const activeTickets = await Ticket.countDocuments({
            assignedTo: technician._id,
            status: {
                $in: [
                    "Assigned",
                    "In Progress"
                ]
            }
        });

        res.status(200).json({
            ...technician.toObject(),

            activeTickets,

            availableCapacity: Math.max(
                technician.maxActiveTickets - activeTickets,
                0
            )
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch technician",
            error: error.message
        });
    }
};

// ==========================================
// TECHNICIAN UPDATES OWN SKILLS
// ==========================================

const updateOwnTechnicianSkills = async (req, res) => {
    try {
        const { skills } = req.body;

        if (!Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be provided as an array"
            });
        }

        const technician = await User.findOne({
            _id: req.user.userId,
            role: "Technician"
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        technician.skills = skills
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        // New skills must be verified again
        technician.skillsVerified = false;

        const updatedTechnician = await technician.save();

        // ==========================================
        // NOTIFY IT MANAGERS
        // ==========================================

        const itManagers = await User.find({
            role: "IT Manager"
        }).select("_id");

        await Promise.all(
            itManagers.map((manager) =>
                createNotification({
                    recipient: manager._id,
                    title: "Technician Skills Submitted",
                    message:
                        `${updatedTechnician.name} has submitted updated skills for verification.`,
                    type: "TECHNICIAN_SKILLS_SUBMITTED"
                })
            )
        );

        res.status(200).json({
            message: "Skills submitted successfully. Waiting for IT Manager verification.",

            technician: {
                id: updatedTechnician._id,
                name: updatedTechnician.name,
                skills: updatedTechnician.skills,
                skillsVerified: updatedTechnician.skillsVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update technician skills",
            error: error.message
        });
    }
};

// ==========================================
// IT MANAGER VERIFIES TECHNICIAN SKILLS
// ==========================================

const verifyTechnicianSkills = async (req, res) => {
    try {
        const technician = await User.findOne({
            _id: req.params.id,
            role: "Technician"
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        if (technician.skills.length === 0) {
            return res.status(400).json({
                message: "Technician has not submitted any skills"
            });
        }

        technician.skillsVerified = true;

        const updatedTechnician = await technician.save();

        // ==========================================
        // NOTIFY TECHNICIAN
        // ==========================================

        await createNotification({
            recipient: updatedTechnician._id,
            title: "Skills Verified",
            message:
                "Your technician skills have been verified by the IT Manager.",
            type: "TECHNICIAN_SKILLS_VERIFIED"
        });

        res.status(200).json({
            message: "Technician skills verified successfully",

            technician: {
                id: updatedTechnician._id,
                name: updatedTechnician.name,
                skills: updatedTechnician.skills,
                skillsVerified: updatedTechnician.skillsVerified
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to verify technician skills",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE TECHNICIAN AVAILABILITY
// ==========================================

const updateTechnicianAvailability = async (req, res) => {
    try {
        const { availability } = req.body;

        const allowedAvailability = [
            "Available",
            "Busy",
            "Offline"
        ];

        if (!allowedAvailability.includes(availability)) {
            return res.status(400).json({
                message: "Invalid availability status"
            });
        }

        // Technician can update only their own availability
        if (
            req.user.role === "Technician" &&
            req.user.userId !== req.params.id
        ) {
            return res.status(403).json({
                message: "You can only update your own availability"
            });
        }

        const technician = await User.findOne({
            _id: req.params.id,
            role: "Technician"
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        technician.availability = availability;

        const updatedTechnician = await technician.save();

        res.status(200).json({
            message: "Technician availability updated successfully",

            technician: {
                id: updatedTechnician._id,
                name: updatedTechnician.name,
                availability: updatedTechnician.availability
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update technician availability",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE TECHNICIAN CAPACITY
// ==========================================

const updateTechnicianCapacity = async (req, res) => {
    try {
        const { maxActiveTickets } = req.body;

        if (
            maxActiveTickets === undefined ||
            !Number.isInteger(maxActiveTickets) ||
            maxActiveTickets < 1
        ) {
            return res.status(400).json({
                message: "Maximum active tickets must be a positive integer"
            });
        }

        const technician = await User.findOne({
            _id: req.params.id,
            role: "Technician"
        });

        if (!technician) {
            return res.status(404).json({
                message: "Technician not found"
            });
        }

        technician.maxActiveTickets = maxActiveTickets;

        const updatedTechnician = await technician.save();

        res.status(200).json({
            message: "Technician capacity updated successfully",

            technician: {
                id: updatedTechnician._id,
                name: updatedTechnician.name,
                maxActiveTickets:
                    updatedTechnician.maxActiveTickets
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update technician capacity",
            error: error.message
        });
    }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    getTechnicians,
    getTechnicianById,
    updateOwnTechnicianSkills,
    verifyTechnicianSkills,
    updateTechnicianAvailability,
    updateTechnicianCapacity
};