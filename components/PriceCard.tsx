// components/PriceCard.tsx
import { FC } from 'react';

interface PriceTier {
  title: string;
  price: number;
  annualPrice?: number;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

interface PriceCardProps {
  tiers: PriceTier[];
  isAnnual: boolean;  // Add this prop to control price display
}

const PriceCard: FC<PriceCardProps> = ({ tiers, isAnnual }) => {
  // Function to calculate monthly equivalent of annual price
  const calculateMonthlyEquivalent = (annualPrice: number): number => {
    return Number((annualPrice / 12).toFixed(2));
  };

  return (
    <div className="flex flex-col justify-center md:flex-row gap-8 w-full">
      {tiers.map((tier, index) => (
        <div 
          key={index}
          className={`relative flex flex-col p-6 rounded-xl w-full md:w-5/12 border-2 min-h-[300px]
            ${tier.isPopular 
              ? 'border-[#4040FF] bg-gray-900'
              : 'border-gray-100 bg-gray-900'}`}
        >
          {tier.isPopular && (
            <span className="absolute -top-4 right-4 text-[#4040FF] text-md font-semibold bg-gray-900 px-2">
              Most Popular
            </span>
          )}
          
          <div className="flex flex-col flex-1">
            <h3 className="text-2xl mb-1 text-white font-bold">
              {tier.title}
            </h3>

            <div className="flex items-baseline flex-wrap">
              {isAnnual ? (
                <>
                  <span className="text-gray-400 line-through mr-2">
                    ${tier.price}
                  </span>
                  <span className="text-3xl font-bold text-white">
                    ${calculateMonthlyEquivalent(tier.annualPrice || tier.price * 12 * 0.85)}
                  </span>
                  <span className="text-gray-400 ml-1">/month</span>
                  <div className="w-full text-sm text-gray-400 mt-1">
                    Billed annually at ${tier.annualPrice || tier.price * 12 * 0.85}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold text-white">
                    ${tier.price}
                  </span>
                  <span className="text-gray-400 ml-1">/month</span>
                </>
              )}
            </div>

            <p className="text-gray-200 font-semibold text-md mt-4">
              {tier.description}
            </p>

            <ul className="space-y-3 mt-4">
              {tier.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start">
                  <svg 
                    className={`h-6 w-6 ${tier.isPopular ? 'text-[#4040FF]' : 'text-gray-400'} mr-2`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-200 font-semibold text-md">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-6 w-full bg-[#4040FF] text-xl font-semibold text-white py-2 px-4 rounded-lg hover:bg-[#3030DD] transition-colors">
            Join
          </button>
        </div>
      ))}
    </div>
  );
};

export default PriceCard;