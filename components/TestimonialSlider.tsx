export default function Testimonials() {
    const testimonials = [
      { text: "I love this channel", author: "Just123" },
      { text: "Alex's music is so good", author: "Just123" },
      { text: "Must Subscribe!", author: "Just123" },
      { text: "I love this channel", author: "Just123" },
      { text: "Alex's music is so good", author: "Just123" },
      { text: "Must Subscribe!", author: "Just123" },
    ];
  
    return (
      <div className="grid grid-cols-3 gap-4 w-full px-4 py-2 bg-black/20">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="flex flex-col items-start"
          >
            <p className="text-white text-sm">"{testimonial.text}"</p>
            <span className="text-gray-400 text-sm">-{testimonial.author}</span>
          </div>
        ))}
      </div>
    );
  }