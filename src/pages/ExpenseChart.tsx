import React from "react";
import {
  Bar,
  BarChart,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis
} from "recharts";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

const ExpenseChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const processTransactions = (): ChartData[] => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const monthlyData: { [key: string]: ChartData } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          income: 0,
          expense: 0
        };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expense += Math.abs(transaction.amount);
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      return new Date(`${aMonth} 20${aYear}`) - new Date(`${bMonth} 20${bYear}`);
    });
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
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis 
          dataKey="month"
          tick={{ fill: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
        />
        <YAxis
          tick={{ fill: '#4B5563' }}
          tickLine={{ stroke: '#4B5563' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
          labelStyle={{ color: '#4B5563' }}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #E5E7EB'
          }}
        />
        <Legend />
        <Bar 
          dataKey="income" 
          name="Income" 
          fill="#10B981" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="expense" 
          name="Expense" 
          fill="#EF4444" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;