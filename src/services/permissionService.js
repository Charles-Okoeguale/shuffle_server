const Role = require('../models/role');
const Permission = require('../models/permission');

// Function to get permissions for a specific role
async function getPermissionsForRole(roleName) {
    try {
        // Fetch the role by name (e.g., 'admin', 'product sorter', etc.)
        const role = await Role.findOne({ where: { name: roleName } });

        if (!role) {
            throw new Error('Role not found');
        }

        // Fetch permissions associated with this role
        const permissions = await Permission.findAll({
            where: { role_id: role.id },
            attributes: ['module_name', 'action'],
        });

        // Organize the permissions into a structured object
        const permissionMap = {};
        permissions.forEach(permission => {
            const { module_name, action } = permission;
            if (!permissionMap[module_name]) {
                permissionMap[module_name] = {};
            }
            permissionMap[module_name][action] = true; // 'true' indicates the action is allowed
        });

        return permissionMap;

    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw new Error('Unable to fetch permissions');
    }
}

module.exports = getPermissionsForRole;
