const Inventory = require('../models/inventory');
const Order = require('../models/orders');
const User = require('../models/user');
const Statistics = require('../models/statistics');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll();
    res.json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addInventoryItem = async (req, res) => {
  const {
    name, status, tracking_id, unit, quantity, unit_price,
    shipping_fee, shipping_mark, card_charges,
  } = req.body;
  const userId = req.user.userId;

  const safeParseNumber = (value) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const numQuantity = safeParseNumber(quantity);
  const numUnitPrice = safeParseNumber(unit_price);
  const numShippingFee = safeParseNumber(shipping_fee);
  const numCardCharges = safeParseNumber(card_charges);

  const total_paid = Math.round((numQuantity * numUnitPrice + numShippingFee + numCardCharges) * 100) / 100;

  if (isNaN(total_paid) || !isFinite(total_paid)) {
    return res.status(400).json({ error: 'Invalid total paid value' });
  }

  try {
    const requiredFields = [
      name, status, tracking_id, unit, numQuantity, 
      numUnitPrice, numShippingFee, numCardCharges, shipping_mark
    ];
    if (requiredFields.some(field => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const date_of_payment = new Date().toISOString().split('T')[0]; 
    const newInventory = await Inventory.create({
      name,
      status,
      tracking_id,
      unit,
      quantity: numQuantity,
      unit_price: numUnitPrice,
      date_of_payment,
      shipping_fee: numShippingFee,
      total_paid: total_paid,
      shipping_fee_to_nigeria: 0,  
      shipping_mark,
      card_charges: numCardCharges,
      date_of_delivery: null, 
      user_id: userId, 
    });

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.total_spent = Math.round((safeParseNumber(user.total_spent) + total_paid) * 100) / 100;
    await user.save(); 

    const orderedProductsStat = await Statistics.findOne({ where: { stat_name: 'ordered products' } });
    if (!orderedProductsStat) {
      return res.status(404).json({ error: 'Statistic "Ordered Products" not found' });
    }

    orderedProductsStat.value = Math.round((safeParseNumber(orderedProductsStat.value) + numQuantity) * 100) / 100;
    await orderedProductsStat.save();

    const totalSpentStat = await Statistics.findOne({ where: { stat_name: 'Total spent' } });
    if (!totalSpentStat) {
      return res.status(404).json({ error: 'Statistic "Total spent" not found' });
    }

    totalSpentStat.value = Math.round((safeParseNumber(totalSpentStat.value) + total_paid) * 100) / 100;
    await totalSpentStat.save();

    res.status(201).json({
      message: 'Item added to inventory successfully',
      item: newInventory
    });
  } catch (error) {
    console.error('Error adding item to inventory:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

exports.editInventoryItem = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    tracking_id,
    unit,
    quantity,
    unit_price,
    shipping_fee,
    card_charges, 
    shipping_mark,
  } = req.body;

  const safeParseNumber = (value) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const numQuantity = safeParseNumber(quantity);
  const numUnitPrice = safeParseNumber(unit_price);
  const numShippingFee = safeParseNumber(shipping_fee);
  const numCardCharges = safeParseNumber(card_charges);

  const total_paid = Math.round((numQuantity * numUnitPrice + numShippingFee + numCardCharges) * 100) / 100;

  if (isNaN(total_paid) || !isFinite(total_paid)) {
    return res.status(400).json({ error: 'Invalid total paid value' });
  }

  try {
    const requiredFields = [
      name,
      tracking_id,
      unit,
      numQuantity,
      numUnitPrice,
      numShippingFee,
      numCardCharges,
      shipping_mark,
    ];
    if (requiredFields.some((field) => field === undefined || field === null)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const item = await Inventory.findOne({ where: { id } });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const previousQuantity = safeParseNumber(item.quantity);
    const previousTotalPaid = safeParseNumber(item.total_paid);

    const updateData = {
      name,
      tracking_id,
      unit,
      quantity: numQuantity,
      unit_price: numUnitPrice,
      shipping_fee: numShippingFee,
      total_paid: total_paid,
      shipping_mark,
      card_charges: numCardCharges,
    };

    await item.update(updateData);

    const user = await User.findByPk(item.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User associated with inventory not found' });
    }

    // Ensure user total_spent is a number
    user.total_spent = Math.round((safeParseNumber(user.total_spent) + (total_paid - previousTotalPaid)) * 100) / 100;
    await user.save();

    const totalSpentStat = await Statistics.findOne({ where: { stat_name: 'Total spent' } });
    if (!totalSpentStat) {
      return res.status(404).json({ error: 'Statistic "Total spent" not found' });
    }

    // Ensure total spent stat is a number
    totalSpentStat.value = Math.round((safeParseNumber(totalSpentStat.value) + (total_paid - previousTotalPaid)) * 100) / 100;
    await totalSpentStat.save();

    const orderedProductsStat = await Statistics.findOne({ where: { stat_name: 'ordered products' } });
    if (!orderedProductsStat) {
      return res.status(404).json({ error: 'Statistic "Ordered Products" not found' });
    }

    // Ensure ordered products stat is a number
    orderedProductsStat.value = Math.round((safeParseNumber(orderedProductsStat.value) - previousQuantity + numQuantity) * 100) / 100;
    await orderedProductsStat.save();

    res.json({ 
      message: 'Item updated successfully',
      updatedItem: updateData
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      fullError: error 
    });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  const safeParseNumber = (value) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  try {
    const item = await Inventory.findOne({ where: { id } });

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const userId = item.user_id;
    const totalPaid = safeParseNumber(item.total_paid);
    const itemQuantity = safeParseNumber(item.quantity);

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure user total_spent is a number
    user.total_spent = Math.round((safeParseNumber(user.total_spent) - totalPaid) * 100) / 100;
    await user.save();

    const totalSpentStatistic = await Statistics.findOne({ 
      where: { stat_name: 'Total spent' } 
    });
    if (!totalSpentStatistic) {
      return res.status(404).json({ error: 'Total spent statistic not found' });
    }

    // Ensure total spent statistic is a number
    totalSpentStatistic.value = Math.round((safeParseNumber(totalSpentStatistic.value) - totalPaid) * 100) / 100;
    await totalSpentStatistic.save();

    const orderedProductsStat = await Statistics.findOne({ 
      where: { stat_name: 'ordered products' } 
    });
    if (!orderedProductsStat) {
      return res.status(404).json({ error: 'Ordered Products statistic not found' });
    }

    // Ensure ordered products statistic is a number
    orderedProductsStat.value = Math.round((safeParseNumber(orderedProductsStat.value) - itemQuantity) * 100) / 100;
    await orderedProductsStat.save();

    await item.destroy();

    res.json({ 
      message: "Item deleted successfully",
      deletedItemDetails: {
        id: item.id,
        name: item.name,
        totalPaid: totalPaid,
        quantity: itemQuantity
      }
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ 
      error: "Server error", 
      details: error.message,
      fullError: error
    });
  }
};

exports.confirmOrder = async (req, res) => {
  const { tracking_id, shipping_mark } = req.body;
  try {
    const item = await Inventory.findOne({ where: { tracking_id } });

    if (!item) {
      const orderEntry = await Order.create({
        tracking_id,
        shipping_mark,
        status: 'no match',
      });

      return res.status(200).json({
        message: 'Item not found with the provided tracking ID. Order recorded with status "no match".',
        order: orderEntry,
      });
    }

    if (item.status === 'delivered') {
      return res.status(200).json({ message: 'Item is already delivered' });
    }

    item.status = 'delivered';
    item.date_of_delivery = new Date().toISOString().slice(0, 10); 
    await item.save();

    const orderEntry = await Order.create({
      tracking_id,
      shipping_mark, 
      status: 'delivered',
    });

    res.status(200).json({
      message: 'Order confirmed, item status updated to delivered, and order details saved',
      item,
      order: orderEntry,
    });
  } catch (error) {
    console.error('Error confirming order:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Duplicate tracking ID. An order with this tracking ID already exists.',
      });
    }

    res.status(500).json({ error: 'Server error, please try again later.' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    if (orders.length === 0) {
      return res.status(200).json({
        message: 'No orders found in the database.',
        orders: []
      });
    }

    res.status(200).json({
      message: 'Orders retrieved successfully.',
      orders,
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({
      error: 'Server error, please try again later.',
    });
  }
};

exports.getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Inventory.findByPk(id);
    if (!item) {
      return res.status(404).json({
        error: `Item with ID ${id} not found`
      });
    }
    return res.status(200).json({
      message: 'Item found successfully',
      item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({
      error: 'Server error, could not fetch item',
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order by its ID
    const order = await Order.findByPk(id);

    // If the order does not exist, return a 404 error
    if (!order) {
      return res.status(404).json({
        message: 'Order not found.',
      });
    }

    // Delete the order
    await order.destroy();

    res.status(200).json({
      message: 'Order deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      error: 'Server error, please try again later.',
    });
  }
};

exports.getInventoryByUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const inventory = await Inventory.findAll({
      where: { user_id: userId },
    });

    res.json(inventory);
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



