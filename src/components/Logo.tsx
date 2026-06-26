
interface LogoProps {
  className?: string;
  dark?: boolean;
}

export default function Logo({ className = '', dark = false }: LogoProps) {
  const textColor = dark ? 'text-white' : 'text-primary';
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`flex items-end font-serif leading-none ${textColor}`}>
        <span className="text-[1.3em]">L</span>
        <span className="text-[1.3em] ml-[-0.2em]">U</span>
      </div>
      <span className={`text-[0.25em] uppercase tracking-[0.4em] font-medium ${textColor} mt-1 ml-[0.4em]`}>
        Studio
      </span>
    </div>
  );
}
