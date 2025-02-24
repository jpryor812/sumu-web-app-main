import StaticAura from '@/components/StaticAura';
import HomePage from '@/components/HomePage';

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <StaticAura>
        <HomePage />
      </StaticAura>
    </main>
  );
}