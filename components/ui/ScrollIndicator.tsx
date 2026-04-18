export default function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/50">
        Scroll to explore
      </div>
      <div className="relative h-10 w-px bg-ink/20 overflow-hidden">
        <span className="absolute left-1/2 -translate-x-1/2 top-0 block h-2 w-2 rounded-full bg-lime animate-[slideDown_2s_ease-in-out_infinite]" />
      </div>
      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translate(-50%, -8px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 38px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
