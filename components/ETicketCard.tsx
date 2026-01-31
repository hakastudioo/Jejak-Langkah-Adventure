
import React, { useRef, useState, useEffect } from 'react';
import { Registration, AdminSettings } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, MapPin, Calendar, Mail, Phone, QrCode } from 'lucide-react';
import Button from './Button';

interface ETicketCardProps {
  registration: Registration;
}

const SETTINGS_KEY = 'jejak_langkah_admin_settings';

const DEFAULT_CONTACT = {
  email: 'jejaklangkah.nusantara.id@gmail.com',
  phone: '+62 877-6640-1498'
};

const BrandLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 20L85 80H15L50 20Z" fill="white" />
  </svg>
);

const ETicketCard: React.FC<ETicketCardProps> = ({ registration }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminPhone, setAdminPhone] = useState(DEFAULT_CONTACT.phone);
  const [adminEmail, setAdminEmail] = useState(DEFAULT_CONTACT.email);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        try {
          const settings: AdminSettings = JSON.parse(saved);
          if (settings.adminPhone) setAdminPhone(settings.adminPhone);
          if (settings.adminEmail) setAdminEmail(settings.adminEmail);
        } catch (e) {
          console.error("Failed to load settings:", e);
        }
      }
    };
    loadSettings();
  }, []);

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const element = ticketRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 3,
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const usableWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * usableWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, margin, usableWidth, contentHeight, undefined, 'FAST');
      pdf.save(`Ticket-${registration.fullName.substring(0, 15).replace(/\s+/g, '-')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDateRange = (startStr: string, endStr?: string) => {
    if (!startStr) return "-";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(startStr);
    const startFormatted = start.toLocaleDateString('id-ID', options);
    if (!endStr || endStr === startStr || !endStr.trim()) return startFormatted;
    const end = new Date(endStr);
    return `${startFormatted} - ${end.toLocaleDateString('id-ID', options)}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div 
        ref={ticketRef} 
        className="bg-white text-slate-900 overflow-hidden flex flex-col w-full shadow-2xl rounded-[4px] border border-slate-100"
        style={{ minHeight: '850px' }}
      >
        {/* Header Section - Solid Red with specific elements */}
        <div className="bg-brand-red p-6 md:p-10 text-white relative h-40 md:h-48 flex items-center">
          {/* Circular Decoration */}
          <div className="absolute top-1/2 -right-16 md:-right-24 w-48 md:w-64 h-48 md:h-64 bg-slate-200/20 rounded-full -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-[12px] flex items-center justify-center border border-white/20">
                <BrandLogo className="w-7 h-7 md:w-9 md:h-9" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">OFFICIAL PASS.</h2>
                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-80 mt-1 md:mt-2">JEJAK LANGKAH ADVENTURE</p>
              </div>
            </div>
            
            <div className="bg-black/25 px-5 py-3 rounded-[20px] text-center border border-white/10 shrink-0">
              <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.2em] opacity-60 block mb-1">BOOKING REF</span>
              <p className="text-base md:text-2xl font-black tracking-tight tabular-nums italic">#{registration.id.toString().slice(-10)}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-14 flex-1 flex flex-col space-y-10">
          
          {/* Participant Section */}
          <div className="space-y-3 border-l-[3px] border-brand-red pl-6">
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] block">PESERTA EKSPEDISI RESMI</span>
            <h3 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter break-words leading-none">
              {registration.fullName}
            </h3>
          </div>

          {/* Location & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-slate-400">
                <MapPin size={14} className="text-brand-red" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">GUNUNG DESTINASI</span>
              </div>
              <p className="text-2xl md:text-4xl font-black text-brand-red uppercase italic tracking-tighter leading-none break-words">
                {registration.mountain}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-slate-400">
                <Calendar size={14} className="text-brand-red" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">JADWAL KEBERANGKATAN</span>
              </div>
              <p className="text-xl md:text-3xl font-black text-slate-800 italic tracking-tighter leading-none">
                {formatDateRange(registration.startDate, registration.endDate)}
              </p>
            </div>
          </div>

          {/* Detailed Info Grid (Grey Background Box) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 px-8 bg-slate-50/70 rounded-[20px] border border-slate-100">
            <div className="space-y-2">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">KATEGORI LAYANAN</span>
              <p className="font-black text-sm md:text-lg text-slate-800 uppercase italic leading-none">{registration.packageCategory}</p>
            </div>
            <div className="space-y-2">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">PAKET PILIHAN</span>
              <p className="font-black text-sm md:text-lg text-slate-800 uppercase italic leading-none">{registration.tripPackage}</p>
            </div>
            <div className="space-y-2 sm:text-right">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">VERIFIKASI SISTEM</span>
              <div className="inline-block px-3 py-1 bg-[#ccfbf1] text-[#0d9488] rounded-[20px] text-[10px] font-black uppercase italic">
                TERDAFTAR
              </div>
            </div>
          </div>

          {/* Contact and QR Section */}
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-10 pt-10 border-t border-dashed border-slate-200">
            <div className="space-y-5 w-full md:w-auto">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Mail size={16} />
                 </div>
                 <span className="text-[11px] md:text-sm font-bold text-slate-600 truncate">{adminEmail}</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Phone size={16} />
                 </div>
                 <span className="text-[11px] md:text-sm font-black text-slate-600 tabular-nums">{adminPhone}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 bg-white p-3 border border-slate-100 rounded-[12px] shadow-sm shrink-0">
               <QrCode size={72} className="text-slate-100" strokeWidth={1.5} />
               <span className="text-[7px] font-black uppercase text-slate-300 tracking-[0.2em]">CLOUD SYNC ACTIVE</span>
            </div>
          </div>

          {/* Dark Navy Important Info Box */}
          <div className="bg-[#0f172a] p-8 md:p-10 rounded-[24px] text-white/50 space-y-4 mt-auto">
             <div className="flex items-center gap-3 text-white">
                <div className="w-5 h-5 rounded-full border border-brand-red flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-brand-red rounded-full"></div>
                </div>
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] italic">INFORMASI PENTING PESERTA</span>
             </div>
             <p className="text-[8px] md:text-[10px] font-medium leading-relaxed uppercase tracking-widest opacity-80 border-t border-white/5 pt-4">
               1. SIMPAN DOKUMEN INI SEBAGAI BUKTI PENDAFTARAN RESMI. <br/>
               2. HARAP TUNJUKKAN DOKUMEN INI (DIGITAL/CETAK) SAAT PROSES VERIFIKASI DI MEETING POINT. <br/>
               3. PASTIKAN KONDISI FISIK PRIMA SEBELUM KEBERANGKATAN. <br/>
               4. MARI LESTARIKAN ALAM, JANGAN TINGGALKAN APAPUN SELAIN JEJAK.
             </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 px-10 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-t border-slate-100">
           <span>JEJAK LANGKAH ADVENTURE © 2026</span>
           <span>POWERED BY SUMMITOS V1.7</span>
        </div>
      </div>

      <div className="pt-6 px-1 pb-10">
        <Button 
          onClick={handleDownloadPDF} 
          loading={isGenerating} 
          fullWidth
          className="italic py-6 shadow-brand text-lg"
        >
          <Download size={24} />
          <span>SIMPAN TIKET DIGITAL</span>
        </Button>
      </div>
    </div>
  );
};

export default ETicketCard;
