const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Statistics = require('../models/statistics');
const Roles = require("../models/role")

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password)

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email does not exist' });
    }
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      'hasbullah',
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


