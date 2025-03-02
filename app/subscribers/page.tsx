import StaticAura from '@/components/StaticAura';
import SubscriberList from '@/components/SubscriberList';

export default function SubscribersPage() {
  return (
    <div className="flex flex-col h-screen">
    <StaticAura>
      <SubscriberList />
    </StaticAura>
  </div>
  )
  }