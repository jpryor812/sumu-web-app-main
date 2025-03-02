import HomePage from '@/components/HomePage';
import StaticAura from '@/components/StaticAura';
export default function Home() {
  
  return (
  <div className="flex flex-col h-screen">
  <StaticAura>
    <HomePage />
  </StaticAura>
</div>
)
}