export default function CreatorHeader() {
    const testimonials = [
      { text: "I love this channel", author: "Just3" },
      { text: "Alex's music is so good", author: "Just123" },
      { text: "Must Subscribe!", author: "Me123" },
      { text: "Incredible beats!", author: "Friend1" },
    ];
  
    return (
      <div className="flex flex-row items-center w-full">
        <div className="flex items-center w-full justify-between px-8 gap-4">
          {/* Left testimonials */}
          <div className="flex flex-row gap-4">
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <div 
                key={index}
                className="flex flex-col items-start bg-black/20 p-3 rounded-lg"
              >
                <p className="text-white text-sm">"{testimonial.text}"</p>
                <span className="text-gray-400 text-sm">-{testimonial.author}</span>
              </div>
            ))}
          </div>
  
          {/* Creator name */}
          <div className="text-white text-xl md:text-2xl font-semibold text-center">
            <p>Alex Dethero</p>
          </div>
  
          {/* Right testimonials */}
          <div className="flex flex-row gap-4">
            {testimonials.slice(2, 4).map((testimonial, index) => (
              <div 
                key={index}
                className="flex flex-col items-start bg-black/20 p-3 rounded-lg"
              >
                <p className="text-white text-sm">"{testimonial.text}"</p>
                <span className="text-gray-400 text-sm">-{testimonial.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }