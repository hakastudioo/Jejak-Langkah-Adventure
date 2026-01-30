
import React, { useRef, useState, useEffect } from 'react';
import { Registration, AdminSettings } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, ShieldCheck, MapPin, Calendar, User, Mail, Phone, Info, CheckCircle2, QrCode } from 'lucide-react';
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
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
    <path d="M50 20L85 80H15L50 20Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M50 25L75 70H25L50 25Z" fill="currentColor" />
    <path d="M30 80C30 80 40 60 50 60C60 60 70 80 70 80" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
    <circle cx="50" cy="22" r="3" fill="white" />
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
      await new Promise(resolve => setTimeout(resolve, 800));
      const element = ticketRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 4,
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: false,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('ticket-capture-area');
          if (el) {
            el.style.width = '800px';
            el.style.height = 'auto';
            el.style.overflow = 'visible';
            el.style.borderRadius = '0px';
            el.style.boxShadow = 'none';
            el.style.margin = '0px';
            el.style.padding = '0px';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const usableWidth = pdfWidth - (margin * 2);
      const contentHeight = (canvas.height * usableWidth) / canvas.width;
      
      let finalWidth = usableWidth;
      let finalHeight = contentHeight;
      let posX = margin;
      let posY = margin;

      if (finalHeight > (pdfHeight - margin * 2)) {
        finalHeight = pdfHeight - (margin * 2);
        finalWidth = (canvas.width * finalHeight) / canvas.height;
        posX = (pdfWidth - finalWidth) / 2;
      }

      pdf.addImage(imgData, 'PNG', posX, posY, finalWidth, finalHeight, undefined, 'FAST');
      pdf.save(`ETicket-${registration.mountain.replace(/\s+/g, '-')}-${registration.fullName.substring(0, 10).replace(/\s+/g, '')}.pdf`);
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
    if (!endStr || endStr === startStr) return startFormatted;
    const end = new Date(endStr);
    return `${startFormatted} - ${end.toLocaleDateString('id-ID', options)}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-1000">
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div 
          ref={ticketRef} 
          id="ticket-capture-area"
          className="bg-white text-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 min-w-[750px] mx-auto"
        >
          {/* Header Tiket */}
          <div className="bg-brand-red p-10 text-white relative">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md">
                  <BrandLogo className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Official Pass.</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mt-2">Jejak Langkah Adventure</p>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-right">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Booking Ref</p>
                <p className="text-2xl font-black tabular-nums tracking-tighter italic">#{registration.id.toString().slice(-10)}</p>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-12 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="space-y-2 border-l-4 border-brand-red pl-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Peserta Ekspedisi Resmi</span>
              <h3 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {registration.fullName}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-brand-red" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gunung Destinasi</span>
                </div>
                <p className="text-3xl font-black text-brand-red uppercase italic tracking-tight">{registration.mountain}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-brand-red" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jadwal Keberangkatan</span>
                </div>
                <p className="text-2xl font-black text-slate-900 italic tracking-tight">
                  {formatDateRange(registration.startDate, registration.endDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-100 bg-slate-50/50 px-6 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kategori Layanan</span>
                <p className="font-black text-base text-slate-800 uppercase italic">{registration.packageCategory}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paket Pilihan</span>
                <p className="font-black text-base text-slate-800 uppercase italic">{registration.tripPackage}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verifikasi Sistem</span>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-600 rounded-lg text-[10px] font-black uppercase italic border border-green-200">
                  <ShieldCheck size={12} /> {registration.status}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-end justify-between border-t border-dashed border-slate-200 pt-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Mail size={18} />
                   </div>
                   <span className="text-xs font-bold text-slate-600 tabular-nums">{adminEmail}</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Phone size={18} />
                   </div>
                   <span className="text-xs font-black text-slate-600 tabular-nums">{adminPhone}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 bg-white p-4 border border-slate-100 rounded-2xl shadow-sm">
                 <QrCode size={64} className="text-slate-900 opacity-20" />
                 <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Cloud Sync Active</span>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white/50 space-y-3">
               <div className="flex items-center gap-2 text-white">
                  <Info size={16} className="text-brand-red" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Informasi Penting Peserta</span>
               </div>
               <p className="text-[9px] font-medium leading-relaxed uppercase tracking-wider italic">
                 1. Simpan dokumen ini sebagai bukti pendaftaran resmi. 2. Harap tunjukkan dokumen ini (digital/cetak) saat proses verifikasi di meeting point. 3. Pastikan kondisi fisik prima sebelum keberangkatan. 4. Mari lestarikan alam, jangan tinggalkan apapun selain jejak.
               </p>
            </div>
          </div>
          
          <div className="bg-slate-100 px-12 py-4 flex justify-between items-center">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Jejak Langkah Adventure © 2025</span>
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Powered by SummitOS v1.7</span>
          </div>
        </div>
      </div>

      <div className="px-1">
        <Button 
          onClick={handleDownloadPDF} 
          loading={isGenerating} 
          fullWidth
          className="italic py-6 shadow-brand text-lg"
        >
          <Download size={24} className="group-hover:translate-y-1 transition-transform" />
          <span>Simpan Tiket (Kualitas HD)</span>
        </Button>
      </div>
    </div>
  );
};

export default ETicketCard;
