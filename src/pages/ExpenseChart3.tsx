import React from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell
} from "recharts";

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

const COLORS = {
  income: '#10B981', // Green
  expense: '#EF4444'  // Red
};

const ExpenseChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const processTransactions = () => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Calculate total income and expense
    const totals = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += Math.abs(transaction.amount);
      }
      return acc;
    }, { income: 0, expense: 0 });

    return [
      { name: 'Income', value: totals.income },
      { name: 'Expenses', value: totals.expense }
    ];
  };

  const data = processTransactions();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data.value;
      const percentage = ((data.value / (
        data.value + (data.name === 'Income' ? 
          payload[0].payload.expense : 
          payload[0].payload.income)
      )) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-sm">
            <span className="text-gray-600">${total.toFixed(2)}</span>
            <span className="ml-2 text-gray-500">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <h3 className="text-center text-sm font-medium mb-2">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            startAngle={90}
            endAngle={450}
          >
            {data.map((entry) => (
              <Cell 
                key={`cell-${entry.name}`} 
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{
              paddingTop: "20px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;