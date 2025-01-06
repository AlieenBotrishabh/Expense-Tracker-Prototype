import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: number;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  expenseType?: 'food' | 'print' | 'travel';
}

interface ExpenseBreakdownChartProps {
  transactions?: Transaction[];
  currentCurrency?: string;
}

// Color palette for different expense types
const COLORS = {
  'food': '#3B82F6',    // Blue
  'print': '#10B981',   // Green
  'travel': '#F59E0B',  // Yellow
};

const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ 
  transactions = [], 
  currentCurrency = 'INR'  // Default to INR if not provided
}) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currentCurrency,
    signDisplay: 'never',
  });

  const processExpenses = () => {
    if (!transactions || transactions.length === 0) return [];
    
    // Filter for expenses only and group by expense type
    const expensesByType = transactions
      .filter(t => t.type === 'expense' && t.expenseType)
      .reduce((acc, transaction) => {
        const type = transaction.expenseType || 'other';
        acc[type] = (acc[type] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Convert to array format needed for pie chart
    return Object.entries(expensesByType).map(([category, amount]) => {
      const total = Object.values(expensesByType).reduce((sum, val) => sum + val, 0);
      return {
        name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
        value: amount,
        percentage: ((amount / total) * 100).toFixed(1)
      };
    });
  };

  const data = processExpenses();
  
  // Calculate month-over-month change
  const getMonthOverMonthChange = () => {
    if (!transactions || transactions.length === 0) return 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth - 1;
    
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const lastMonthExpenses = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === lastMonth)
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (lastMonthExpenses === 0) return 0;
    return ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
  };

  const monthOverMonthChange = getMonthOverMonthChange();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-sm">
            <span className="text-gray-600">{formatter.format(data.value)}</span>
            <span className="ml-2 text-gray-500">({data.percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Expense Breakdown</CardTitle>
          <CardDescription>No expense data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate total expenses
  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Expense Breakdown</CardTitle>
        <CardDescription>
          Total Expenses: {formatter.format(totalExpenses)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
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
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6B7280'}
                    className="stroke-background stroke-2"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{
                  paddingLeft: '20px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {monthOverMonthChange !== 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            {monthOverMonthChange > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-red-500">
                  Up {monthOverMonthChange.toFixed(1)}% from last month
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-green-500">
                  Down {Math.abs(monthOverMonthChange).toFixed(1)}% from last month
                </span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownChart;