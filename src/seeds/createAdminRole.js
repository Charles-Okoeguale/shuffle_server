const Role = require('../models/role');

const createAdminRole = async () => {
  try {
    const existingRole = await Role.findOne({ where: { role: 'admin' } });

    if (!existingRole) {
      await Role.create({
        role: 'admin',
        description: 'CEO',
        permissions: [
          "inventory.add", "inventory.edit", "inventory.delete",
          "user.add", "user.edit", "user.delete",
          "statistics.add", "statistics.edit", "statistics.delete",
          "roles.add", "roles.edit", "roles.delete"
        ],
      });

      console.log('Admin role created successfully!');
    } else {
      console.log('Admin role already exists!');
    }
  } catch (error) {
    console.error('Error creating Admin role:', error);
  }
};
createAdminRole()

// module.exports = createAdminRole;

