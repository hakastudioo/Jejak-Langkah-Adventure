
import React, { useRef, useState, useEffect } from 'react';
import { Registration, AdminSettings } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, ShieldCheck, MapPin, Calendar, User, Mail, Phone, Info, CheckCircle2, QrCode, Ticket } from 'lucide-react';
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
      await new Promise(resolve => setTimeout(resolve, 500));
      const element = ticketRef.current;
      
      const canvas = await html2canvas(element, { 
        scale: 2,
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
    if (!endStr || endStr === startStr || !endStr.trim()) return startFormatted;
    const end = new Date(endStr);
    return `${startFormatted} - ${end.toLocaleDateString('id-ID', options)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 px-1">
      <div 
        ref={ticketRef} 
        className="bg-white text-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 w-full"
      >
        {/* Top Header Section */}
        <div className="bg-brand-red p-6 md:p-12 text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shrink-0">
                <BrandLogo className="w-8 h-8 md:w-12 md:h-12" />
              </div>
              <div className="min-w-0">
                <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Official Pass.</h2>
                <p className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] opacity-80 mt-1 md:mt-2">Jejak Langkah Adventure</p>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-md px-5 py-3 md:px-8 md:py-5 rounded-2xl border border-white/10 shrink-0 w-full md:w-auto">
              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] opacity-60 block mb-1">Booking Reference</span>
              <p className="text-xl md:text-2xl font-black tabular-nums tracking-tighter italic leading-none">#{registration.id.toString().slice(-8)}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-14 space-y-10 md:space-y-14 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          
          {/* Participant Name Section */}
          <div className="space-y-2 md:space-y-3 border-l-[6px] md:border-l-[8px] border-brand-red pl-5 md:pl-8">
            <span className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block">Certified Participant</span>
            <h3 className="text-2xl sm:text-3xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight break-words">
              {registration.fullName}
            </h3>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                <MapPin size={16} className="text-brand-red shrink-0" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">Summit Target</span>
              </div>
              <p className="text-xl md:text-4xl font-black text-brand-red uppercase italic tracking-tight leading-tight break-words">
                {registration.mountain}
              </p>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-2 md:gap-3 text-slate-400">
                <Calendar size={16} className="text-brand-red shrink-0" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">Expedition Dates</span>
              </div>
              <p className="text-lg md:text-3xl font-black text-slate-800 italic tracking-tight leading-tight">
                {formatDateRange(registration.startDate, registration.endDate)}
              </p>
            </div>
          </div>

          {/* Package Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 py-8 md:py-10 border-y border-slate-100 bg-slate-50/50 px-6 md:px-12 rounded-[2rem] md:rounded-[3rem]">
            <div className="space-y-1">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">Service Tier</span>
              <p className="font-black text-sm md:text-lg text-slate-800 uppercase italic">{registration.packageCategory}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">Trip Package</span>
              <p className="font-black text-sm md:text-lg text-slate-800 uppercase italic">{registration.tripPackage}</p>
            </div>
            <div className="space-y-1 sm:text-right">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block">Status</span>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-600 rounded-xl text-[9px] md:text-[12px] font-black uppercase italic border border-green-200 shadow-sm">
                <CheckCircle2 size={14} className="shrink-0" /> {registration.status}
              </div>
            </div>
          </div>

          {/* Contact & Barcode Section */}
          <div className="pt-4 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 border-t border-dashed border-slate-200 pt-10 md:pt-14">
            <div className="space-y-5 w-full lg:w-auto">
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                    <Mail size={18} />
                 </div>
                 <div className="min-w-0">
                   <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Support Email</span>
                   <span className="text-xs md:text-sm font-bold text-slate-600 truncate block">{adminEmail}</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 group">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-brand-red/10 group-hover:text-brand-red transition-colors">
                    <Phone size={18} />
                 </div>
                 <div className="min-w-0">
                   <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Incident Hotline</span>
                   <span className="text-xs md:text-sm font-black text-slate-600 tabular-nums block">{adminPhone}</span>
                 </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-slate-50 p-4 md:p-6 rounded-[2rem] border border-slate-100 w-full lg:w-auto shadow-sm">
               <div className="flex flex-col items-center gap-2">
                 <QrCode size={56} className="text-slate-900 md:w-16 md:h-16" />
                 <span className="text-[7px] font-black uppercase text-slate-400 tracking-[0.2em]">Verify Entry</span>
               </div>
               <div className="h-14 w-[1px] bg-slate-200 hidden sm:block"></div>
               <div className="flex-1 space-y-1">
                  <span className="text-[8px] font-black text-slate-900 uppercase tracking-widest block italic">SummitOS Authorized</span>
                  <p className="text-[8px] md:text-[10px] font-medium text-slate-500 leading-relaxed max-w-[180px]">
                    This e-ticket is a valid proof of registration for Jejak Langkah Adventure expeditions.
                  </p>
               </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="bg-slate-900 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white/50 space-y-4">
             <div className="flex items-center gap-3 text-white">
                <Info size={16} className="text-brand-red shrink-0" />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] italic">Mountain Protocol & Terms</span>
             </div>
             <p className="text-[8px] md:text-[10px] font-medium leading-relaxed uppercase tracking-widest italic opacity-80">
               1. KEEP THIS PASS DIGITAL OR PRINTED FOR ON-SITE VERIFICATION. 2. BRING ORIGINAL IDENTITY CARD (KTP/PASSPORT). 3. ENSURE MEDICAL CLEARANCE IS COMPLETED. 4. ZERO WASTE POLICY: WHAT YOU BRING UP, YOU MUST BRING DOWN. 5. THE PEAK IS OPTIONAL, RETURNING HOME IS MANDATORY.
             </p>
          </div>
        </div>
        
        {/* Bottom Banner */}
        <div className="bg-slate-50 px-8 md:px-14 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] border-t border-slate-100">
           <span>Jejak Langkah Adventure © 2026</span>
           <div className="flex items-center gap-4">
             <span className="hidden sm:inline">Summit Edition 1.7</span>
             <span className="text-brand-red">Cloud Verified</span>
           </div>
        </div>
      </div>

      <div className="pt-6">
        <Button 
          onClick={handleDownloadPDF} 
          loading={isGenerating} 
          fullWidth
          className="italic py-6 md:py-8 shadow-brand text-lg"
        >
          <Download size={24} />
          <span>DOWNLOAD DIGITAL PASS</span>
        </Button>
      </div>
    </div>
  );
};

export default ETicketCard;
