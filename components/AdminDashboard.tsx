
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Registration, AdminSettings } from '../types';
import * as XLSX from 'xlsx';
import { 
  RefreshCw, Download, Search, X, Eye, 
  ShieldCheck, Activity, Database, Server, 
  Terminal, CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  data: Registration[];
  onUpdateStatus?: (id: number, newStatus: string) => void;
  onSettingsUpdate?: (settings: AdminSettings) => void;
  initialSettings: AdminSettings;
  onLogout?: () => void;
}

interface SystemLog {
  id: string;
  msg: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

const AdminDashboard: React.FC<DashboardProps> = ({ 
  data: localData, 
  onUpdateStatus, 
  onSettingsUpdate, 
  onLogout, 
  initialSettings
}) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'database' | 'config'>('monitor');
  const [search, setSearch] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [cloudData, setCloudData] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [lastSync, setLastSync] = useState<string>('OFFLINE');
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const prevCloudIds = useRef<Set<number>>(new Set());

  const addLog = useCallback((msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      msg,
      time: new Date().toLocaleTimeString('id-ID'),
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 15));
  }, []);

  const fetchFromCloud = useCallback(async (isManual = false) => {
    if (!settings.googleScriptUrl || !settings.spreadsheetId) {
      addLog('Konfigurasi Cloud belum lengkap', 'warning');
      return;
    }
    
    if (isManual) setIsLoading(true);
    
    try {
      const response = await fetch(settings.googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'FETCH_ALL',
          spreadsheetId: settings.spreadsheetId
        })
      });
      
      const result = await response.json();
      if (result.status === 'success' && Array.isArray(result.data)) {
        const newData: Registration[] = result.data;
        
        if (prevCloudIds.current.size > 0) {
          const newEntries = newData.filter(r => !prevCloudIds.current.has(r.id));
          newEntries.forEach(entry => {
            addLog(`Inbound Data: ${entry.fullName} mendaftar ke ${entry.mountain}`, 'success');
          });
        } else {
          addLog(`Koneksi Server Berhasil. ${newData.length} data dimuat.`, 'success');
        }
        
        prevCloudIds.current = new Set(newData.map(r => r.id));
        setCloudData(newData);
        setLastSync(new Date().toLocaleTimeString('id-ID'));
      }
    } catch (err) {
      addLog('Gagal menarik data dari server cloud', 'warning');
      console.error(err);
    } finally {
      if (isManual) setIsLoading(false);
    }
  }, [settings.googleScriptUrl, settings.spreadsheetId, addLog]);

  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(() => fetchFromCloud(), 15000);
    return () => clearInterval(interval);
  }, [fetchFromCloud]);

  const displayData = useMemo(() => {
    const combined = [...cloudData];
    localData.forEach(local => {
      if (!combined.find(c => c.id.toString() === local.id.toString())) {
        combined.push(local);
      }
    });
    return combined.sort((a, b) => b.id - a.id);
  }, [cloudData, localData]);

  const filteredData = useMemo(() => {
    return displayData.filter(item => 
      !search || 
      item.fullName.toLowerCase().includes(search.toLowerCase()) || 
      item.whatsapp.includes(search) ||
      item.mountain.toLowerCase().includes(search.toLowerCase())
    );
  }, [displayData, search]);

  const stats = useMemo(() => {
    const verified = displayData.filter(r => r.status === 'Terverifikasi').length;
    const pending = displayData.filter(r => r.status === 'Menunggu Verifikasi').length;
    return { total: displayData.length, verified, pending };
  }, [displayData]);

  const handleActionStatus = async (id: number, status: string, name: string) => {
    if (onUpdateStatus) {
      addLog(`Mempersiapkan status ${status} untuk ${name}...`, 'info');
      await onUpdateStatus(id, status);
      addLog(`Status ${name} berhasil diubah ke ${status}`, 'success');
      fetchFromCloud(true);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-brand-red animate-in fade-in duration-700">
      <header className="fixed top-0 left-0 w-full z-[100] px-6 py-4 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center shadow-glow-red">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter italic">Admin <span className="text-brand-red">Server Node.</span></h1>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-brand-red animate-pulse' : 'bg-green-500'}`}></span>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Status: {isLoading ? 'SYNCING' : 'ONLINE'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Uptime Monitor</span>
            <span className="text-[10px] font-black tabular-nums">{lastSync}</span>
          </div>
          <button onClick={onLogout} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-red transition-all">
            Logout
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-1 flex lg:flex-col gap-4">
          {[
            { id: 'monitor', icon: Activity },
            { id: 'database', icon: Database },
            { id: 'config', icon: Server }
          ].map(btn => (
            <button 
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`flex-1 lg:flex-none h-16 w-full lg:w-16 rounded-2xl flex items-center justify-center transition-all ${activeTab === btn.id ? 'bg-brand-red text-white shadow-glow-red' : 'bg-navy-900 border border-white/5 text-slate-500 hover:text-white'}`}
            >
              <btn.icon size={20} />
            </button>
          ))}
        </aside>

        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'monitor' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Server Capacity</span>
                  <div className="flex justify-between items-end">
                    <h4 className="text-4xl font-black tabular-nums">{stats.total}</h4>
                    <span className="text-[10px] font-bold text-slate-400">Pendaftar</span>
                  </div>
                </div>
                <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Nodes Verified</span>
                  <div className="flex justify-between items-end">
                    <h4 className="text-4xl font-black tabular-nums text-green-500">{stats.verified}</h4>
                    <span className="text-[10px] font-bold text-slate-400">Sukses</span>
                  </div>
                </div>
                <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                  <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">Pending Sync</span>
                  <div className="flex justify-between items-end">
                    <h4 className="text-4xl font-black tabular-nums text-brand-red">{stats.pending}</h4>
                    <span className="text-[10px] font-bold text-slate-400">Menunggu</span>
                  </div>
                </div>
              </div>

              <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black uppercase italic tracking-tighter">Inbound <span className="text-brand-red">Queue.</span></h3>
                   <button onClick={() => fetchFromCloud(true)} className="flex items-center gap-2 text-[9px] font-black text-slate-500 hover:text-brand-red transition-colors uppercase tracking-widest">
                     <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Live
                   </button>
                </div>

                <div className="space-y-4">
                  {displayData.slice(0, 5).map(reg => (
                    <div key={reg.id} className="group bg-navy-950/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-red/30 transition-all">
                       <div className="flex items-center gap-5 w-full md:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 font-black text-xs">ID</div>
                          <div className="min-w-0">
                             <h5 className="font-black uppercase text-sm truncate">{reg.fullName}</h5>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{reg.mountain} • {reg.tripPackage}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3 w-full md:w-auto">
                          {reg.status === 'Menunggu Verifikasi' ? (
                            <button 
                              onClick={() => handleActionStatus(reg.id, 'Terverifikasi', reg.fullName)}
                              className="flex-1 md:flex-none px-6 py-3 bg-brand-red text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-glow-red hover:scale-105 active:scale-95 transition-all"
                            >
                              Konfirmasi Verifikasi
                            </button>
                          ) : (
                            <div className="px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                              <CheckCircle2 size={12} /> Terverifikasi
                            </div>
                          )}
                          <button onClick={() => setPreviewImage(reg.identityImage || null)} className="p-3 bg-white/5 text-slate-500 hover:text-white rounded-xl">
                            <Eye size={16} />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
               <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Query Database..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-navy-950/60 border border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                  <button onClick={() => {
                    const ws = XLSX.utils.json_to_sheet(displayData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Data");
                    XLSX.writeFile(wb, "Database-Jejak-Langkah.xlsx");
                  }} className="w-full md:w-auto px-6 py-4 bg-navy-950 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:text-brand-red transition-all">
                    <Download size={14} /> Export XLS
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                     <tr>
                       <th className="px-8 py-6">ID & Timestamp</th>
                       <th className="px-8 py-6">Participant</th>
                       <th className="px-8 py-6">Target</th>
                       <th className="px-8 py-6 text-right">Server Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-[11px]">
                     {filteredData.map(reg => (
                       <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-8 py-6">
                            <span className="font-black tabular-nums block">#{reg.id.toString().slice(-6)}</span>
                            <span className="text-[9px] text-slate-500">{reg.timestamp}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className="font-black uppercase block">{reg.fullName}</span>
                            <span className="text-slate-500 font-bold">{reg.whatsapp}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className="font-black text-brand-red uppercase block">{reg.mountain}</span>
                            <span className="text-[9px] text-slate-500 uppercase">{reg.tripPackage}</span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <select 
                              value={reg.status} 
                              onChange={(e) => handleActionStatus(reg.id, e.target.value, reg.fullName)}
                              className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase outline-none cursor-pointer ${reg.status === 'Terverifikasi' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-brand-red/10 border-brand-red/20 text-brand-red'}`}
                            >
                              <option value="Menunggu Verifikasi" className="bg-navy-900">Pending</option>
                              <option value="Terverifikasi" className="bg-navy-900">Verified</option>
                              <option value="Dibatalkan" className="bg-navy-900">Cancel</option>
                            </select>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] p-10 space-y-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Server <span className="text-brand-red">Configuration.</span></h3>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Atur parameter konektivitas Google Apps Script API.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Spreadsheet Cloud ID</label>
                    <input type="text" value={settings.spreadsheetId} onChange={e => setSettings({...settings, spreadsheetId: e.target.value})} className="w-full px-6 py-4 bg-navy-950 border border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Apps Script API URL</label>
                    <input type="text" value={settings.googleScriptUrl} onChange={e => setSettings({...settings, googleScriptUrl: e.target.value})} className="w-full px-6 py-4 bg-navy-950 border border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all" />
                  </div>
               </div>
               <button onClick={() => onSettingsUpdate?.(settings)} className="w-full py-5 bg-white text-navy-950 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-brand-red hover:text-white transition-all">
                 Terapkan & Simpan Konfigurasi
               </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="bg-navy-900 border border-white/5 rounded-[2rem] p-8 space-y-6 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <Terminal size={18} className="text-brand-red" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Live Audit Logs</h4>
              </div>
              
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar font-mono text-xs">
                 {logs.length === 0 && <p className="text-[9px] text-slate-700 italic">Menunggu sinyal server...</p>}
                 {logs.map(log => (
                   <div key={log.id} className="space-y-1 animate-in slide-in-from-right-2 duration-300">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-slate-600">[{log.time}]</span>
                        <div className={`w-1 h-1 rounded-full ${log.type === 'success' ? 'bg-green-500' : log.type === 'warning' ? 'bg-brand-red' : 'bg-blue-500'}`}></div>
                      </div>
                      <p className={`text-[10px] leading-relaxed break-words ${log.type === 'success' ? 'text-green-500' : log.type === 'warning' ? 'text-brand-red' : 'text-slate-400'}`}>
                        {log.msg}
                      </p>
                   </div>
                 ))}
              </div>
              
              <div className="pt-4 border-t border-white/5 space-y-4">
                 <div className="bg-navy-950 p-4 rounded-xl space-y-2">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Koneksi Aktif</p>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black">Google Cloud Node</span>
                       <CheckCircle2 size={12} className="text-green-500" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {previewImage && (
        <div className="fixed inset-0 z-[200] bg-navy-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
           <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white"><X size={32} /></button>
              <img src={previewImage} className="w-full h-auto max-h-[85vh] object-contain rounded-3xl shadow-2xl border border-white/10" alt="Preview" />
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
