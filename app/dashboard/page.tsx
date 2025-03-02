import CreatorDashboard from '@/components/CreatorDashboard';
import StaticAura from '@/components/StaticAura';
export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <StaticAura>
        <CreatorDashboard />
      </StaticAura>
    </div>
  );
} 