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

// Add this at the top with other imports


// Helper function to get random image


// Helper function to generate random data
const generateCreator = (
  name: string, 
  profileImage: string,
  id: string, 
  subscribersStart: number,
  subscribersNow: number,
  rank?: number,
  trend?: 'up' | 'down' | 'neutral'
): Creator => {
  const growthPercentage = ((subscribersNow - subscribersStart) / subscribersStart) * 100;
  
  // Base rewards on both growth and current subscriber count
  const baseMultiplier = subscribersNow > 150 ? 3 : subscribersNow > 50 ? 2 : 1;
  const projectedUSDC = growthPercentage * baseMultiplier;
  const projectedSUMU = subscribersNow * baseMultiplier *.8; // More SUMU for higher sub count
  
  return {
    id,
    name,
    profileImage,
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
  generateCreator("Emma Johnson", "/puja_picture.png", "1001", 25, 42, 12, 'up'),
  generateCreator("Michael Chen", "/profile_picture.jpg", "1002", 15, 26, 15, 'down'),
  generateCreator("Sophia Rodriguez", "/photo-1.jpeg", "1003", 29, 42, 17, 'up'),
  generateCreator("Noah Williams", "/photo-6.jpg", "1004", 12, 18, 21, 'neutral'),
  generateCreator("Olivia Martinez", "/photo-5.jpg", "1005", 30, 45, 23, 'up'),
];

// Tier 2: 51-150 subscribers
export const tier2Creators: Creator[] = [
  generateCreator("Liam Thompson", "/photo-6.jpg", "2001", 85, 142, 5, 'up'),
  generateCreator("Ava Garcia", "/photo-5.jpg", "2002", 60, 98, 7, 'up'),
  generateCreator("Ethan Brown", "/photo-14.jpg", "2003", 95, 135, 8, 'down'),
  generateCreator("Isabella Davis", "/photo-1.jpeg", "2004", 75, 112, 10, 'neutral'),
  generateCreator("Mason Wilson", "/photo-16.jpg", "2005", 90, 128, 11, 'up'),
];

// Tier 3: 151+ subscribers
export const tier3Creators: Creator[] = [
  generateCreator("Theresa Webb", "/profile-800x800.png", "3001", 180, 245, 1, 'up'),
  generateCreator("Floyd Miles", "/profile2-500x500.png", "3002", 165, 285, 2, 'up'),
  generateCreator("Jacob Jones", "/photo-7.jpg", "3003", 190, 280, 3, 'down'),
  generateCreator("Amelia Taylor", "/photo-4.jpeg", "3004", 175, 242, 4, 'neutral'),
  generateCreator("Taylor Moore", "/photo-3.jpeg", "3005", 155, 215, 6, 'up'),
];

// All creators combined
export const allCreators: Creator[] = [
  ...tier1Creators,
  ...tier2Creators,
  ...tier3Creators,
];

// Stats for the dashboard
export const leaderboardStats = {
  projectedPot: 1234,
  projectedSUMUPot: 5200,
  monthlyIncrease: 54,
  totalCreators: 82,
  timeRemaining: {
    days: 12,
    hours: 4,
    minutes: 21
  }
}; 