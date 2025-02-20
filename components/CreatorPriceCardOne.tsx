export default function CreatorPriceCardOne() {
    return (
      <div className="bg-white rounded-3xl w-2/5 p-4 m-2">
        <div className="flex flex-col">
          <div className="text-black text-lg font-semibold">
            <p>Big Fan</p>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <div className="text-black text-lg font-semibold pb-2">
              <p>$5/month</p>
            </div>
            <div className="text-black text-xs">
              <p>General Support</p>
            </div>
          </div>
          <div className="bg-pink-300 h-6 px-10 md:px-20 rounded-full mx-auto">
            <div className="text-white text-md font-semibold text-center">
              <p>Join</p>
            </div>
          </div>
          <div className="text-black text-xs pt-2">
            <p>
              Your support means the world to me and allows me to spend more time
              making great music for you to listen to.
            </p>
          </div>
        </div>
      </div>
    );
  }
  