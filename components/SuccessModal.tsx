
import React, { useEffect, useState } from 'react';
import { Registration } from '../types';
import { X, MapPin, Calendar, ShieldCheck, Ticket, Sparkles, Compass, Download } from 'lucide-react';
import { getMountaineeringAdvice } from '../services/geminiService';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Registration | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, data }) => {
  const [advice, setAdvice] = useState<string>('Menyusun strategi pendakian...');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(true);

  useEffect(() => {
    if (isOpen && data) {
      const fetchAdvice = async () => {
        setIsLoadingAdvice(true);
        const result = await getMountaineeringAdvice(data);
        setAdvice(result);
        setIsLoadingAdvice(false);
      };
      fetchAdvice();
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 md:p-8 bg-navy-950/98 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto">
      
      <div className="relative w-full max-w-5xl bg-navy-900 border border-white/10 rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] animate-modal-elastic flex flex-col md:flex-row my-auto max-h-[95vh] md:max-h-none overflow-y-auto custom-scrollbar">
        
        {/* Left Section: Visual & Advice */}
        <div className="relative w-full md:w-2/5 bg-navy-950 p-6 sm:p-8 md:p-12 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/5 shrink-0 min-h-[220px] md:min-h-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-20%] w-64 md:w-96 h-64 md:h-96 bg-brand-red/40 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-64 md:w-96 h-64 md:h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-red rounded-lg md:rounded-xl flex items-center justify-center shadow-glow-red">
                <Compass className="text-white" size={14} />
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Expedition Confirmed</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] mb-4 md:mb-0">
              READY TO <br />
              <span className="text-brand-red">SUMMIT.</span>
            </h2>
          </div>

          <div className="relative z-10 space-y-2 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-brand-red">
              <Sparkles size={12} />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] italic">AI Briefing</span>
            </div>
            <div className="p-4 sm:p-5 md:p-6 bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-md">
              <p className={`text-xs md:text-base font-medium leading-tight md:leading-relaxed italic transition-all duration-1000 ${isLoadingAdvice ? 'text-white/10 blur-sm' : 'text-white/90'}`}>
                {isLoadingAdvice ? 'Sedang menganalisis medan...' : `"${advice}"`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Details (The Boarding Pass) */}
        <div className="w-full md:w-3/5 bg-navy-900 p-6 sm:p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start mb-6 md:mb-12">
            <div className="space-y-0.5">
              <h3 className="text-sm md:text-xl font-black uppercase tracking-tight italic text-white/50">Registration Info</h3>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest tabular-nums">#{data.id.toString().slice(-8)}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 md:p-3 bg-white/5 hover:bg-brand-red text-white/20 hover:text-white rounded-xl md:rounded-2xl transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-6 md:space-y-10">
            {/* User Info */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-red shrink-0">
                <Ticket size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="space-y-0 min-w-0">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Participant Name</span>
                <p className="text-xl md:text-2xl font-black uppercase italic tracking-tight truncate leading-tight">{data.fullName}</p>
              </div>
            </div>

            {/* Trip Info Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:gap-8 py-6 md:py-8 border-y border-white/5">
              <div className="space-y-0 min-w-0">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                  <MapPin size={10} className="text-brand-red shrink-0" /> Destinasi
                </span>
                <p className="text-sm md:text-xl font-black uppercase italic text-white truncate leading-none mt-1.5">{data.mountain}</p>
              </div>
              <div className="space-y-0 min-w-0">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1">
                  <Calendar size={10} className="text-brand-red shrink-0" /> Tanggal
                </span>
                <p className="text-sm md:text-xl font-black italic text-white truncate tabular-nums leading-none mt-1.5">
                  {new Date(data.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="space-y-0">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Layanan</span>
                <p className="text-xs md:text-sm font-black uppercase text-brand-red truncate leading-none mt-1.5">{data.packageCategory}</p>
              </div>
              <div className="space-y-0">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Paket</span>
                <p className="text-xs md:text-sm font-black uppercase text-brand-red truncate leading-none mt-1.5">{data.tripPackage}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 space-y-4">
            <button 
              onClick={onClose}
              className="w-full py-5 md:py-6 bg-brand-red text-white font-black uppercase tracking-[0.3em] rounded-2xl md:rounded-[2rem] shadow-glow-red hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 italic text-xs md:text-sm"
            >
              <Download size={16} />
              <span>Dapatkan Tiket Digital</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 opacity-60">
              <ShieldCheck size={12} className="text-green-500" />
              <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Cloud Sync Active • Terdaftar Resmi</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessModal;
