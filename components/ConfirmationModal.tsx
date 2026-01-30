
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
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none rotate-12">
        <Zap size={300} className="text-brand-red" />
      </div>

      <div className="relative bg-navy-900 w-full max-w-xl border border-white/10 overflow-hidden animate-modal-elastic rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] my-auto max-h-[95vh] flex flex-col">
        
        {/* Minimalist Header */}
        <div className="p-8 md:p-10 pb-4 md:pb-6 flex justify-between items-center border-b border-white/5 shrink-0 bg-navy-950/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse"></span>
              <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">Awaiting Verification</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white leading-none">Ringkasan <span className="text-brand-red">Data.</span></h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-brand-red text-white/30 hover:text-white rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 md:p-10 space-y-10 overflow-y-auto custom-scrollbar flex-1">
           
           {/* Summary Cards Grid */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Peserta</span>
                 <p className="text-sm font-black uppercase text-white truncate">{data.fullName}</p>
              </div>
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Destinasi</span>
                 <p className="text-sm font-black uppercase text-brand-red truncate">{data.mountain}</p>
              </div>
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Tanggal</span>
                 <p className="text-sm font-black text-white truncate tabular-nums">
                    {new Date(data.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                 </p>
              </div>
              <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 space-y-3">
                 <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block italic">Durasi</span>
                 <p className="text-sm font-black text-white truncate">{duration}</p>
              </div>
           </div>

           {/* Smart Payment Card */}
           <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-red/50 to-blue-500/50 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-navy-950 p-8 rounded-[2rem] border border-white/10 space-y-6 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">Official Payment Node</p>
                       <p className="text-[11px] font-bold text-white/60 uppercase italic">{bankInfo.accountName}</p>
                    </div>
                    <div className="px-4 py-1.5 bg-brand-red text-white font-black text-[9px] uppercase tracking-widest rounded-full italic shadow-glow-red">
                       {bankInfo.bankName}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                       <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Account Number</span>
                       <p className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums text-white">{bankInfo.accountNumber}</p>
                    </div>
                    <button 
                      onClick={handleCopy} 
                      className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${copied ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40 hover:bg-brand-red hover:text-white border border-white/10'}`}
                    >
                      {copied ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                    </button>
                  </div>

                  {/* Aesthetic Card Elements */}
                  <div className="absolute bottom-4 right-8 flex gap-1 opacity-20">
                     <div className="w-8 h-8 rounded-full bg-brand-red"></div>
                     <div className="w-8 h-8 rounded-full bg-orange-500 -ml-4"></div>
                  </div>
              </div>
           </div>

           <div className="flex items-center justify-center gap-2 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
              <ShieldCheck size={12} className="text-brand-red" />
              <span>Secure Transaction Protocol v3.0</span>
           </div>
        </div>

        {/* Action Button */}
        <div className="p-8 md:p-10 pt-0 shrink-0">
          <button 
            onClick={onConfirm}
            disabled={isSending}
            className="w-full py-7 md:py-8 bg-white text-navy-950 font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 italic group overflow-hidden"
          >
            {isSending ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <span>Kirim Registrasi</span> 
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
