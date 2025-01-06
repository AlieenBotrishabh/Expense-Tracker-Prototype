// ExpenseTracker.js
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp } from "lucide-react";
import ExpenseChart from './ExpenseBreakdownChart';  // Correct import
import ExpenseChart2 from './ExpenseChart2';  // Correct import
import ExpenseChart3 from './ExpenseChart';  // Correct import
import TabNavigation from './TabNavigation';  // Import the new TabNavigation component

const Expense = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [currentCurrency, setCurrentCurrency] = useState('INR');
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [status, setStatus] = useState('');

  const formRef = useRef(null);

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currentCurrency,
    signDisplay: 'always',
  });

  useEffect(() => {
    updateTotal();
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions, currentCurrency]);

  const updateTotal = () => {
    const incomeTotal = transactions
      .filter((trx) => trx.type === 'income')
      .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
      .filter((trx) => trx.type === 'expense')
      .reduce((total, trx) => total + trx.amount, 0);

    // Set as numbers for calculations, format only when displaying
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setBalance(incomeTotal - expenseTotal);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((trx) => trx.id !== id);
    setTransactions(updatedTransactions);
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const name = formData.get('name');
    const amount = parseFloat(formData.get('amount'));
    const date = formData.get('date') || new Date().toISOString().split('T')[0];
    const type = formData.get('type');
    const expenseType = formData.get('expenseType');

    if (!name || isNaN(amount) || !type) {
      setStatus('Please fill out all fields correctly.');
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name,
      amount,
      date,
      type,
      expenseType,
    };

    setTransactions([...transactions, newTransaction]);
    formRef.current.reset();
    setStatus('Transaction added successfully!');
  };

  const currencyOptions = ['INR', 'USD', 'EUR'];

  const handleCurrencyChange = (e) => {
    setCurrentCurrency(e.target.value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-4">
            <div className="total-info space-y-4">
              <div className='text-green-600'>
                <h2 className="font-bold">Balance</h2>
                <p className="text-xl">{formatter.format(balance)}</p>
              </div>
              <div className='text-blue-600'>
                <h2 className="font-bold">Income</h2>
                <p className="text-xl">{formatter.format(income)}</p>
              </div>
              <div className='text-red-600 border-b border-gray-200 pb-4'>
                <h2 className="font-bold">Expense</h2>
                <p className="text-xl">{formatter.format(-expense)}</p>
              </div>
              <div className='border-b border-gray-200 pb-4'>
                <ExpenseChart transactions={transactions} />
              </div>
            </div>
          </div>
        );
      
      case 'add':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
            <form ref={formRef} onSubmit={addTransaction} className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Name of transaction"
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
                type="text"
              />
              <select
                name="type"
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
                onChange={handleCurrencyChange}
                value={currentCurrency}
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <input
                name="amount"
                placeholder="Amount"
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
                type="number"
              />
              <input
                name="date"
                placeholder="Date"
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
                type="date"
              />
              <select
                name="expenseType"
                className="bg-gray-100 text-gray-800 border-0 rounded-lg p-2"
              >
                <option value="food">Food</option>
                <option value="print">Print</option>
                <option value="travel">Travel</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
              >
                Add Transaction
              </button>
            </form>
            {status && (
              <p className={`mt-4 text-center ${
                status.includes('success') ? 'text-green-600' : 'text-red-600'
              }`}>
                {status}
              </p>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <ul className="space-y-2">
              {transactions.map(({ id, name, amount, date, type, expenseType }) => (
                <li key={id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{name}</h4>
                    <p className="text-sm text-gray-600">{new Date(date).toLocaleDateString()}</p>
                    {expenseType && (
                      <p className="text-sm text-gray-500">Type: {expenseType}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`${type === 'income' ? 'text-blue-600' : 'text-red-600'}`}>
                      {formatter.format(amount * (type === 'income' ? 1 : -1))}
                    </span>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteTransaction(id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No transactions found.</p>
            )}
          </div>
        );
      
      case 'charts':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className='w-full flex flex-col md:flex-row gap-4'>
              <div className="w-full md:w-1/2">
                <ExpenseChart2 transactions={transactions} />
              </div>
              <div className="w-full md:w-1/2">
                <ExpenseChart3 
                  transactions={transactions} 
                  currentCurrency={currentCurrency}
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </Card>
  );
};

export default Expense;
