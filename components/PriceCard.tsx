// components/PriceCard.tsx
import { FC } from 'react';

interface PriceTier {
  title: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface PriceCardProps {
  tiers: PriceTier[];
}

const PriceCard: FC<PriceCardProps> = ({ tiers }) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {tiers.map((tier, index) => (
        <div 
        key={index}
        className={`relative flex flex-col p-6 rounded-xl w-full md:w-1/2 border-2 
          ${tier.isPopular 
            ? 'border-[#4040FF] bg-gray-900' // Using the same blue color
            : 'border-gray-100 bg-gray-900'}`}
      >
        {tier.isPopular && (
          <span className="absolute -top-3 right-4 text-[#4040FF] text-sm font-semibold bg-gray-900 px-2">
            Most Popular
          </span>
            )}
            
            <h3 className="text-xl text-white font-bold">
              {tier.title}
            </h3>

            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-white">
                ${tier.price}
              </span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>

            <p className="text-gray-300">
              {tier.description}
            </p>

            <ul className="space-y-3">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <svg className="h-6 w-6 text-[#4040FF] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="mt-6 w-full bg-[#4040FF] text-white py-2 px-4 rounded-lg hover:bg-[#3030DD] transition-colors">
              Join
            </button>
          </div>
      ))}
    </div>
  );
};

export default PriceCard;