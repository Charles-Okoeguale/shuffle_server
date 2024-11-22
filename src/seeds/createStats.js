const Statistics = require('../models/statistics'); 

const statisticsData = [
  {
    stat_name: 'No of employees',
    value: 0,
  },
  {
    stat_name: 'ordered products',
    value: 0,
  },
  {
    stat_name: 'Sold products',
    value: 0,
  },
  {
    stat_name: 'In stock',
    value: 0,
  },
  {
    stat_name: 'Total spent',
    value: 0,
  },
];

async function seedStatistics() {
  try {
    const existingStats = await Statistics.count();
    if (existingStats > 0) {
      console.log('Statistics already seeded. Skipping...');
      return;
    }

    for (const stat of statisticsData) {
      await Statistics.create(stat);
    }
    console.log('Statistics seeded successfully');
  } catch (error) {
    console.error('Error seeding statistics:', error);
  }
}

module.exports = seedStatistics
