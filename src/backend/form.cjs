const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your React frontend
}));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/expenseTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Transaction Schema and Model
const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },  // income or expense
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  expenseType: { type: String }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.post('/transaction', async (req, res) => {
  try {
    const { name, amount, type, date, expenseType } = req.body;

    if (!name || !amount || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill out all required fields' 
      });
    }

    const newTransaction = new Transaction({
      name,
      amount: parseFloat(amount),
      type,
      date: date || undefined,
      expenseType
    });

    const savedTransaction = await newTransaction.save();
    console.log('Transaction saved:', savedTransaction);

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: savedTransaction
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete transaction
app.delete('/transaction/:id', async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    
    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server
const PORT = 3000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
