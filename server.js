require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/user'); 
const sequelize = require('./src/config/sequelize');
const User = require('./src/models/user');
const Role = require('./src/models/role');
const Permission = require('./src/models/permission');
const Inventory = require('./src/models/inventory');
const Statistics = require('./src/models/statistics');
const RolePermission = require('./src/models/rolePermission');
const apiRoutes = require('./src/routes/index');
const createAdminRole = require("./src/seeds/createAdminRole")
const addAdminUser = require("./src/seeds/createAdminUser")

// async function syncDatabase() {
//     try {
//       await sequelize.authenticate();
//       await sequelize.sync({ force: false });
//       console.log('All models were synchronized successfully.');
//     } catch (err) {
//       console.error('Error syncing models:', err);
//     }
// }

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');
    const allTables = await sequelize.getQueryInterface().showAllTables();
    if (allTables.length > 0) {
      console.log('All tables were dropped and recreated. Running seed scripts...');
      await createAdminRole()
      await addAdminUser();
    }
  } catch (err) {
    console.error('Error syncing models or running seed scripts:', err);
  }
}

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);
app.use(cors());
app.use(morgan('dev'));



app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

syncDatabase();