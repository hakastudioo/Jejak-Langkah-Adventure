
import React, { useState, useRef, useMemo } from 'react';
import { Registration, PersonalData, AdminSettings } from './types';
import Input from './components/Input';
import RadioGroup from './components/RadioGroup';
import ETicketCard from './components/ETicketCard';
import WelcomeOverlay from './components/WelcomeOverlay';
import Select from './components/Select';
import Toast from './components/Toast';
import SuccessModal from './components/SuccessModal';
import { 
  ArrowRight, CheckCircle2, 
  Camera, Loader2, Info, Ticket, ExternalLink
} from 'lucide-react';

const MOUNTAINS = [
  "Semeru", "Kerinci", "Merbabu", "Rinjani", 
  "Prau", "Lawu", "Sindoro", "Sumbing", 
  "Dempo", "Gede", "Pangrango", "Ciremai", 
  "Slamet"
];

const LAYANAN_OPTIONS = ["OPEN TRIP", "PRIVATE TRIP", "SHARECOST"];
const PAKET_OPTIONS = ["PAKET A", "PAKET B", "REGULER"];

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

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSystemDefaults = () => ({
    // @ts-ignore
    googleScriptUrl: process.env.VITE_GSCRIPT_URL || '',
    // @ts-ignore
    spreadsheetId: process.env.VITE_SPREADSHEET_ID || '',
    adminPhone: '+62 812-3456-7890',
    adminEmail: 'jejaklangkah.nusantara.id@gmail.com'
  });

  const [settings] = useState<AdminSettings>(getSystemDefaults());

  const [formData, setFormData] = useState<PersonalData>({
    fullName: '', whatsapp: '', email: '', address: '', mountain: '',
    packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
    startDate: new Date().toISOString().split('T')[0], identityImage: '',
    climberCode: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [lastReg, setLastReg] = useState<Registration | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const formProgress = useMemo(() => {
    const fields = [
      { name: 'Nama', filled: !!formData.fullName },
      { name: 'WhatsApp', filled: !!formData.whatsapp },
      { name: 'Gunung', filled: !!formData.mountain },
      { name: 'Identitas', filled: !!formData.identityImage }
    ];
    const completed = fields.filter(f => f.filled).length;
    return {
      percentage: Math.round((completed / fields.length) * 100),
      isComplete: completed === fields.length,
      missing: fields.filter(f => !f.filled).map(f => f.name)
    };
  }, [formData]);

  const handleRegister = async () => {
    if (!formProgress.isComplete) {
      setToastMsg(`Lengkapi data: ${formProgress.missing.join(', ')}`);
      setShowToast(true);
      return;
    }

    if (!settings.googleScriptUrl || !settings.spreadsheetId) {
      setToastMsg("Konfigurasi API Cloud tidak ditemukan.");
      setShowToast(true);
      return;
    }

    setIsSending(true);
    const newReg: Registration = { 
      ...formData, 
      id: Date.now(), 
      status: 'Terdaftar', 
      timestamp: new Date().toLocaleString('id-ID') 
    };

    try {
      const response = await fetch(settings.googleScriptUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'NEW_REGISTRATION',
          spreadsheetId: settings.spreadsheetId,
          registration: newReg
        })
      });

      const result = await response.json();

      if (result.status === 'success') {
        setLastReg(newReg);
        setIsSuccessModalOpen(true);
        setFormData({
          fullName: '', whatsapp: '', email: '', address: '', mountain: '',
          packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
          startDate: new Date().toISOString().split('T')[0], identityImage: '',
          climberCode: ''
        });
      } else {
        throw new Error(result.message || "Gagal sinkronisasi");
      }
    } catch (error) {
      setToastMsg("Gagal terhubung ke server cloud.");
      setShowToast(true);
    } finally {
      setIsSending(false);
    }
  };

  if (showWelcome) return <WelcomeOverlay onStart={() => setShowWelcome(false)} />;

  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-brand-red overflow-x-hidden font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 px-3 py-3 md:px-8 md:py-4 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between bg-navy-900/60 backdrop-blur-3xl border border-white/5 p-2 md:p-3 rounded-2xl md:rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-3 md:gap-4 pl-2 cursor-pointer" onClick={() => { setLastReg(null); setIsSuccessModalOpen(false); }}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-red rounded-xl md:rounded-2xl flex items-center justify-center shadow-glow-red animate-pulse-glow">
              <BrandLogo className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm md:text-lg font-black uppercase italic tracking-tighter leading-none">Jejak Langkah</h2>
              <p className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Database Node</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pr-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Sync Engine</span>
                <span className="text-[9px] md:text-[10px] font-black text-green-500">READY</span>
             </div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-20 md:pb-32">
        {!lastReg ? (
          <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="max-w-5xl text-center md:text-left mx-auto lg:mx-0 px-2">
              <h1 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] italic mb-4 md:mb-8">
                Jejak Langkah <span className="text-brand-red">Adventure.</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm md:text-xl font-medium max-w-3xl leading-relaxed">
                Input data peserta secara akurat untuk sinkronisasi otomatis ke sistem logistik dan perizinan pendakian.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
              <div className="lg:col-span-7 bg-navy-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-16 space-y-8 md:space-y-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-red/5 blur-[80px] rounded-full group-hover:bg-brand-red/10 transition-colors duration-700"></div>
                
                <div className="flex items-center gap-4 md:gap-5 relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-brand-red flex items-center justify-center text-white font-black text-lg md:text-xl shadow-glow-red italic">01</div>
                  <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Profil Peserta</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                  <Input label="Nama Lengkap" placeholder="Sesuai KTP" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  <Input label="WhatsApp" placeholder="08xxxx..." value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                  <Input label="Email Aktif" type="email" placeholder="example@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  
                  {/* Highlighted Climber Code Section */}
                  <div className={`transition-all duration-700 relative group/code ${formData.mountain === 'Merbabu' ? 'scale-[1.02] md:scale-105' : 'opacity-80'}`}>
                    <div className="flex justify-between items-center mb-1 px-1">
                      <label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">KODE PENDAKI (KHUSUS MERBABU)</label>
                      {formData.mountain === 'Merbabu' && (
                        <a href="https://tamanwisatamerbabu.org/check-booking" target="_blank" rel="noreferrer" className="text-[7px] md:text-[9px] font-black text-brand-red uppercase underline flex items-center gap-1 hover:text-white transition-colors">
                          Cek Kode <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="MBB-XXXX" 
                        value={formData.climberCode} 
                        onChange={e => setFormData({...formData, climberCode: e.target.value})}
                        className={`w-full px-5 py-3 md:px-8 md:py-5 bg-navy-950/40 border-2 rounded-xl md:rounded-3xl outline-none transition-all text-white placeholder:text-slate-700 font-sans font-black text-xs md:text-base tracking-tight ${formData.mountain === 'Merbabu' ? 'border-brand-red/50 focus:border-brand-red bg-brand-red/5 shadow-glow-red/10' : 'border-white/5 focus:border-white/20'}`}
                      />
                      <div className={`absolute right-5 md:right-7 top-1/2 -translate-y-1/2 transition-all duration-500 ${formData.mountain === 'Merbabu' ? 'text-brand-red opacity-100' : 'text-slate-700 opacity-50'}`}>
                        <Ticket size={18} className="md:w-6 md:h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                <Input label="Alamat Domisili" isTextArea placeholder="Alamat lengkap..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />

                <div className="relative z-10">
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`w-full py-10 md:py-14 border-2 border-dashed rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-3 md:gap-4 transition-all duration-700 ${formData.identityImage ? 'border-brand-red/50 bg-brand-red/10' : 'border-white/10 bg-navy-950/40 hover:border-brand-red/40'}`}
                  >
                    {formData.identityImage ? (
                      <CheckCircle2 size={32} className="text-brand-red animate-in zoom-in" />
                    ) : (
                      <Camera size={24} className="text-slate-500" />
                    )}
                    <div className="text-center">
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white">Upload Identitas</span>
                      <p className="text-[8px] text-slate-500 uppercase mt-1">Maks 2MB</p>
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const r = new FileReader();
                        r.onloadend = () => setFormData({...formData, identityImage: r.result as string});
                        r.readAsDataURL(file);
                      }
                    }} className="hidden" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6 md:space-y-8">
                <div className="bg-navy-900/40 border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-14 space-y-8 md:space-y-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-red/5 blur-[80px] rounded-full group-hover:bg-brand-red/10 transition-colors duration-700"></div>
                  
                  <div className="flex items-center gap-4 md:gap-5 relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black text-lg md:text-xl italic">02</div>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Detail Trip</h3>
                  </div>
                  
                  <div className="space-y-6 md:space-y-8 relative z-10">
                    <Select label="Tujuan Gunung" options={MOUNTAINS} value={formData.mountain} onChange={e => setFormData({...formData, mountain: e.target.value})} />
                    <Input label="Tanggal" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    <RadioGroup label="Kategori" variant="segment" options={LAYANAN_OPTIONS} value={formData.packageCategory} onChange={v => setFormData({...formData, packageCategory: v})} />
                    <RadioGroup label="Paket" variant="segment" options={PAKET_OPTIONS} value={formData.tripPackage} onChange={v => setFormData({...formData, tripPackage: v})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleRegister}
                    disabled={isSending}
                    className="w-full py-7 md:py-9 bg-brand-red text-white font-black uppercase tracking-[0.4em] md:tracking-[0.5em] rounded-[2rem] md:rounded-[3rem] shadow-glow-red flex items-center justify-center gap-3 md:gap-5 hover:scale-[1.02] active:scale-95 transition-all duration-700 disabled:opacity-30 text-xs md:text-sm italic"
                  >
                    {isSending ? (
                      <>Syncing <Loader2 size={20} className="animate-spin" /></>
                    ) : (
                      <>Kirim Sekarang <ArrowRight size={20} /></>
                    )}
                  </button>
                  <p className="text-[8px] md:text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest">Data dienkripsi sebelum pengiriman</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-8 md:space-y-12 max-w-5xl mx-auto flex flex-col items-center px-2">
            <div className="text-center space-y-4 md:space-y-6 mb-4 md:mb-10 max-w-2xl">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-green-500 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-lg mb-4 md:mb-8 animate-reveal">
                <CheckCircle2 size={32} className="md:w-12 md:h-12" />
              </div>
              <h2 className="text-3xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">Database <span className="text-brand-red">Updated.</span></h2>
              <p className="text-slate-500 text-xs md:text-lg font-medium">Data Anda telah tercatat di server pusat.</p>
            </div>
            
            <div className="w-full">
              <ETicketCard registration={lastReg} />
            </div>
            
            <button 
              onClick={() => { setLastReg(null); setIsSuccessModalOpen(false); }} 
              className="mt-6 md:mt-12 px-8 py-4 md:px-12 md:py-6 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all"
            >
              Daftarkan Peserta Lain
            </button>
          </div>
        )}
      </main>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        data={lastReg}
      />

      <Toast 
        isVisible={showToast} 
        message={toastMsg} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
};

export default App;
