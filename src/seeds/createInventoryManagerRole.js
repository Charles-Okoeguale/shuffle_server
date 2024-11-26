const Role = require('../models/role');

const createInventoryManagerRole = async () => {
    try {
      const existingRole = await Role.findOne({ where: { role: 'inventory-manager' } });
  
      if (existingRole) {
        console.log('Inventory Manager role already exists!');
      } else {
        await Role.create({
          role: 'inventory-manager',
          description: 'Responsible for managing inventory',
          permissions: [], // Add relevant permissions here
        });
  
        console.log('Inventory Manager role created successfully!');
      }
    } catch (error) {
      console.error('Error creating Inventory Manager role:', error);
    }
};


module.exports = createInventoryManagerRole;
  