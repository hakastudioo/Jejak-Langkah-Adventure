
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Registration, AdminSettings } from '../types';
import * as XLSX from 'xlsx';
import { 
  RefreshCw, Download, Search, X, Eye, 
  ShieldCheck, Activity, Database, Server, 
  Terminal, CheckCircle2, HelpCircle, Copy, Check, ExternalLink, Image as ImageIcon, Link2, Bug
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
  type: 'info' | 'success' | 'warning' | 'debug';
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
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const prevCloudIds = useRef<Set<number>>(new Set());

  const addLog = useCallback((msg: string, type: 'info' | 'success' | 'warning' | 'debug' = 'info') => {
    if (type === 'debug' && !isDebugMode) return;

    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      msg,
      time: new Date().toLocaleTimeString('id-ID'),
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 30));
  }, [isDebugMode]);

  const fetchFromCloud = useCallback(async (isManual = false) => {
    if (!settings.googleScriptUrl || !settings.spreadsheetId) {
      return;
    }
    
    if (isManual) setIsLoading(true);
    
    const payload = {
      action: 'FETCH_ALL',
      spreadsheetId: settings.spreadsheetId
    };

    if (isDebugMode) {
      addLog(`[DEBUG] POST Request: ${settings.googleScriptUrl?.substring(0, 40)}...`, 'debug');
      addLog(`[DEBUG] Payload: ${JSON.stringify(payload)}`, 'debug');
    }

    try {
      const startTime = Date.now();
      const response = await fetch(settings.googleScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (isDebugMode) {
        const duration = Date.now() - startTime;
        addLog(`[DEBUG] Response received in ${duration}ms`, 'debug');
        addLog(`[DEBUG] Raw Response: ${JSON.stringify(result).substring(0, 100)}...`, 'debug');
      }

      if (result.status === 'success' && Array.isArray(result.data)) {
        const newData: Registration[] = result.data;
        
        if (prevCloudIds.current.size > 0) {
          const newEntries = newData.filter(r => !prevCloudIds.current.has(r.id));
          newEntries.forEach(entry => {
            addLog(`Inbound Data: ${entry.fullName} mendaftar ke ${entry.mountain}`, 'success');
          });
        }
        
        prevCloudIds.current = new Set(newData.map(r => r.id));
        setCloudData(newData);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      addLog(`Sync Error: ${error.message}`, 'warning');
      if (isDebugMode) addLog(`[DEBUG] Stack: ${error.stack || 'No stack trace'}`, 'warning');
    } finally {
      if (isManual) setIsLoading(false);
    }
  }, [settings.googleScriptUrl, settings.spreadsheetId, addLog, isDebugMode]);

  useEffect(() => {
    fetchFromCloud();
    const interval = setInterval(() => fetchFromCloud(), 20000);
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
    const pending = displayData.filter(r => r.status === 'Menunggu Verifikasi' || r.status === 'Terdaftar').length;
    return { total: displayData.length, verified, pending };
  }, [displayData]);

  const handleActionStatus = async (id: number, status: string, name: string) => {
    if (onUpdateStatus) {
      const payload = { action: 'UPDATE_STATUS', id, status };
      
      if (isDebugMode) {
        addLog(`[DEBUG] Updating Status for ${name}...`, 'debug');
        addLog(`[DEBUG] Payload: ${JSON.stringify(payload)}`, 'debug');
      }

      addLog(`Memperbarui status ${name}...`, 'info');
      await onUpdateStatus(id, status);
      addLog(`Status ${name} -> ${status}`, 'success');
      fetchFromCloud(true);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const openIdentity = (identity: string) => {
    if (identity.startsWith('http')) {
      window.open(identity, '_blank');
    } else if (identity.startsWith('data:image')) {
      setPreviewImage(identity);
    } else {
      addLog('Format identitas tidak valid atau kosong', 'warning');
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
            <h1 className="text-sm font-black uppercase tracking-tighter italic">Admin <span className="text-brand-red">Control.</span></h1>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-brand-red animate-pulse' : 'bg-green-500'}`}></span>
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">System Node: {isLoading ? 'SYNCING' : 'READY'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const newState = !isDebugMode;
              setIsDebugMode(newState);
              addLog(`Debug Mode: ${newState ? 'AKTIF' : 'NON-AKTIF'}`, newState ? 'success' : 'info');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${isDebugMode ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}
          >
            <Bug size={16} className={isDebugMode ? 'animate-pulse' : ''} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden md:block">Debug Mode</span>
          </button>

          <button onClick={onLogout} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-red transition-all">
            Log Out
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-1 flex lg:flex-col gap-4">
          {[
            { id: 'monitor', icon: Activity, label: 'Live' },
            { id: 'database', icon: Database, label: 'Data' },
            { id: 'config', icon: Server, label: 'Cloud' }
          ].map(btn => (
            <button 
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`relative flex-1 lg:flex-none h-16 w-full lg:w-16 rounded-2xl flex items-center justify-center transition-all group ${activeTab === btn.id ? 'bg-brand-red text-white shadow-glow-red' : 'bg-navy-900 border border-white/5 text-white/30 hover:text-white'}`}
            >
              <btn.icon size={20} />
              <span className="absolute left-20 px-4 py-2 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block z-50 pointer-events-none">{btn.label}</span>
            </button>
          ))}
        </aside>

        <div className="lg:col-span-11 space-y-6">
          {activeTab === 'monitor' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
               <div className="xl:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Database Size</span>
                      <div className="flex justify-between items-end">
                        <h4 className="text-4xl font-black tabular-nums">{stats.total}</h4>
                        <span className="text-[10px] font-bold text-white/40">Records</span>
                      </div>
                    </div>
                    <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                      <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                      <div className="flex justify-between items-end">
                        <h4 className="text-4xl font-black tabular-nums text-green-500">{stats.verified}</h4>
                        <span className="text-[10px] font-bold text-white/40">Entries</span>
                      </div>
                    </div>
                    <div className="bg-navy-900 border border-white/5 p-8 rounded-[2rem] space-y-1">
                      <span className="text-[9px] font-black text-brand-red uppercase tracking-widest">Pending Sync</span>
                      <div className="flex justify-between items-end">
                        <h4 className="text-4xl font-black tabular-nums text-brand-red">{stats.pending}</h4>
                        <span className="text-[10px] font-bold text-white/40">Tasks</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black uppercase italic tracking-tighter">Inbound <span className="text-brand-red">Feed.</span></h3>
                       <button onClick={() => fetchFromCloud(true)} className="flex items-center gap-2 text-[9px] font-black text-white/30 hover:text-brand-red transition-colors uppercase tracking-widest">
                         <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Sync
                       </button>
                    </div>

                    <div className="space-y-4">
                      {displayData.slice(0, 5).map(reg => (
                        <div key={reg.id} className="group bg-navy-950/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-red/30 transition-all">
                           <div className="flex items-center gap-5 w-full md:w-auto">
                              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/30 font-black text-xs italic">REF</div>
                              <div className="min-w-0">
                                 <h5 className="font-black uppercase text-sm truncate">{reg.fullName}</h5>
                                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-tight">{reg.mountain} • {reg.packageCategory}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-3 w-full md:w-auto">
                              {reg.status === 'Terdaftar' || reg.status === 'Menunggu Verifikasi' ? (
                                <button 
                                  onClick={() => handleActionStatus(reg.id, 'Terverifikasi', reg.fullName)}
                                  className="flex-1 md:flex-none px-6 py-3 bg-brand-red text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-glow-red hover:scale-105 active:scale-95 transition-all italic"
                                >
                                  Approve
                                </button>
                              ) : (
                                <div className="px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 italic">
                                  <CheckCircle2 size={12} /> Verified
                                </div>
                              )}
                              <button 
                                onClick={() => openIdentity(reg.identityImage || '')} 
                                className="p-3 bg-white/5 text-white/30 hover:text-white rounded-xl flex items-center gap-2 transition-all"
                                title="Lihat Identitas"
                              >
                                {reg.identityImage?.startsWith('http') ? <Link2 size={16} /> : <ImageIcon size={16} />}
                              </button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>

               <div className="xl:col-span-1 space-y-6">
                  <div className="bg-navy-900 border border-white/5 rounded-[2rem] p-8 space-y-6 h-full min-h-[500px] flex flex-col shadow-2xl">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <Terminal size={18} className="text-brand-red" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Activity Terminal</h4>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar font-mono text-xs">
                      {logs.length === 0 && <p className="text-white/20 italic">Listening for events...</p>}
                      {logs.map(log => (
                        <div key={log.id} className="space-y-1 animate-in slide-in-from-right-2 duration-300">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] text-white/30">[{log.time}]</span>
                              <div className={`w-1 h-1 rounded-full ${
                                log.type === 'success' ? 'bg-green-500' : 
                                log.type === 'warning' ? 'bg-brand-red' : 
                                log.type === 'debug' ? 'bg-purple-500' :
                                'bg-blue-500'
                              }`}></div>
                            </div>
                            <p className={`text-[10px] leading-relaxed break-words ${
                              log.type === 'success' ? 'text-green-500' : 
                              log.type === 'warning' ? 'text-brand-red' : 
                              log.type === 'debug' ? 'text-purple-400 font-bold' :
                              'text-white/50'
                            }`}>
                              {log.msg}
                            </p>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 shadow-2xl">
               <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 relative w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                    <input 
                      type="text" 
                      placeholder="Cari database peserta..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-navy-950/60 border border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all"
                    />
                  </div>
                  <button onClick={() => {
                    const ws = XLSX.utils.json_to_sheet(displayData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Database");
                    XLSX.writeFile(wb, "Jejak-Langkah-Participants.xlsx");
                  }} className="w-full md:w-auto px-6 py-4 bg-navy-950 border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest hover:text-brand-red transition-all">
                    <Download size={14} /> Export to Excel
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                     <tr>
                       <th className="px-8 py-6">Ref. Code</th>
                       <th className="px-8 py-6">Participant</th>
                       <th className="px-8 py-6">Identity</th>
                       <th className="px-8 py-6">Expedition</th>
                       <th className="px-8 py-6 text-right">Status Control</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-[11px]">
                     {filteredData.length === 0 && (
                       <tr><td colSpan={5} className="px-8 py-20 text-center text-white/20 font-bold uppercase tracking-widest">No entries found</td></tr>
                     )}
                     {filteredData.map(reg => (
                       <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                            <span className="font-black tabular-nums block text-white/40 group-hover:text-white transition-colors">#{reg.id.toString().slice(-6)}</span>
                            <span className="text-[9px] text-white/20">{reg.timestamp?.split(',')[0]}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="font-black uppercase text-white">{reg.fullName}</div>
                            <div className="text-[10px] text-white/40 font-bold">{reg.whatsapp}</div>
                         </td>
                         <td className="px-8 py-6">
                           <button 
                             onClick={() => openIdentity(reg.identityImage || '')} 
                             className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-white/40 hover:text-brand-red hover:bg-brand-red/10 transition-all font-black uppercase text-[9px] italic"
                           >
                             {reg.identityImage?.startsWith('http') ? <Link2 size={12} /> : <ImageIcon size={12} />}
                             {reg.identityImage?.startsWith('http') ? 'Cloud Link' : 'Local View'}
                           </button>
                         </td>
                         <td className="px-8 py-6">
                            <span className="font-black text-brand-red uppercase block italic">{reg.mountain}</span>
                            <span className="text-[9px] text-white/30 uppercase font-bold">{reg.packageCategory} • {reg.tripPackage}</span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <select 
                              value={reg.status} 
                              onChange={(e) => handleActionStatus(reg.id, e.target.value, reg.fullName)}
                              className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase outline-none cursor-pointer italic ${reg.status === 'Terverifikasi' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-brand-red/10 border-brand-red/20 text-brand-red'}`}
                            >
                              <option value="Terdaftar" className="bg-navy-900">Pending</option>
                              <option value="Terverifikasi" className="bg-navy-900">Verified</option>
                              <option value="Dibatalkan" className="bg-navy-900">Cancelled</option>
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500">
               <div className="bg-navy-900 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                     <Server size={120} />
                  </div>
                  <div className="space-y-2 relative z-10">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Server <span className="text-brand-red">Configuration.</span></h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Connect your application to Google Cloud.</p>
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Spreadsheet ID</label>
                        <button onClick={() => copyToClipboard(settings.spreadsheetId || '', 'ss')} className="text-white/40 hover:text-brand-red transition-colors">
                          {copiedField === 'ss' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="relative group/input">
                        <input 
                          type="text" 
                          placeholder="Ex: 1abc1234567890XYZ..."
                          value={settings.spreadsheetId} 
                          onChange={e => setSettings({...settings, spreadsheetId: e.target.value})} 
                          className="w-full px-6 py-5 bg-navy-950 border-2 border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all placeholder:text-navy-800" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                           <Database size={16} className="text-brand-red" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Apps Script Web App URL</label>
                        <button onClick={() => copyToClipboard(settings.googleScriptUrl || '', 'script')} className="text-white/40 hover:text-brand-red transition-colors">
                          {copiedField === 'script' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div className="relative group/input">
                        <input 
                          type="text" 
                          placeholder="Ex: https://script.google.com/macros/s/.../exec"
                          value={settings.googleScriptUrl} 
                          onChange={e => setSettings({...settings, googleScriptUrl: e.target.value})} 
                          className="w-full px-6 py-5 bg-navy-950 border-2 border-white/5 rounded-2xl text-xs font-bold outline-none focus:border-brand-red transition-all placeholder:text-navy-800" 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                           <ExternalLink size={16} className="text-brand-red" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={() => {
                          onSettingsUpdate?.(settings);
                          fetchFromCloud(true);
                        }} 
                        className="w-full py-6 bg-brand-red text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-glow-red hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                      >
                        {isLoading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        SAVE & SYNC CLOUD
                      </button>
                    </div>
                  </div>
               </div>

               <div className="bg-navy-950/40 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl overflow-y-auto custom-scrollbar max-h-[600px] xl:max-h-none">
                  <div className="flex items-center gap-4 text-brand-red">
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/10 flex items-center justify-center">
                       <HelpCircle size={24} />
                    </div>
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-white leading-none">Panduan <br/> <span className="text-brand-red">Integrasi.</span></h4>
                  </div>
                  
                  <div className="space-y-10">
                    <div className="space-y-4 relative">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-brand-red shrink-0 italic">01</span>
                        <h5 className="text-[11px] font-black uppercase text-white tracking-widest">ID Spreadsheet</h5>
                      </div>
                      <div className="pl-12 space-y-3">
                         <p className="text-[10px] text-white/40 leading-relaxed font-medium">
                           Salin bagian unik dari URL Google Sheets Anda.
                         </p>
                         <div className="bg-navy-950 border border-white/5 p-4 rounded-xl text-[9px] font-mono text-white/30 break-all leading-relaxed">
                           spreadsheets/d/<span className="text-brand-red bg-brand-red/10 px-1 rounded font-black italic">ID_SPREADSHEET</span>/edit
                         </div>
                      </div>
                    </div>

                    <div className="p-6 bg-brand-red/5 border border-brand-red/20 rounded-2xl relative">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-white shadow-glow-red">
                         <ShieldCheck size={16} />
                      </div>
                      <p className="text-[10px] font-bold text-brand-red leading-relaxed italic pr-4">
                        Drive Auto-Sync Aktif: Identitas peserta kini otomatis dikonversi menjadi Link Google Drive di kolom K Spreadsheet Anda. Memudahkan verifikasi tanpa memperberat ukuran file Sheets.
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {previewImage && (
        <div className="fixed inset-0 z-[200] bg-navy-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
           <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
              <div className="bg-navy-900 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
                 <img src={previewImage} className="w-full h-auto max-h-[80vh] object-contain rounded-[2rem]" alt="Identity Preview" />
              </div>
              <div className="mt-6 text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Document Inspection Mode</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
