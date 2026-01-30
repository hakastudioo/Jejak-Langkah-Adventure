
import React from 'react';
import { Registration } from '../types';
import { X, CheckCircle2, MapPin, Calendar, Smartphone, ShieldCheck } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Registration | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-navy-950/90 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto">
      <div className="relative bg-navy-900 w-full max-w-4xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 rounded-[2rem] md:rounded-[4rem] overflow-hidden animate-spring-in flex flex-col md:flex-row my-auto">
        
        {/* Left Side: Visual/Status */}
        <div className="w-full md:w-[40%] bg-navy-950/80 p-8 md:p-12 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/5 relative">
          <div className="absolute inset-0 bg-brand-red/5 blur-[60px] md:blur-[80px] rounded-full"></div>
          
          <div className="relative mb-6 md:mb-8">
            <div className="absolute inset-0 bg-brand-red blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-16 h-16 md:w-32 md:h-32 bg-brand-red rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-glow-red">
              <CheckCircle2 size={32} className="md:w-16 md:h-16" strokeWidth={2.5} />
            </div>
          </div>
          
          <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">Sinkronisasi <br/> <span className="text-brand-red">Selesai.</span></h3>
          <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 md:mb-10">Data Uploaded</p>
          
          <div className="px-4 py-1.5 md:px-6 md:py-2 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest text-slate-400">
            ID: #{data.id.toString().slice(-6)}
          </div>
        </div>

        {/* Right Side: Data Summary & Actions */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center space-y-6 md:space-y-10 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 md:top-8 md:right-10 p-2 text-slate-600 hover:text-white transition-colors"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="space-y-1 md:space-y-2">
            <div className="flex flex-col mb-4">
              <span className="text-[10px] md:text-[12px] font-black text-brand-red uppercase tracking-[0.5em] italic">JEJAK LANGKAH ADVENTURE</span>
              <div className="h-0.5 w-12 bg-brand-red mt-1"></div>
            </div>
            <h4 className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Confirmation</h4>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-tight">Terima Kasih, <br className="md:hidden" /> {data.fullName.split(' ')[0]}!</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 py-2 md:py-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Destinasi</span>
                <p className="text-xs md:text-sm font-black text-white uppercase">{data.mountain}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Waktu</span>
                <p className="text-xs md:text-sm font-black text-white">{data.startDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                <Smartphone size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">WhatsApp</span>
                <p className="text-xs md:text-sm font-black text-white">{data.whatsapp}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                <ShieldCheck size={16} className="md:w-[18px] md:h-[18px]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                <p className="text-xs md:text-sm font-black text-green-500 uppercase tracking-tight">VERIFIED</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={onClose}
              className="w-full py-5 md:py-6 bg-brand-red text-white font-black uppercase tracking-[0.3em] md:tracking-[0.4em] rounded-xl md:rounded-[2rem] shadow-glow-red active:scale-95 transition-all duration-500 text-[10px] md:text-xs italic"
            >
              Terbitkan Tiket Digital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
