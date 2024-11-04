import React from "react";
import {
  Line,
  LineChart,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface ChartData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

const ExpenseChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const processTransactions = (): ChartData[] => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const dailyData: { [key: string]: ChartData } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString(); // Format to YYYY-MM-DD
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: date,
          income: 0,
          expense: 0,
          balance: 0
        };
      }
      
      if (transaction.type === 'income') {
        dailyData[date].income += transaction.amount;
        dailyData[date].balance += transaction.amount;
      } else {
        dailyData[date].expense += Math.abs(transaction.amount);
        dailyData[date].balance -= Math.abs(transaction.amount);
      }
    });
    
    return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = processTransactions();

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date"
          tick={{ fill: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
        />
        <YAxis
          tick={{ fill: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toFixed(2)}`, '']}
          labelStyle={{ color: '#4B5563' }}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '4px',
            padding: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone"
          dataKey="income" 
          name="Income" 
          stroke="#10B981"
          strokeWidth={2}
          dot={{ fill: '#10B981', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone"
          dataKey="expense" 
          name="Expense" 
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ fill: '#EF4444', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone"
          dataKey="balance" 
          name="Balance" 
          stroke="#6366F1"
          strokeWidth={2}
          dot={{ fill: '#6366F1', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
