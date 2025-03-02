'use client'

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RevenueData {
  month: string;
  revenue: number;
}

const data: RevenueData[] = [
  { month: 'Jan', revenue: 800 },
  { month: 'Feb', revenue: 1210 },
  { month: 'Mar', revenue: 1603 },
  { month: 'Apr', revenue: 2505 },
  { month: 'May', revenue: 2912 },
  { month: 'Jun', revenue: 3534 },
  { month: 'Jul', revenue: 4162 },
];

export default function RevenueChart() {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const currentMonthRevenue = data[data.length - 1].revenue;
  const previousMonthRevenue = data[data.length - 2].revenue;
  const monthOverMonthGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1);

  // Calculate average monthly growth rate across all months
  const calculateAverageGrowth = () => {
    let totalGrowthRate = 0;
    let monthsCount = 0;

    for (let i = 1; i < data.length; i++) {
      const currentRevenue = data[i].revenue;
      const previousRevenue = data[i - 1].revenue;
      const monthlyGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
      totalGrowthRate += monthlyGrowth;
      monthsCount++;
    }

    return (totalGrowthRate / monthsCount).toFixed(1);
  };

  const averageMonthlyGrowth = calculateAverageGrowth();

  return (
    <div className="w-full bg-gray-900 rounded-xl p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
          <p className="text-white text-2xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">This Month</h3>
          <div className="flex items-center mt-2">
            <p className="text-white text-2xl font-bold">${currentMonthRevenue.toLocaleString()}</p>
            <div className="flex items-center ml-2">
              <span className={`${Number(monthOverMonthGrowth) >= 0 ? 'text-green-500' : 'text-red-500'} font-semibold text-xs`}>
                {Number(monthOverMonthGrowth) >= 0 ? '+' : ''}{monthOverMonthGrowth}% MoM
              </span>
              {Number(monthOverMonthGrowth) >= 0 ? (
                <ArrowUp size={12} className="text-green-500 ml-1" />
              ) : (
                <ArrowDown size={12} className="text-red-500 ml-1" />   
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm font-medium">Average Monthly Growth</h3>
          <p className={`text-2xl font-bold mt-2 ${Number(averageMonthlyGrowth) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {averageMonthlyGrowth}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar 
              dataKey="revenue" 
              fill="#00AA0B"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList 
                dataKey="revenue" 
                position="top" 
                fill="#FaFaFa"
                formatter={(value: number) => `$${value.toLocaleString()}`}
                offset={10}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 