export type Creator = {
  id: string;
  name: string;
  profileImage: string;
  subscribersStart: number;
  subscribersNow: number;
  growthPercentage: number;
  projectedUSDC: number;
  projectedSUMU: number;
  rank?: number;
  trend?: 'up' | 'down' | 'neutral';
};

// Helper function to generate random data
const generateRandomData = (
  name: string, 
  id: string, 
  subscriberRange: [number, number],
  rank?: number,
  trend?: 'up' | 'down' | 'neutral'
): Creator => {
  // Generate subscribers within the given range
  const subscribersNow = Math.floor(Math.random() * (subscriberRange[1] - subscriberRange[0])) + subscriberRange[0];
  
  // Calculate starting subscribers (10-30% less than current)
  const reductionPercent = Math.random() * 0.2 + 0.1; // 10-30%
  const subscribersStart = Math.floor(subscribersNow * (1 - reductionPercent));
  
  // Calculate growth percentage
  const growthPercentage = ((subscribersNow - subscribersStart) / subscribersStart) * 100;
  
  // Calculate projected rewards based on growth
  const projectedUSDC = growthPercentage * 2.5 + Math.random() * 50; // Example formula
  const projectedSUMU = growthPercentage * 10 + Math.random() * 200; // Example formula
  
  return {
    id,
    name,
    profileImage: "/puja_picture.png", // Same image for all creators
    subscribersStart,
    subscribersNow,
    growthPercentage,
    projectedUSDC,
    projectedSUMU,
    rank,
    trend
  };
};

// Tier 1: 1-50 subscribers
export const tier1Creators: Creator[] = [
  generateRandomData("Emma Johnson", "1001", [30, 50], 12, 'up'),
  generateRandomData("Michael Chen", "1002", [20, 40], 15, 'down'),
  generateRandomData("Sophia Rodriguez", "1003", [35, 50], 17, 'up'),
  generateRandomData("Noah Williams", "1004", [15, 30], 21, 'neutral'),
  generateRandomData("Olivia Martinez", "1005", [40, 50], 23, 'up'),
];

// Tier 2: 51-150 subscribers
export const tier2Creators: Creator[] = [
  generateRandomData("Liam Thompson", "2001", [100, 150], 5, 'up'),
  generateRandomData("Ava Garcia", "2002", [70, 100], 7, 'up'),
  generateRandomData("Ethan Brown", "2003", [120, 150], 8, 'down'),
  generateRandomData("Isabella Davis", "2004", [60, 90], 10, 'neutral'),
  generateRandomData("Mason Wilson", "2005", [90, 130], 11, 'up'),
];

// Tier 3: 151-350 subscribers
export const tier3Creators: Creator[] = [
  generateRandomData("Theresa Webb", "3001", [300, 350], 1, 'up'),
  generateRandomData("Floyd Miles", "3002", [250, 300], 2, 'up'),
  generateRandomData("Jacob Jones", "3003", [200, 300], 3, 'down'),
  generateRandomData("Amelia Taylor", "3004", [180, 250], 4, 'neutral'),
  generateRandomData("Benjamin Moore", "3005", [160, 220], 6, 'up'),
];

// Tier 4: 351-750 subscribers
export const tier4Creators: Creator[] = [
  generateRandomData("Charlotte Anderson", "4001", [500, 750], 1, 'up'),
  generateRandomData("Lucas Thomas", "4002", [450, 600], 2, 'down'),
  generateRandomData("Mia Jackson", "4003", [600, 750], 3, 'up'),
  generateRandomData("Henry White", "4004", [400, 500], 4, 'neutral'),
  generateRandomData("Evelyn Harris", "4005", [650, 750], 5, 'up'),
];

// Tier 5: 750+ subscribers
export const tier5Creators: Creator[] = [
  generateRandomData("Alexander Clark", "5001", [1000, 1500], 1, 'up'),
  generateRandomData("Abigail Lewis", "5002", [800, 1200], 2, 'up'),
  generateRandomData("Daniel Lee", "5003", [1500, 2000], 3, 'down'),
  generateRandomData("Sofia Walker", "5004", [800, 1000], 4, 'neutral'),
  generateRandomData("William Hall", "5005", [2000, 2500], 5, 'up'),
];

// All creators combined
export const allCreators: Creator[] = [
  ...tier1Creators,
  ...tier2Creators,
  ...tier3Creators,
  ...tier4Creators,
  ...tier5Creators,
];

// Stats for the dashboard
export const leaderboardStats = {
  projectedPot: 8734,
  monthlyIncrease: 14,
  totalCreators: 432,
  timeRemaining: {
    days: 12,
    hours: 4,
    minutes: 21
  }
}; 