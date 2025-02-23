import Image from 'next/image';

interface Testimonial {
  text: string;
  author: string;
}

interface TestimonialGridProps {
  testimonials?: [Testimonial | null, Testimonial | null];
}

export default function TestimonialGrid({ testimonials = [null, null] }: TestimonialGridProps) {
  return (
    <div className="grid grid-cols-3 px-8 w-full">
      {/* Container for left testimonial */}
      <div className="flex flex-col items-center justify-center mt-16">
        {testimonials[0] && (
          <>
            <p className="text-white text-sm md:text-base text-center">"{testimonials[0].text}"</p>
            <p className="text-gray-400 text-sm text-center">-{testimonials[0].author}</p>
          </>
        )}
      </div>

      {/* Container for center image */}
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/loom-placeholder.png"
          alt="loom placeholder"
          height={150}
          width={150}
        />
      </div>

      {/* Container for right testimonial */}
      <div className="flex flex-col items-center justify-center mt-16">
        {testimonials[1] && (
          <>
            <p className="text-white text-sm md:text-base text-center">"{testimonials[1].text}"</p>
            <p className="text-gray-400 text-sm text-center">-{testimonials[1].author}</p>
          </>
        )}
      </div>
    </div>
  );
}