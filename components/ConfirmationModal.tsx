
import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, Copy, X, Calendar, Loader2, Clock, Map, ShieldCheck, User, Zap } from 'lucide-react';
import { PersonalData } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PersonalData;
  isSending: boolean;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  data, 
  isSending, 
  bankInfo 
}) => {
  const [copied, setCopied] = useState(false);

  const duration = useMemo(() => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} Hari`;
  }, [data.startDate, data.endDate]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-navy-950/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none rotate-12">
        <Zap size={200} className="text-brand-red" />
      </div>

      <div className="relative bg-navy-900 w-full max-w-lg border border-white/10 overflow-hidden animate-modal-elastic rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 md:p-10 pb-4 md:pb-6 flex justify-between items-center border-b border-white/5 shrink-0 bg-navy-950/50">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
              <span className="text-[8px] font-black text-brand-red uppercase tracking-widest">Awaiting Verification</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Ringkasan <span className="text-brand-red">Data.</span></h3>
          </div>
          <button onClick={onClose} className="p-2.5 md:p-3 bg-white/5 hover:bg-brand-red text-white/30 hover:text-white rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 md:p-10 space-y-6 md:space-y-10 overflow-y-auto custom-scrollbar flex-1">
           
           {/* Summary Cards Grid */}
           <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-1">
                 <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Peserta</span>
                 <p className="text-xs md:text-sm font-black uppercase text-white truncate leading-none">{data.fullName}</p>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-1">
                 <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Destinasi</span>
                 <p className="text-xs md:text-sm font-black uppercase text-brand-red truncate leading-none">{data.mountain}</p>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-1">
                 <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Tanggal</span>
                 <p className="text-xs md:text-sm font-black text-white truncate tabular-nums leading-none">
                    {new Date(data.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                 </p>
              </div>
              <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-1">
                 <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Durasi</span>
                 <p className="text-xs md:text-sm font-black text-white truncate leading-none">{duration || '1 Hari'}</p>
              </div>
           </div>

           {/* Smart Payment Card */}
           <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red/50 to-blue-500/50 rounded-[2rem] md:rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative bg-navy-950 p-6 md:p-8 rounded-[1.8rem] md:rounded-[2rem] border border-white/10 space-y-5 md:space-y-6 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                       <p className="text-[8px] md:text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">Official Payment Node</p>
                       <p className="text-[10px] md:text-[12px] font-bold text-white/60 uppercase italic">{bankInfo.accountName}</p>
                    </div>
                    <div className="px-3 py-1 bg-brand-red text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest rounded-full italic shadow-glow-red leading-none">
                       {bankInfo.bankName}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                       <span className="text-[7px] md:text-[8px] font-black text-white/20 uppercase tracking-widest">Account Number</span>
                       <p className="text-2xl md:text-4xl font-black tracking-tighter tabular-nums text-white truncate">{bankInfo.accountNumber}</p>
                    </div>
                    <button 
                      onClick={handleCopy} 
                      className={`h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40 hover:bg-brand-red hover:text-white border border-white/10'}`}
                    >
                      {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    </button>
                  </div>

                  <div className="absolute bottom-2 right-4 flex gap-1 opacity-10 pointer-events-none">
                     <div className="w-6 h-6 rounded-full bg-brand-red"></div>
                     <div className="w-6 h-6 rounded-full bg-orange-500 -ml-3"></div>
                  </div>
              </div>
           </div>

           <div className="flex items-center justify-center gap-1.5 text-[7px] md:text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
              <ShieldCheck size={12} className="text-brand-red" />
              <span>Secure Transaction Protocol v3.0</span>
           </div>
        </div>

        {/* Action Button */}
        <div className="p-6 md:p-10 pt-0 shrink-0">
          <button 
            onClick={onConfirm}
            disabled={isSending}
            className="w-full py-6 md:py-8 bg-white text-navy-950 font-black uppercase tracking-[0.3em] rounded-2xl md:rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 italic group overflow-hidden text-xs md:text-base"
          >
            {isSending ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <span>Kirim Registrasi</span> 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
