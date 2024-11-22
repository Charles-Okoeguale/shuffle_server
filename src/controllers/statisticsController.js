const { default: axios } = require('axios');
const Statistics = require('../models/statistics');

exports.getAllStatistics = async (req, res) => {
  try {
    const statistics = await Statistics.findAll();
    res.json({ statistics });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.addStatistic = async (req, res) => {
    try {
      // Validate that the request body is an array
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Request body must be an array' });
      }

      // Insert multiple statistics into the database
      const newStatistics = await Statistics.bulkCreate(req.body);
  
      // Send back the created statistics
      res.status(201).json({
        message: 'Statistics added successfully',
        statistics: newStatistics
      });
    } catch (error) {
      console.error('Error adding statistics:', error);
      res.status(500).json({ error: 'Server error' });
    }
};


exports.getRates = async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD?base=USD&symbols=NGN`;

    const response = await axios.get(url);
    const exchangeRate = response.data;

    res.json(exchangeRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve exchange rate' });
  }
};
