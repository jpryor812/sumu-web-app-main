'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from 'recharts';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DataItem {
  platform: string;
  fee: number;
  color: string;
}

export default function SubscriberChart() {
  const [isMounted, setIsMounted] = useState(false);
  const [animatedData, setAnimatedData] = useState<DataItem[]>([]);
  
  const finalData: DataItem[] = [
    { platform: 'TikTok', fee: 50000, color: '#D1D1D1' },
    { platform: 'YouTube', fee: 15000, color: '#D1D1D1' },
    { platform: 'Instagram', fee: 10000, color: '#D1D1D1' },
    { platform: 'Blog', fee: 10000, color: '#D1D1D1' },
    { platform: 'Sumu', fee: 50, color: '#00bf63' }
  ];

  useEffect(() => {
    setIsMounted(true);
    
    // Start all bars at 0
    const initialData = finalData.map(item => ({ ...item, fee: 0 }));
    setAnimatedData(initialData);

    // Animate all bars to their final values simultaneously
    setTimeout(() => {
      setAnimatedData(finalData);
    }, 100);
  }, []);

  interface CustomLabelProps {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    value?: string | number;
  }
  
  const renderCustomLabel = (props: CustomLabelProps) => {
    const { x = 0, y = 0, width = 0, value = 0 } = props;
    const xPos = typeof x === 'string' ? parseFloat(x) : x;
    const yPos = typeof y === 'string' ? parseFloat(y) : y;
    const widthVal = typeof width === 'string' ? parseFloat(width) : width;
    
    const formattedValue = Number(value).toLocaleString();
    return (
      <text 
        x={xPos + (widthVal/2)}
        y={yPos} 
        fill="white" 
        textAnchor="middle" 
        dy={-10}
      >
        {formattedValue}
      </text>
    );
  };

  if (!isMounted) {
    return null;
  }

  // Add this custom tick renderer function before your return statement
  interface CustomTickProps {
    x?: string | number;
    y?: string | number;
    payload: {
      value: string | number;
    };
  }
  
  const CustomXAxisTick = (props: CustomTickProps) => {
    const { x = 0, y = 0, payload } = props;
    const xPos = typeof x === 'string' ? parseFloat(x) : x;
    const yPos = typeof y === 'string' ? parseFloat(y) : y;
    
    return (
      <g transform={`translate(${xPos},${yPos})`}>
        <text 
          x={0} 
          y={18} 
          dy={0} 
          textAnchor="middle" 
          fill="white"
          fontSize="20"
          fontWeight="600"
        >
          {payload.value}
        </text>
        {payload.value === "Suum" && (
          <text
            x={0}
            y={30}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="400"
          >
            ($20/month subscription)
          </text>
        )}
      </g>
    );
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 60}}
        whileInView={{ opacity: 1, y: 0}}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay: 0.5,
          ease: "easeOut"
        }}
        className="pt-32 text-3xl md:text-5xl font-semibold text-center text-white px-8 lg:px-64 md:px-48 sm:px-32"
      >
        <h5>Not Sure Whether to Charge For Your Content? Here&apos;s Why You Should:</h5>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 60}}
        whileInView={{ opacity: 1, y: 0}}
        viewport={{ once: true }}
        transition={{
          duration: 1.2,
          delay: 0.5,
          ease: "easeOut"
        }}
        className="flex flex-col lg:flex-row justify-around px-4 lg:px-6"
      >
        <div className="flex flex-col items-center pl-2 lg:pl-8 pt-4">
          <div className="flex flex-col py-12">
            <div className="text-xl md:2-xl lg:text-4xl text-white pb-4">
              <p>Multiply your earnings by</p>
            </div>
              <div className="text-7xl md:text-8xl xl:text-9xl gradient-text">
                <p>1,000x</p>
              </div>  
                <div className="text-xl md:2-xl lg:text-3xl text-white pt-4">
                <p>Don&apos;t rely on third-party algorithms and advertisers to earn money for your content. 
                    Instead, connect with your true fans directly and reward them with exclusive content that makes them feel closer to you.</p>
                </div>
            </div>
          </div>
        <div className="flex items-center justify-center md:p-2 lg:p-6">
        <div className="-mb-32 sm:mb-2 transform scale-[0.55] sm:scale-75 md:scale-90 lg:scale-90 xl:scale-100 origin-top">
          <div className="max-w-3xl flex flex-col rounded-3xl p-4 items-center">
            <h2 className="text-white text-center mb-4 text-xl font-semibold">Average Subscribers/Followers needed for $1,000/month from ads</h2>
            <BarChart 
              width={700} 
              height={450} 
              data={animatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 15 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="platform" 
                stroke="white" 
                fontSize="20" 
                fontWeight="600"
                tick={CustomXAxisTick}
              />
              <YAxis 
                tickFormatter={(value) => value.toLocaleString()}
                stroke="white"
                domain={[0, 60000]}
                fontSize="20"
                fontWeight="600"
              />
              <Bar 
                dataKey="fee" 
                barSize={60}
                fill="#6B7280"
                stroke=""
                radius={[10, 10, 0, 0]}
                isAnimationActive={true}
                animationDuration={2000}
                animationBegin={0}
                animationEasing="ease-in-out"
              >
                <LabelList dataKey="fee" content={renderCustomLabel} />
                {finalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </div>
      </div>
      </div>
      </motion.div>
    </div>
  );
}