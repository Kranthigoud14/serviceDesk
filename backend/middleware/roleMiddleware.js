// ==========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ==========================================

const authorize = (...roles) => {
    return (req, res, next) => {

        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        // System Admin has full access
        if (req.user.role === "System Admin") {
            return next();
        }

        // Check whether user's role is allowed
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You are not authorized."
            });
        }

        // Authorized
        next();
    };
};

module.exports = authorize;