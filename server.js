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
const Orders = require('./src/models/orders');
const RolePermission = require('./src/models/rolePermission');
const apiRoutes = require('./src/routes/index');
const createAdminRole = require("./src/seeds/createAdminRole")
const addAdminUser = require("./src/seeds/createAdminUser");
const seedStatistics = require('./src/seeds/createStats');
const createProductSorterRole = require('./src/seeds/createProductSorterRole');
const createInventoryManagerRole = require('./src/seeds/createInventoryManagerRole');

async function syncDatabase() {
    try {
      await sequelize.authenticate();
      await addAdminUser()
      await seedStatistics()
      await createAdminRole()
      await createProductSorterRole();
      await createInventoryManagerRole();
      await sequelize.sync({ force: false });
      console.log('All models were synchronized successfully.');
    } catch (err) {
      console.error('Error syncing models:', err);
    }
}

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

syncDatabase();

module.exports = app;

