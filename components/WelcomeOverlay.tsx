
import React from 'react';

interface WelcomeOverlayProps {
  onStart: () => void;
}

const BrandLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <path d="M50 20L85 80H15L50 20Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M50 25L75 70H25L50 25Z" fill="currentColor" />
    <path d="M35 55L50 30L65 55L50 45L35 55Z" fill="black" fillOpacity="0.2" />
    <path d="M50 25L55 35H45L50 25Z" fill="white" fillOpacity="0.4" />
    <path d="M30 80C30 80 40 60 50 60C60 60 70 80 70 80" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
    <circle cx="50" cy="22" r="3" fill="white" className="animate-pulse" />
  </svg>
);

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 bg-navy-950 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-brand-red/15 to-transparent animate-pulse duration-[4000ms]"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-brand-red/10 blur-[150px] rounded-full animate-float"></div>
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 md:space-y-20 relative z-10 flex flex-col items-center">
        
        <div className="relative inline-block animate-in fade-in zoom-in-95 duration-1000 ease-out">
          <div className="absolute inset-0 bg-brand-red/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse-glow"></div>
          
          <div className="relative w-28 h-28 md:w-64 md:h-64 flex items-center justify-center mx-auto bg-navy-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] md:rounded-[4.5rem] shadow-2xl group transition-all duration-700">
             <BrandLogo className="w-14 h-14 md:w-32 md:h-32 text-white group-hover:rotate-6 transition-transform duration-700" />
          </div>
        </div>

        <div className="space-y-4 md:space-y-8">
          <div className="space-y-2 md:space-y-4 overflow-hidden">
            <div className="animate-in slide-in-from-top-6 md:slide-in-from-top-12 duration-1000 delay-300 fill-mode-both">
              <span className="text-[8px] md:text-xs font-black text-brand-red uppercase tracking-[0.4em] md:tracking-[0.8em] block italic">
                Authorized Adventure Portal
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.85] italic animate-in slide-in-from-bottom-12 md:slide-in-from-bottom-24 duration-1000 delay-500 fill-mode-both">
              Jejak <span className="text-brand-red">Langkah.</span>
            </h1>
          </div>
          
          <div className="max-w-xl mx-auto overflow-hidden">
            <p className="text-[10px] md:text-xl text-slate-400 font-medium leading-relaxed px-4 animate-in slide-in-from-bottom-6 md:slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
              Persiapkan diri Anda untuk menaklukkan puncak tertinggi Nusantara dengan sistem reservasi profesional kami.
            </p>
          </div>
        </div>

        <div className="pt-6 md:pt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-900 fill-mode-both w-full flex flex-col items-center">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 md:px-20 py-5 md:py-10 bg-brand-red text-white rounded-2xl md:rounded-[3.5rem] font-black text-[10px] md:text-base uppercase tracking-[0.3em] md:tracking-[0.5em] overflow-hidden shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-700"
          >
            <span className="relative z-10 italic">MULAI EKSPEDISI</span>
          </button>
          
          <div className="mt-12 md:mt-24 flex items-center justify-center gap-4 md:gap-6 text-white/10">
            <div className="h-px w-8 md:w-20 bg-white/10"></div>
            <p className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em]">SYSTEM V1.6.0</p>
            <div className="h-px w-8 md:w-20 bg-white/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;
