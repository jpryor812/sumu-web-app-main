import StaticAura from '@/components/StaticAura';
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