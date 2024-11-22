const Role = require('../models/role');

exports.addRole = async (req, res) => {
    const { role, description, permissions } = req.body;

    try {
        // Create a new role in the database
        const newRole = await Role.create({
        role,
        description,
        permissions: permissions 
        });

        // Return a success message along with the created role
        res.status(201).json({
        message: 'Role created successfully',
        role: newRole,
        });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

exports.editRole = async (req, res) => {
  const { id } = req.params; 
  const { role, description, permissions } = req.body;
  
  try {
    const existingRole = await Role.findByPk(id);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found' });
    }
    const validPermissions = Array.isArray(permissions)
      ? permissions.filter(perm => typeof perm === 'string')
      : [];
    existingRole.role = role || existingRole.role;
    existingRole.description = description || existingRole.description;
    existingRole.permissions = validPermissions.length > 0 ? validPermissions : existingRole.permissions;
    await existingRole.save();
    res.json({
      message: 'Role updated successfully',
      role: existingRole,
    });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteRole = async (req, res) => {
    const { id } = req.params;  // Get the role ID from the URL parameters
  
    try {
      // Find the role by its ID
      const role = await Role.findByPk(id);
  
      // If the role does not exist, return a 404 error
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      // Delete the role from the database
      await role.destroy();
  
      // Send back a success message
      res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
      console.error('Error deleting role:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json({
      message: 'Roles retrieved successfully',
      roles,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

