const jwt = require('jsonwebtoken');

const permissions = {
    "admin": {
        Inventory: { add: true, edit: true, delete: true },
        User: { add: true, edit: true, delete: true },
        Statistics: { add: true, edit: true, delete: true },
        Role: { add: true, edit: true, delete: true }
    },
    "product sorter": {
        Inventory: { add: true, edit: true, delete: false },
        User: { add: false, edit: false, delete: false },
        Statistics: { add: true, edit: true, delete: false },
        Role: { add: false, edit: false, delete: false }
    },
    "inventory manager": {
        Inventory: { add: true, edit: false, delete: false },
        User: { add: false, edit: false, delete: false },
        Statistics: { add: true, edit: false, delete: false },
        Role: { add: false, edit: false, delete: false }
    }
};

const checkPermission = (moduleName, action) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied: No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, 'hasbullah');

            const userRole = decodedToken.role;

            if (!userRole || !permissions[userRole]) {
                return res.status(403).json({ message: 'Access denied: Invalid role' });
            }

            const rolePermissions = permissions[userRole];

            // Check if the user has permission for the specified module and action
            if (rolePermissions[moduleName] && rolePermissions[moduleName][action]) {
                req.user = decodedToken;
                return next();
            } else {
                return res.status(403).json({ message: 'Access denied: Permission not granted' });
            }

        } catch (err) {
            return res.status(403).json({ message: 'Access denied: Invalid token' });
        }
    };
};

module.exports = checkPermission;
