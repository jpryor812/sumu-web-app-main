import StaticAura from '@/components/StaticAura';
import LeaderboardPage from '@/components/LeaderboardPage';
import CreatorPage from '@/components/CreatorPage';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <StaticAura>
        <CreatorPage />
      </StaticAura>
    </main>
  );
}