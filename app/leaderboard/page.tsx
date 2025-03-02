import LeaderboardPage from '@/components/LeaderboardPage';
import StaticAura from '@/components/StaticAura';

export default function Leaderboard() {
  return (
    <div className="flex flex-col h-screen">
      <StaticAura>
        <LeaderboardPage />
      </StaticAura>
    </div>
  );
} 