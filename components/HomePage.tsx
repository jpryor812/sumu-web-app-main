import SideNav from '@/components/SideNav';
import { Search } from 'lucide-react';
import NewPostsHome from './NewPostsHome';
import SocialFeed from './SocialFeed';
export default function HomePage() {
  const categories = ['All', 'Art', 'Music', 'Finance', 'Gaming', 'Tech', 'Fashion', 'World Affairs'];
  
  return (
    <div className="flex">
      {/* SideNav will be fixed */}
      <SideNav />
      
      {/* Main content area with its own scrolling */}
      <main className="flex-1 min-h-screen ml-16 md:ml-64 overflow-y-auto">
        <div className="p-8">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for creators by name or topic"
              className="w-full py-3 px-6 rounded-full bg-white/90 text-gray-800 placeholder-gray-600"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
          </div>

          {/* Category Navigation */}
          <nav className="mb-12">
            <ul className="flex space-x-8 justify-center">
              {categories.map((category) => (
                <li key={category}>
                  <button className={`text-white hover:text-green-300 ${
                    category === 'All' ? 'border-b-2 border-white' : ''
                  }`}>
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Toggle Section */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">All Creators</span>
              <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
              </div>
              <span className="text-white font-medium">Following</span>
            </div>
          </div>

          {/* New Posts Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">New Posts</h2>
            <NewPostsHome />
          </section>

          {/* Explore Section */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">Explore</h2>
            {/* Repeat the category navigation */}
            <nav className="mb-8">
              <ul className="flex space-x-8 justify-center">
                {categories.map((category) => (
                  <li key={category}>
                    <button className={`text-white hover:text-green-300 ${
                      category === 'All' ? 'border-b-2 border-white' : ''
                    }`}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Toggle Filters */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">All Creators</span>
                <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
                <span className="text-white font-medium">Following</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Most Liked</span>
                <div className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                </div>
                <span className="text-white font-medium">Most Recent</span>
              </div>
            </div>
          </section>
          <SocialFeed />
        </div>
      </main>
    </div>
  );
}