const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/sequelize');
const Statistics = require('../models/statistics');
const Decimal = require('decimal.js');

exports.addUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  const transaction = await sequelize.transaction();

  try {
    if (!email || !password || !role || !firstname || !lastname) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role: role.toLowerCase(),
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
    }, { transaction });

    const employeeStat = await Statistics.findOne({
      where: { stat_name: 'No of employees' },
      transaction,
      lock: true 
    });

    if (!employeeStat) {
      await Statistics.create({
        stat_name: 'No of employees',
        value: new Decimal('1.00')
      }, { transaction });
    } else {
      try {
        const currentValue = new Decimal(employeeStat.value);
        await employeeStat.update({
          value: currentValue.plus(new Decimal('1.00'))
        }, { transaction });
      } catch (decimalError) {
        throw new Error('Current employee count is not a valid number');
      }
    }

    await transaction.commit();
    
    res.status(201).json({ message: 'Employee created successfully' });

  } catch (error) {
    await transaction.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateEmailError = error.errors.find(err => err.path === 'email');
      if (duplicateEmailError) {
        console.error('Duplicate email error:', duplicateEmailError.message);
        return res.status(409).json({ error: 'Duplicate email: This email is already in use.' });
      }
    }

    if (error.message === 'Current employee count is not a valid number') {
      console.error('Statistics error:', error.message);
      return res.status(500).json({ 
        error: 'Server error: Employee statistics are corrupted. Please contact system administrator.' 
      });
    }

    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
    });
    console.log(users)
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params; // Get the 'id' from the URL parameters

  try {
    // Find the user with the provided ID
    const user = await User.findOne({ where: { id } });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the found user as the response
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, role, password } = req.body; 
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await user.update({
        firstname,
        lastname,
        email,
        role,
        password_hash: hashedPassword,
      });
      return res.json({ message: 'User updated successfully', user: updatedUser });
    }
    const updatedUser = await user.update({
      firstname,
      lastname,
      email,
      role,
    });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, 'userId')

  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, 'userId');
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy({ transaction });
    const employeeStat = await Statistics.findOne({
      where: { stat_name: 'No of employees' },
      transaction,
      lock: true
    });

    if (!employeeStat) {
      throw new Error('Employee statistics not found');
    }

    try {
      const currentValue = new Decimal(employeeStat.value);
      if (currentValue.lessThan(new Decimal('1.00'))) {
        throw new Error('Employee count would go below zero');
      }
      await employeeStat.update({
        value: currentValue.minus(new Decimal('1.00'))
      }, { transaction });
    } catch (decimalError) {
      throw new Error('Current employee count is not a valid number');
    }
    await transaction.commit();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting user:', error);

    if (error.message === 'Employee statistics not found') {
      return res.status(500).json({ 
        error: 'Server error: Employee statistics not found. Please contact system administrator.' 
      });
    }

    if (error.message === 'Current employee count is not a valid number') {
      return res.status(500).json({ 
        error: 'Server error: Employee statistics are corrupted. Please contact system administrator.' 
      });
    }

    if (error.message === 'Employee count would go below zero') {
      return res.status(500).json({ 
        error: 'Server error: Employee count would become negative. Please contact system administrator.' 
      });
    }

    res.status(500).json({ error: 'Server error' });
  }
};

