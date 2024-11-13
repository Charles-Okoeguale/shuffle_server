const Inventory = require('../models/inventory');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll(); // Fetch all records from the inventory table
    res.json({ inventory }); // Send the inventory data as a response
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addInventoryItem = async (req, res) => {
    const {
      name, status, tracking_id, unit, quantity, unit_price,
      date_of_payment, shipping_fee, total_paid, shipping_fee_to_nigeria, date_of_delivery
    } = req.body;
  
    try {
      // Validate that required fields are present
      if (!name || !status || !unit || !quantity || !unit_price) {
        return res.status(400).json({ error: 'Required fields are missing' });
      }
  
      // Create a new inventory item in the database
      const newItem = await Inventory.create({
        name,
        status,
        tracking_id,
        unit,
        quantity,
        unit_price,
        date_of_payment,
        shipping_fee,
        total_paid,
        shipping_fee_to_nigeria,
        date_of_delivery
      });
  
      // Return the created item
      res.status(201).json({
        message: 'Item added to inventory successfully',
        item: newItem
      });
    } catch (error) {
      console.error('Error adding item to inventory:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

exports.editInventoryItem = async (req, res) => {
    const { id } = req.params; // Get the 'id' from the URL parameters
    const {
      name, status, tracking_id, unit, quantity, unit_price,
      date_of_payment, shipping_fee, total_paid, shipping_fee_to_nigeria, date_of_delivery
    } = req.body;
  
    try {
      // Find the item by its ID
      const item = await Inventory.findOne({ where: { id: id } });
  
      // If the item does not exist, return a 404 error
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Update the item's details
      const updatedItem = await item.update({
        name,
        status,
        tracking_id,
        unit,
        quantity,
        unit_price,
        date_of_payment,
        shipping_fee,
        total_paid,
        shipping_fee_to_nigeria,
        date_of_delivery
      });
  
      // Return the updated item as the response
      res.json({ message: 'Item updated successfully', item: updatedItem });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;  // Get the 'id' from the URL parameters
  
    try {
      // Find the item by its item_id
      const item = await Inventory.findOne({ where: { id: id } });
  
      // If the item does not exist, return a 404 error
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Delete the item
      await item.destroy();
  
      // Return a success message
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Server error' });
    }
};

exports.confirmOrder = async (req, res) => {
  const { tracking_id, shipping_mark } = req.body; // Get the tracking_id and shipping_mark from the request body

  try {
    // Find the inventory item with the given tracking_id
    const item = await Inventory.findOne({ where: { tracking_id } });

    // If no item is found with that tracking_id, return an error
    if (!item) {
      return res.status(404).json({ error: 'Item not found with the provided tracking ID' });
    }

    // If the item status is already 'delivered', do nothing and return a message
    if (item.status === 'delivered') {
      return res.status(200).json({ message: 'Item is already delivered' });
    }

    // Update the item status to 'delivered'
    item.status = 'delivered';
    item.shipping_mark = shipping_mark; // Assuming you want to store the shipping mark

    // Save the updated item back to the database
    await item.save();

    // Return a success message
    res.status(200).json({ message: 'Order confirmed and item status updated to delivered', item });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};