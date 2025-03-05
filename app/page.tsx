import HomePage from '@/components/HomePage';
import StaticAura from '@/components/StaticAura';
import Link from 'next/link';
export default function Home() {

  return (
  <div className="flex flex-col h-screen">
  <StaticAura>
    <HomePage />
  </StaticAura>
  <Link href="/signup" className="btn btn-primary">
  Sign Up as a Creator
</Link>
</div>
)
}