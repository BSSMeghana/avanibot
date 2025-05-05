const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const botKnowledge = require('./botKnowledge');  // Static chatbot replies
const { readInventory } = require('./utils/fileHandler'); // Function to read inventory

const app = express();
const PORT = 5001;
const inventoryPath = path.join(__dirname, 'data', 'inventory.json');

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parses incoming requests with JSON payloads

// --- Chatbot Route ---
app.post('/api/chatbot/chat', (req, res) => {
  try {
    const userMessage = req.body.userMessage.toLowerCase();

    // 1. Check for static replies (e.g., "What are your store hours?")
    for (const entry of botKnowledge) {
      if (entry.keywords.some(keyword => userMessage.includes(keyword))) {
        return res.json({ reply: entry.reply });
      }
    }

    // 2. Fallback to inventory search (e.g., "What is the stock of Apples?")
    const inventory = readInventory();
    const item = inventory.items.find((item) =>
      userMessage.includes(item.name.toLowerCase())
    );

    if (item) {
      return res.json({
        reply: `The stock of ${item.name} is ${item.stock} ${item.unit}.`,
      });
    } else {
      return res.json({
        reply: "Sorry, I couldn't find that item or information.",
      });
    }
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    return res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
});

// --- Billing Route ---
app.post('/api/bill', (req, res) => {
  try {
    const billedItems = req.body.items; // [{ name: "Apples", quantity: 5 }]
    const inventory = readInventory();

    billedItems.forEach(billedItem => {
      const item = inventory.items.find(
        invItem => invItem.name.toLowerCase() === billedItem.name.toLowerCase()
      );
      if (item) {
        item.stock = Math.max(item.stock - billedItem.quantity, 0); // Prevent negative stock
      }
    });

    fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2));
    res.json({ success: true, message: 'Inventory updated.', updatedInventory: inventory });
  } catch (error) {
    console.error('Error updating inventory after billing:', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory.' });
  }
});

// --- Get Inventory Route ---


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
