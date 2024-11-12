const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Statistics = require('../models/statistics');

exports.login = async (req, res) => {
  const { email, password } = req.body;  
  try {
    // Check if user exists using Sequelize
    const user = await User.findOne({ where: { email } });
    console.log('email', user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Retrieve all statistics from the 'Statistics' table using Sequelize
    const statistics = await Statistics.findAll();
    console.log("stats:", statistics)

    // Generate a token with user info
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      'hasbullah',
      { expiresIn: '1h' }
    );

    // Send the token and statistics as response
    res.json({ token, statistics });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


