
import React from 'react';
import Button from './Button';

interface WelcomeOverlayProps {
  onStart: () => void;
}

const BrandLogo = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Mountain Triangle */}
    <path 
      d="M50 15L85 75H15L50 15Z" 
      fill="white" 
    />
    <path 
      d="M50 25L70 65H30L50 25Z" 
      fill="#e11d48" 
    />
    <path 
      d="M40 70L50 55L60 70" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Smile Curve underneath */}
    <path 
      d="M20 85C35 92 65 92 80 85" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round" 
      opacity="0.6"
    />
  </svg>
);

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-brand-red overflow-hidden select-none animate-fade-in">
      
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg px-8 space-y-12">
        
        {/* Logo Section */}
        <div className="animate-scale-in">
          <BrandLogo className="w-40 h-40 md:w-48 md:h-48" />
        </div>

        {/* Text Section */}
        <div className="space-y-4">
          <p className="text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] animate-slide-up">
            Selamat Datang Di
          </p>
          
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none animate-slide-up [animation-delay:200ms]">
            JEJAK LANGKAH <br />
            ADVENTURE
          </h1>

          <p className="text-xs md:text-sm text-white/90 font-medium max-w-sm mx-auto leading-relaxed animate-slide-up [animation-delay:400ms]">
            Siapkan diri Anda untuk menaklukkan puncak-puncak tertinggi Nusantara. Mari mulai perjalanan ekspedisi Anda dengan mengisi data diri.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full animate-slide-up [animation-delay:600ms]">
          <Button 
            onClick={onStart}
            variant="white"
            fullWidth
            className="shadow-2xl italic"
          >
            Mulai Petualangan
          </Button>
        </div>

        {/* Footer info */}
        <p className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] pt-4">
          Pendaftaran Aman & Terenkripsi
        </p>
      </div>

    </div>
  );
};

export default WelcomeOverlay;
