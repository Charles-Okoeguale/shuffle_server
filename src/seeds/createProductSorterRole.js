const Role = require('../models/role');

const createProductSorterRole = async () => {
    try {
      const existingRole = await Role.findOne({ where: { role: 'product-sorter' } });
  
      if (existingRole) {
        console.log('Product Sorter role already exists!');
      } else {
        await Role.create({
          role: 'product-sorter',
          description: 'Responsible for sorting products',
          permissions: [],
        });
  
        console.log('Product Sorter role created successfully!');
      }
    } catch (error) {
      console.error('Error creating Product Sorter role:', error);
    }
};

module.exports = createProductSorterRole;
  