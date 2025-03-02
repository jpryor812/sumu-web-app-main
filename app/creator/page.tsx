import CreatorPage from '@/components/CreatorPage';
import StaticAura from '@/components/StaticAura';

export default function Creator() {
      return (
        <div className="flex flex-col h-screen">
          <StaticAura>
            <CreatorPage />
          </StaticAura>
        </div>
      );
} 