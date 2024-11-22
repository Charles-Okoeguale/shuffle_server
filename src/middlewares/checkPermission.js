const jwt = require('jsonwebtoken');
const getPermissionsForRole = require('../services/permissionService');

const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            // Check for Authorization Header
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                console.error("Authorization header missing or invalid");
                return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            // Verify the token
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, 'hasbullah');
            } catch (err) {
                console.error("Invalid token", err);
                return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
            }

            // Extract user role from the token
            const userRole = decodedToken.role;
            if (!userRole) {
                console.error("User role missing in token");
                return res.status(403).json({ error: 'Forbidden', message: 'User role not found in token' });
            }

            // Fetch permissions for the user's role
            let rolePermissions;
            try {
                rolePermissions = await getPermissionsForRole(userRole);
            } catch (err) {
                console.error("Error fetching role permissions", err);
                return res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve permissions' });
            }

            // Check if the permission is granted
            if (!rolePermissions || !rolePermissions.includes(permission)) {
                console.error(`Permission "${permission}" denied for role "${userRole}"`);
                return res.status(403).json({ error: 'Forbidden', message: 'Permission not granted' });
            }

            // Attach decoded token to the request object
            req.user = decodedToken;
            return next();

        } catch (err) {
            console.error("Unexpected error", err);
            return res.status(500).json({ error: 'Internal Server Error', message: 'An unexpected error occurred' });
        }
    };
};




module.exports = checkPermission;
