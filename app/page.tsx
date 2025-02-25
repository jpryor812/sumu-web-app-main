import StaticAura from '@/components/StaticAura';
import LeaderboardPage from '@/components/LeaderboardPage';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <StaticAura>
        <LeaderboardPage />
      </StaticAura>
    </main>
  );
}