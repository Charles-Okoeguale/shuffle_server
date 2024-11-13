const jwt = require('jsonwebtoken');
const getPermissionsForRole = require('../services/permissionService');

const checkPermission = (permission) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied: No token provided' });
        }

        const token = authHeader.split(' ')[1]

        try {
            const decodedToken = jwt.verify(token, 'hasbullah');
            const userRole = decodedToken.role;

            // Fetch the permissions for the role from the database
            const rolePermissions = await getPermissionsForRole(userRole);

            if (!rolePermissions || !rolePermissions.includes(permission)) {
                return res.status(403).json({ message: 'Access denied: Permission not granted' });
            }

            req.user = decodedToken;
            return next();

        } catch (err) {
            return res.status(403).json({ message: 'Access denied: Invalid token' });
        }
    };
};



module.exports = checkPermission;
