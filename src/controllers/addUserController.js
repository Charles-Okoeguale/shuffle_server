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
