
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Copy, X } from 'lucide-react';
import { PersonalData } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PersonalData;
  isSending: boolean;
  isSuccess?: boolean;
  successId?: number | string;
  error?: string | null;
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
  isSuccess,
  successId,
  error, 
  bankInfo 
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-navy-950/40 backdrop-blur-2xl animate-in fade-in duration-500">
      <div 
        className={`relative bg-navy-900 w-full max-w-xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden animate-spring-in rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col max-h-[90vh]`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-red/10 blur-[60px] rounded-full"></div>

        {isSuccess ? (
          <div className="p-10 md:p-20 text-center space-y-10 animate-in zoom-in-90 duration-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse"></div>
              <div className="relative w-28 h-28 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(34,197,94,0.4)] border-4 border-white/20 mx-auto">
                <CheckCircle2 size={56} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500 delay-200" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">
                Booking <span className="text-green-500">Berhasil!</span>
              </h3>
              <div className="inline-block px-6 py-2 bg-white/5 border border-white/10 rounded-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  ID: <span className="text-white">#{successId?.toString().slice(-6)}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="w-full py-6 bg-white text-navy-950 font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-2xl hover:bg-brand-red hover:text-white active:scale-95 transition-all duration-500"
            >
              Terbitkan E-Ticket
            </button>
          </div>
        ) : (
          <>
            <div className="px-8 pt-10 md:px-12 md:pt-12 flex justify-between items-center relative z-10">
              <div className="space-y-1">
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tighter italic leading-none">Konfirmasi <span className="text-brand-red">Trip.</span></h3>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Validasi Data Sebelum Submit</p>
              </div>
              <button 
                onClick={onClose} 
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-red/20 transition-all border border-white/5"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 md:p-12 pt-6 space-y-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
               {/* Information Card */}
               <div className="bg-navy-950/60 p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-inner animate-in slide-in-from-bottom-4 stagger-1 fill-mode-both">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Nama Peserta</span>
                       <p className="text-xl font-black uppercase text-white truncate leading-tight tracking-tight">{data.fullName}</p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kontak</span>
                       <p className="text-sm font-bold text-slate-300 truncate">{data.whatsapp}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full"></div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Destinasi</span>
                       <p className="text-lg font-black uppercase text-brand-red italic">{data.mountain}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Keberangkatan</span>
                       <p className="text-lg font-black tabular-nums text-white">{data.startDate}</p>
                    </div>
                  </div>
               </div>
               
               {/* Payment Info */}
               <div className="space-y-4 animate-in slide-in-from-bottom-4 stagger-2 fill-mode-both">
                 <div className="bg-brand-red/5 p-8 rounded-[2.5rem] border-2 border-brand-red/10 space-y-5 relative overflow-hidden group">
                   <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-red/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                   
                   <div className="flex justify-between items-center relative z-10">
                     <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">Bank Transfer</span>
                     <span className="text-[9px] font-black uppercase px-4 py-1.5 bg-brand-red/10 text-brand-red rounded-lg border border-brand-red/20">{bankInfo.bankName}</span>
                   </div>
                   
                   <div className="flex items-center justify-between gap-6 relative z-10">
                     <p className="text-3xl font-black tracking-tighter tabular-nums text-white">{bankInfo.accountNumber}</p>
                     <button 
                      onClick={handleCopy} 
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${copied ? 'bg-green-500 text-white' : 'bg-brand-red text-white shadow-glow-red hover:scale-110'}`}
                     >
                       {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                     </button>
                   </div>
                   
                   <div className="flex justify-between items-center relative z-10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">A/N {bankInfo.accountName}</p>
                    <span className="text-[8px] font-medium text-slate-600 uppercase italic">Admin Verified</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-8 md:px-12 md:pb-12 bg-navy-950/40 border-t border-white/5 pb-12 animate-in slide-in-from-bottom-4 stagger-3 fill-mode-both">
              <button 
                onClick={onConfirm}
                disabled={isSending}
                className="group relative w-full py-7 bg-brand-red text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] overflow-hidden shadow-glow-red hover:shadow-[0_20px_60px_rgba(225,29,72,0.4)] transition-all duration-500 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-4"
              >
                {isSending ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="relative z-10 italic">Finalisasi Booking</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmationModal;
