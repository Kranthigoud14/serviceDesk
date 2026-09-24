const User = require("../models/User");

// ==========================================
// GET ALL USERS
// ==========================================
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// ==========================================
// GET USER BY ID
// ==========================================
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: error.message
        });
    }
};

// ==========================================
// UPDATE USER NAME
// ==========================================
const updateUserName = async (req, res) => {
    try {
        const { name } = req.body;

        // Make sure name is provided
        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        /*
         * If /profile is used:
         * update the currently logged-in user.
         *
         * If /:id is used:
         * update the selected user.
         */
        const targetUserId = req.params.id || req.user.userId;

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        /*
         * /profile:
         * Any authenticated user can update their own name.
         *
         * /:id:
         * Only System Admin can update another user's name.
         */
        if (req.params.id) {
            const isSystemAdmin = req.user.role === "System Admin";

            if (!isSystemAdmin) {
                return res.status(403).json({
                    message: "Only System Admin can update another user"
                });
            }
        }

        // Update name
        targetUser.name = name.trim();

        const updatedUser = await targetUser.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user",
            error: error.message
        });
    }
};

// ==========================================
// DELETE USER
// ==========================================
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUserName,
    deleteUser
};
