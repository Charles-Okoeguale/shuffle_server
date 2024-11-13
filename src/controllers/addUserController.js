const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body

  try {
    // Validate incoming data (you can use your own validation logic or a library like Joi)
    if (!email || !password || !role || !firstname || !lastname ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    await User.create({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role: role.toLowerCase(), 
      firstname: firstname.toLowerCase(), 
      lastname: lastname.toLowerCase()
    });

    // Return the created user data (without sensitive info like password)
    res.status(201).json({message: "Employee created succesfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Send the users as a response
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
  const { id } = req.params; // Get the 'id' from the URL parameters
  const { firstname, lastname, email, role, password } = req.body; // Get data from the request body

  try {
    // Find the user by their ID
    const user = await User.findOne({ where: { id } });

    // If the user does not exist, return a 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If a password is provided, hash it before saving
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
      // Update the user's password along with other details
      const updatedUser = await user.update({
        firstname,
        lastname,
        email,
        role,
        password_hash: hashedPassword, // Update the password hash in the database
      });
      
      // Return the updated user as the response
      return res.json({ message: 'User updated successfully', user: updatedUser });
    }

    // If no password is provided, update other fields
    const updatedUser = await user.update({
      firstname,
      lastname,
      email,
      role,
    });

    // Return the updated user as the response
    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

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

