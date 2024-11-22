const Role = require('../models/role');

const createAdminRole = async () => {
    try {
      const existingRole = await Role.findOne({ where: { role: 'admin' } });
  
      if (existingRole) {
        console.log('Admin role already exists!');
      } else {
        await Role.create({
          role: 'admin',
          description: 'CEO',
          permissions: [],
        });
  
        console.log('Admin role created successfully!');
      }
    } catch (error) {
      console.error('Error creating Admin role:', error);
    }
  };

module.exports = createAdminRole;

