import Image from 'next/image';

export default function SocialMedia() {
    return(
        <div className="flex flex row justify-center align-center gap-4 sm:gap-8 md:gap-12 mb-12">
            <a 
                href="https://x.com/get_sumu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
            >
                <Image
                    src="/x_logo_copy.png"
                    alt="X Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </a>
            <a 
                href="https://warpcast.com/sumu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity rounded-full"
            >
                <Image
                    src="/warpcast_logo.png"
                    alt="Warpcast Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </a>
            <a 
                href="https://www.tiktok.com/@get_sumu?_t=ZP-8tskroOzGcI&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity rounded-full"
            >
                <Image
                    src="/tiktok_logo.png"
                    alt="TikTok Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </a>
            <a 
                href="https://www.instagram.com/get_sumu_xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity rounded-full"
            >
                <Image
                    src="/instagram_logo.jpg"
                    alt="Instagram Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
            </a>
        </div>
    )
}