export default function BackgroundAura() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]" />
      <div className="absolute left-[10%] top-[20%] h-[400px] w-[600px] bg-[#4040FF] opacity-20 blur-[100px]" />
      <div className="absolute right-[10%] bottom-[20%] h-[400px] w-[600px] bg-[#00AA0B] opacity-20 blur-[100px]" />
    </div>
  );
} 