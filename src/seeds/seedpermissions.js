const { Permission } = require('../models/permission'); // Adjust the path based on your file structure

async function createPermissions() {
  const permissions = [
    { permission_name: 'getorder', description: 'View orders' },
    { permission_name: 'addorder', description: 'Add new order' },
    { permission_name: 'editorder', description: 'Edit existing order' },
    { permission_name: 'deleteorder', description: 'Delete an order' },
    { permission_name: 'getstatistics', description: 'View statistics' },
    { permission_name: 'getusers', description: 'View users' },
    { permission_name: 'editusers', description: 'Edit users' },
    { permission_name: 'addusers', description: 'Add new users' },
    { permission_name: 'deleteusers', description: 'Delete users' },
    { permission_name: 'getinventory', description: 'View inventory' },
    { permission_name: 'deleteinventory', description: 'Delete inventory item' },
    { permission_name: 'editinventory', description: 'Edit inventory item' },
    { permission_name: 'getrole', description: 'View roles' },
    { permission_name: 'addroles', description: 'Add new roles' },
    { permission_name: 'editrole', description: 'Edit role' },
    { permission_name: 'deleterole', description: 'Delete role' },
  ];

  try {
    for (let permission of permissions) {
      await Permission.create(permission);
    }
    console.log('Permissions created successfully');
  } catch (err) {
    console.error('Error creating permissions:', err);
  }
}

createPermissions();
