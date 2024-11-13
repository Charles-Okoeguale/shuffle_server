const { Permission } = require('../models/permission'); // Adjust the path based on your file structure

async function createPermissions() {
  const permissions = [
    {
      "name": "Inventory",
      "can": {
        "add": false,
        "edit": false,
        "delete": false
      }
    },
    {
      "name": "User",
      "can": {
        "add": false,
        "edit": false,
        "delete": false
      }
    },
    {
      "name": "Statistics",
      "can": {
        "add": false,
        "edit": false,
        "delete": false
      }
    },
    {
      "name": "Role",
      "can": {
        "add": false,
        "edit": false,
        "delete": false
      }
    }
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
