const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

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
    });

    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const duplicateEmailError = error.errors.find(err => err.path === 'email');
      if (duplicateEmailError) {
        console.error('Duplicate email error:', duplicateEmailError.message);
        return res.status(409).json({ error: 'Duplicate email: This email is already in use.' });
      }
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

