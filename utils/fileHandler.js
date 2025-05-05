const fs = require('fs');
const path = require('path');

// Path to the inventory data file
const inventoryPath = path.join(__dirname, '../data/inventory.json');

// Read the inventory data from the file
const readInventory = () => {
  try {
    const data = fs.readFileSync(inventoryPath, 'utf-8');  // Read data as string and convert it
    return JSON.parse(data);  // Parse the string to a JavaScript object
  } catch (error) {
    console.error('Error reading inventory:', error);
    throw new Error('Error reading inventory data.');
  }
};

// Write the updated inventory data to the file
const writeInventory = (data) => {
  try {
    fs.writeFileSync(inventoryPath, JSON.stringify(data, null, 2));  // Write JSON to file
  } catch (error) {
    console.error('Error writing inventory:', error);
    throw new Error('Error writing inventory data.');
  }
};

module.exports = { readInventory, writeInventory };
