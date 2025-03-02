'use client'

import Image from "next/image";
import { MessageCircle, HeartIcon, Repeat2 } from "lucide-react";

export default function SocialFeed() {
  return (
    <div className="mx-auto">
      {/* First Post */}
      <div className="mb-6">
        <div className="bg-black border-gray-800 border-2 rounded-2xl w-full">
          <div className="flex items-center gap-3 p-3">
            <Image
              src="/alex-profile.png"
              alt="alex Album Cover"
              height={32}
              width={32}
              className="rounded-full"
            />
            <div className="flex items-center gap-2 flex-grow">
              <span className="text-sm font-semibold text-gray-200">
                Alex Dethero
              </span>
              <span className="text-xs text-gray-500">6:45pm</span>
            </div>
          </div>

          <div className="px-4 pb-2">
            <p className=" sm:text-md font-semibold text-gray-200">
              Listened to some classic jazz at work today and I&apos;m feeling creative.
              Surprise live music making session tonight at 8:00pm est. for all of
              my fans! Looking forward to chatting with you all and making some
              hits!!
            </p>
          </div>

          <div className="px-4 py-2">
            <div className="relative w-full aspect-[2/1]">
              <Image
                src="/alex-tweet-image.png"
                alt="alex post image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center gap-12 md:gap-24 p-4">
            <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <MessageCircle size={20} />
              <span>9</span>
            </button>
            <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <Repeat2 size={20} />
              <span>5</span>
            </button>
            <button className="text-sm sm:text-md flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <HeartIcon size={20} />
              <span>22</span>
            </button>
          </div>
        </div>
      </div>

      {/* Second Post */}
      <div className="mb-6">
        <div className="bg-black border-gray-800 border-2 rounded-2xl w-full">
          <div className="flex items-center gap-3 p-4">
            <Image
              src="/profile_picture.jpg"
              alt="Justin profile picture"
              height={32}
              width={32}
              className="rounded-full"
            />
            <div className="flex items-center gap-2 flex-grow">
              <span className="text-sm font-semibold text-gray-200">
                Justin Pryor
              </span>
              <span className="text-xs text-gray-500">6:25pm</span>
            </div>
          </div>

          <div className="px-4 pb-2">
            <p className="text-md font-semibold text-gray-200">
              Seeing some really interesting after hours trades in Acme. Corp... 
              Looking forward to an exciting and profitable trading session with you all bright and early tomorrow!
            </p>
          </div>

          <div className="px-6 py-2">
            <div className="relative w-full aspect-[2/1]">
              <Image
                src="/Daytrade-chart.png"
                alt="Daytrade chart image"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center gap-12 md:gap-24 p-4">
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <MessageCircle size={20} />
              <span>7</span>
            </button>
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <Repeat2 size={20} />
              <span>4</span>
            </button>
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <HeartIcon size={20} />
              <span>19</span>
            </button>
          </div>
        </div>
      </div>

      {/* Third Post */}
      <div className="mb-6">
        <div className="bg-black border-gray-800 border-2 rounded-2xl w-full">
          <div className="flex items-center gap-3 p-4">
            <Image
              src="/profile-800x800.png"
              alt="Photographer girl"
              height={32}
              width={32}
              className="rounded-full"
            />
            <div className="flex items-center gap-2 flex-grow">
              <span className="text-sm font-semibold text-gray-200">
                Life Though Lenses
              </span>
              <span className="text-xs text-gray-500">6:10pm</span>
            </div>
          </div>

          <div className="px-4 pb-2">
            <p className="text-md font-semibold text-gray-200">
              I had a magical day through Amsterdam today. Took some beautiful pictures that
              I can&apos;t wait to mint and raffle off to you all next week! Here&apos;s a sneak peek of one of my favorites.   
            </p>
          </div>

          <div className="px-6 py-2">
            <div className="relative w-full aspect-[2/1]">
              <Image
                src="/amsterdam.jpeg"
                alt="amsterdam"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center gap-12 md:gap-24 p-4">
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <MessageCircle size={20} />
              <span>15</span>
            </button>
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <Repeat2 size={20} />
              <span>8</span>
            </button>
            <button className="flex items-center gap-1 text-gray-300 hover:text-gray-100">
              <HeartIcon size={20} />
              <span>34</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}