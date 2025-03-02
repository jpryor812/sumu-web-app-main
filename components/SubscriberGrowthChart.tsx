import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

interface DataPoint {
  date: string;
  subscribers: number;
  fullDate: Date;
}

interface ActivePoint {
  dataKey: string;
  value: number;
  index: number;
  date: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: DataPoint;
  }>;
}

const SubscriberChart: React.FC = () => {
  // Generate fake daily subscriber data with a steadier upward trend
  const generateData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const startDate = new Date(2025, 1, 1); // February 1, 2025
    let currentValue = 120; // Start a bit higher to match the image
    
    for (let i = 0; i < 28; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Generate more steady growth with occasional plateaus
      let change = Math.floor(Math.random() * 15); // Smaller fluctuations
      // Add some trend to get higher toward the end
      if (i > 20) change += 5;
      
      // Occasional plateaus
      if (i % 5 === 0) change = 0;
      
      currentValue = Math.max(currentValue + change, currentValue);
      
      data.push({
        date: `2/${date.getDate()}`, // Format as month/day
        subscribers: currentValue,
        fullDate: date
      });
    }
    
    return data;
  };

  const [data] = useState<DataPoint[]>(generateData());
  const [activePoint, setActivePoint] = useState<ActivePoint | null>(null);

  const handleMouseOver = (data: DataPoint, index: number): void => {
    setActivePoint({
      dataKey: 'subscribers',
      value: data.subscribers,
      index,
      date: data.date
    });
  };

  const handleMouseLeave = (): void => {
    setActivePoint(null);
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-3 rounded-md shadow-lg">
          <p className="text-lg font-bold text-center">{payload[0].value}</p>
          <p className="text-xs text-center">SUBSCRIBERS - {payload[0].payload.date.toUpperCase()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg overflow-hidden p-0 max-w-6xl mx-auto">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: -10, left: -10, bottom: 0 }}
            onMouseMove={(e: any) => {
              if (e && e.activeTooltipIndex !== undefined) {
                handleMouseOver(data[e.activeTooltipIndex], e.activeTooltipIndex);
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#02760A" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#02760A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#2D3748" 
              vertical={false} 
              horizontalPoints={[100, 200, 300]} // Match specific grid lines from image
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={{ stroke: "#2D3748" }} 
              tickLine={false}
              tick={{ fill: '#A0AEC0', fontSize: 14 }}
              padding={{ left: 0, right: 0 }}
              ticks={[data[0].date, data[7].date, data[14].date, data[21].date, data[27].date]}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A0AEC0', fontSize: 14 }}
              domain={[0, 310]}
              ticks={[0, 100, 200, 300]}
              padding={{ top: 10, bottom: 0 }}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            
            {/* The area fill with gradient */}
            <Area 
              type="monotone" 
              dataKey="subscribers" 
              fill="url(#colorSubscribers)"
              fillOpacity={1}
              stroke="none"
            />
            
            {/* The line on top */}
            <Line 
              type="monotone" 
              dataKey="subscribers" 
              stroke="#02760A"
              strokeWidth={3}
              dot={{ r: 3, fill: "#02760A", stroke: "#02760A", strokeWidth: 1 }}
              activeDot={{ r: 6, fill: "#02760A", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriberChart;