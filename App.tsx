
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Registration, PersonalData, AdminSettings } from './types';
import Input from './components/Input';
import RadioGroup from './components/RadioGroup';
import ETicketCard from './components/ETicketCard';
import WelcomeOverlay from './components/WelcomeOverlay';
import Select from './components/Select';
import Toast from './components/Toast';
import SuccessModal from './components/SuccessModal';
import ConfirmationModal from './components/ConfirmationModal';
import Button from './components/Button';
import { 
  ArrowRight, CheckCircle2, 
  Camera, Sun, Moon, Info, ExternalLink, Trash2,
  Compass, Cpu, Fingerprint
} from 'lucide-react';

const MOUNTAINS = [
  "Semeru", "Kerinci", "Merbabu", "Rinjani", 
  "Prau", "Lawu", "Sindoro", "Sumbing", 
  "Dempo", "Gede", "Pangrango", "Ciremai", 
  "Slamet", "Tanggamus", "Pesagi", "Seminung", "Pesawaran"
];

const LAYANAN_OPTIONS = ["OPEN TRIP", "PRIVATE TRIP", "SHARECOST"];
const PAKET_OPTIONS = ["PAKET A", "PAKET B", "REGULER"];

const AppLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 75H15L50 15Z" fill="currentColor" />
    <path d="M20 85C35 92 65 92 80 85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [statusIdx, setStatusIdx] = useState(0);
  const statuses = [
    "INITIALIZING CORE...",
    "SCANNING PEAKS...",
    "CALIBRATING ALTITUDE...",
    "SYNCING MAP DATA...",
    "READY TO EXPEDITION"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx(prev => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 450);

    const timeout = setTimeout(onComplete, 2800);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[3000] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-[2px] bg-brand-red shadow-[0_0_15px_rgba(225,29,72,0.8)] animate-[scan_3s_linear_infinite]"></div>
      </div>

      <div className="relative space-y-12 flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-8 bg-brand-red/20 blur-3xl rounded-full animate-pulse-slow"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-900 border border-white/5 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-scale-in">
             <div className="text-brand-red">
               <AppLogo className="w-16 h-16 md:w-20 md:h-20" />
             </div>
             <div className="absolute -top-2 -right-2 p-2 bg-brand-red text-white rounded-lg animate-bounce duration-[2000ms]">
                <Compass size={16} />
             </div>
             <div className="absolute inset-0 border-2 border-brand-red/20 rounded-[2.5rem] animate-ping opacity-20"></div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
             <Cpu size={14} className="text-brand-red animate-pulse" />
             <p className="font-mono text-[10px] md:text-xs text-brand-red tracking-[0.3em] font-black uppercase">
               {statuses[statusIdx]}
             </p>
          </div>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
             <div 
               className="h-full bg-brand-red transition-all duration-300 ease-out shadow-[0_0_10px_rgba(225,29,72,0.5)]" 
               style={{ width: `${((statusIdx + 1) / statuses.length) * 100}%` }}
             ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [showMerbabuInput, setShowMerbabuInput] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil settings dari environment atau localStorage jika ada
  const settings = useMemo<AdminSettings>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('jejak_langkah_admin_settings') : null;
    const localSettings = saved ? JSON.parse(saved) : {};
    return {
      googleScriptUrl: process.env.VITE_GSCRIPT_URL || localSettings.googleScriptUrl || '',
      spreadsheetId: process.env.VITE_SPREADSHEET_ID || localSettings.spreadsheetId || '',
    };
  }, []);

  const [formData, setFormData] = useState<PersonalData>({
    fullName: '', whatsapp: '', email: '', address: '', mountain: '',
    packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
    startDate: '', 
    endDate: '',
    identityImage: '',
    climberCode: ''
  });

  const [isSending, setIsSending] = useState(false);
  const [lastReg, setLastReg] = useState<Registration | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (formData.mountain !== "Merbabu") {
      setShowMerbabuInput(false);
    }
  }, [formData.mountain]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const isMerbabu = formData.mountain === "Merbabu";

  const formProgress = useMemo(() => {
    const fields = [
      { name: 'Gunung', filled: !!formData.mountain },
      { name: 'Nama', filled: !!formData.fullName },
      { name: 'WhatsApp', filled: !!formData.whatsapp },
      { name: 'Tanggal Berangkat', filled: !!formData.startDate },
      { name: 'Identitas', filled: !!formData.identityImage }
    ];
    
    if (isMerbabu) {
      fields.push({ name: 'Kode Pendaki Merbabu', filled: !!formData.climberCode });
    }

    const completed = fields.filter(f => f.filled).length;
    return {
      percentage: Math.round((completed / fields.length) * 100),
      isComplete: completed === fields.length,
      missing: fields.filter(f => !f.filled).map(f => f.name)
    };
  }, [formData, isMerbabu]);

  const initiateRegister = () => {
    if (!formProgress.isComplete) {
      setToastMsg(`Lengkapi data: ${formProgress.missing[0]}`);
      setShowToast(true);
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    setIsSending(true);
    const newReg: Registration = { 
      ...formData, 
      id: Date.now(), 
      status: 'Terdaftar', 
      timestamp: new Date().toLocaleString('id-ID') 
    };

    try {
      if (settings.googleScriptUrl) {
        const response = await fetch(settings.googleScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'NEW_REGISTRATION',
            spreadsheetId: settings.spreadsheetId,
            registration: newReg
          })
        });
        const result = await response.json();
        if (result.status !== 'success') throw new Error(result.message);
      }
      finishRegistration(newReg);
    } catch (error) {
      console.error("Sync Error:", error);
      // Tetap selesaikan proses offline jika gagal sync
      finishRegistration(newReg);
    }
  };

  const finishRegistration = (reg: Registration) => {
    setLastReg(reg);
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
    setIsSending(false);
    setFormData({
      fullName: '', whatsapp: '', email: '', address: '', mountain: '',
      packageCategory: 'OPEN TRIP', tripPackage: 'REGULER', 
      startDate: '', endDate: '', identityImage: '',
      climberCode: ''
    });
    setShowMerbabuInput(false);
  };

  if (showIntro) return <IntroAnimation onComplete={() => {
    setShowIntro(false);
    setShowWelcome(true);
  }} />;

  if (showWelcome) return <WelcomeOverlay onStart={() => setShowWelcome(false)} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowWelcome(true)}>
            <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20">
              <AppLogo className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none">Jejak Langkah</h1>
              <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest mt-1">Adventure</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={toggleDarkMode}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-brand-red transition-all shadow-inner active:scale-90"
             >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {!lastReg ? (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
                Jejak Langkah <span className="text-brand-red">Adventure.</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium max-w-lg mx-auto italic">
                Lengkapi data diri Anda untuk inisialisasi keberangkatan ekspedisi menuju puncak Nusantara.
              </p>
            </div>

            <div className="space-y-12 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-sm dark:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all duration-500">
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-red font-black">1</div>
                   <h3 className="font-black uppercase text-sm tracking-widest text-slate-400 dark:text-slate-500 italic">Informasi Pribadi & Destinasi</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Nama Lengkap" placeholder="Sesuai KTP" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  <Input label="Nomor WhatsApp" placeholder="08xxxxxxxxxx" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Email Aktif" type="email" placeholder="example@mail.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <Input label="Domisili" placeholder="Kota / Kabupaten" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Dokumen Identitas (KTP)</label>
                  <div className="relative group">
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className={`w-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all active:scale-[0.98] ${formData.identityImage ? 'border-brand-red bg-brand-red/5 dark:bg-brand-red/10' : 'border-slate-200 dark:border-slate-800 hover:border-brand-red/40 bg-slate-50 dark:bg-slate-950/50'}`}
                    >
                      {formData.identityImage ? (
                        <div className="flex flex-col items-center gap-3">
                           <div className="w-16 h-16 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red animate-pulse">
                             <CheckCircle2 size={32} />
                           </div>
                           <span className="text-xs font-black uppercase text-brand-red tracking-widest italic">KTP Berhasil Dipilih</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600">
                            <Camera size={32} />
                          </div>
                          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-600 italic">Klik untuk Unggah KTP</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const r = new FileReader();
                          r.onloadend = () => setFormData({...formData, identityImage: r.result as string});
                          r.readAsDataURL(file);
                        }
                      }} className="hidden" />
                    </button>
                    {formData.identityImage && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFormData({...formData, identityImage: ''}); }}
                        className="absolute top-4 right-4 p-3 bg-brand-red text-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-950/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <Select label="Tujuan Pendakian" options={MOUNTAINS} value={formData.mountain} onChange={e => setFormData({...formData, mountain: e.target.value})} />
                </div>

                {isMerbabu && (
                  <div className="animate-in zoom-in-95 slide-in-from-top-4 duration-500">
                    <div className="bg-brand-red/5 dark:bg-brand-red/10 p-8 rounded-[2rem] border-2 border-brand-red/20 space-y-6 relative overflow-hidden group">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-brand-red text-white flex items-center justify-center shrink-0 shadow-lg relative z-10">
                          <Fingerprint size={32} />
                        </div>
                        <div className="flex-1 space-y-1 relative z-10">
                           <h4 className="text-sm font-black uppercase italic text-slate-900 dark:text-white leading-none">Aktivasi Kode Pendaki Merbabu</h4>
                           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic">Wajib untuk verifikasi pendakian Gunung Merbabu</p>
                        </div>
                        {!showMerbabuInput ? (
                          <Button 
                            onClick={() => setShowMerbabuInput(true)}
                            variant="primary" 
                            className="w-full md:w-auto px-6 py-3 rounded-xl italic relative z-10"
                          >
                            KODE PENDAKI
                          </Button>
                        ) : (
                          <button 
                            onClick={() => window.open('https://booking.tngunungmerbabu.org/app/index.php', '_blank')} 
                            className="text-brand-red flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline italic relative z-10"
                          >
                            Dapatkan Kode <ExternalLink size={12}/>
                          </button>
                        )}
                      </div>
                      {showMerbabuInput && (
                        <div className="pt-4 border-t border-brand-red/10 animate-in fade-in slide-in-from-top-2">
                          <Input 
                            label="Masukkan Kode Registrasi Merbabu" 
                            placeholder="Contoh: MER-XXXX-XXXX" 
                            value={formData.climberCode} 
                            onChange={e => setFormData({...formData, climberCode: e.target.value})} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8 pt-4">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-red font-black">2</div>
                   <h3 className="font-black uppercase text-sm tracking-widest text-slate-400 dark:text-slate-500 italic">Jadwal & Paket</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Tanggal Berangkat" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                  <Input label="Tanggal Selesai" type="date" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} min={formData.startDate || new Date().toISOString().split('T')[0]} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RadioGroup label="Kategori Layanan" options={LAYANAN_OPTIONS} value={formData.packageCategory} onChange={v => setFormData({...formData, packageCategory: v})} />
                  <RadioGroup label="Pilihan Paket" options={PAKET_OPTIONS} value={formData.tripPackage} onChange={v => setFormData({...formData, tripPackage: v})} />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                <Button 
                  onClick={initiateRegister}
                  loading={isSending}
                  fullWidth
                  className="italic shadow-brand text-sm md:text-base py-6"
                >
                  Daftar Sekarang <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in flex flex-col items-center">
             <div className="text-center space-y-4 mb-12">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-green-500/20 animate-scale-in">
                 <CheckCircle2 size={40} />
               </div>
               <h2 className="text-4xl md:text-6xl font-black uppercase italic text-slate-900 dark:text-white tracking-tighter transition-colors leading-none">Registrasi Berhasil.</h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium italic">Tiket pendakian resmi Anda telah berhasil diterbitkan oleh sistem.</p>
             </div>
             <ETicketCard registration={lastReg} />
             <div className="mt-12 flex flex-col items-center gap-6">
                <Button 
                  onClick={() => setLastReg(null)} 
                  variant="ghost"
                  className="text-[10px] italic hover:scale-105"
                >
                  / Daftar Peserta Lain
                </Button>
             </div>
          </div>
        )}
      </main>

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalConfirm}
        data={formData}
        isSending={isSending}
        bankInfo={{ bankName: "BRI", accountNumber: "570401009559504", accountName: "ILHAM FADHILAH" }}
      />

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} data={lastReg} />
      <Toast isVisible={showToast} message={toastMsg} onClose={() => setShowToast(false)} />
    </div>
  );
};

export default App;
