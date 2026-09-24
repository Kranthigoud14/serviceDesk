const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "System Admin",
                "IT Manager",
                "Technician",
                "Employee",
                "Asset Manager"
            ],
            default: "Employee"
        },

        skills: {
            type: [String],
            default: []
        },

        skillsVerified: {
            type: Boolean,
            default: false
        },

        availability: {
            type: String,
            enum: [
                "Available",
                "Busy",
                "Offline"
            ],
            default: "Available"
        },

        maxActiveTickets: {
            type: Number,
            default: 5,
            min: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);