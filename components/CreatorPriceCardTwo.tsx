export default function CreatorPriceCardTwo() {
    return (
      <div className="bg-white rounded-3xl w-2/5 p-4 m-2">
        <div className="flex flex-col">
          <div className="text-black text-lg font-semibold">
            <p>Super Fan</p>
          </div>
          <div className="flex flex-row gap-6 items-center">
            <div className="text-black text-lg font-semibold pb-2">
              <p>$20/month</p>
            </div>
            <div className="text-black text-xs">
              <p>General Support + Perks</p>
            </div>
          </div>
          <div className="bg-pink-300 h-6 px-10 md:px-20 rounded-full mx-auto">
            <div className="text-white text-md font-semibold text-center">
              <p>Join</p>
            </div>
          </div>
          <div className="text-black text-xs pt-2">
            <p>Get Access to:</p>
            <ol className="list-decimal text-xs font-semibold pl-5">
              <li>Early Music Drops</li>
              <li>
                Bi-weekly live recording sessions with Q&A and requests while I&apos;m making a song
              </li>
              <li>
                Access to a private group chat with me and all the other super fans to chat about music
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
  