import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  FileSearch, 
  Upload, 
  Settings, 
  Maximize2, 
  Download, 
  Cpu, 
  BarChart3,
  Bot,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SignalChart } from './components/SignalChart';
import { AnomalyList } from './components/AnomalyList';
import { generateMockData, generateMBDData, cn } from './lib/utils';
import { Anomaly } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'mbd' | 'reports'>('visualizer');
  const [logData, setLogData] = useState<any[]>([]);
  const [mbdData, setMbdData] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    // Initial data load
    const data = generateMockData(100);
    setLogData(data);
    setMbdData(generateMBDData(100));
    
    setAnomalies([
      {
        id: '1',
        timestamp: 0.456,
        parameter: 'Vdc',
        value: 700.2,
        threshold: 650,
        type: 'RULE',
        description: 'Vdc Surge detected. Voltage exceeded safe operating threshold of 650V during load transient.',
        severity: 'HIGH'
      },
      {
        id: '2',
        timestamp: 0.812,
        parameter: 'Iq',
        value: 120.5,
        threshold: 100,
        type: 'AI',
        description: 'Subtle high-frequency oscillations detected in Iq signal, suggesting potential gate driver interference or EMI noise.',
        severity: 'MEDIUM'
      }
    ]);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newData = generateMockData(200);
    setLogData(newData);
    setIsParsing(false);
  };

  const handleAnomalySelect = async (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setAiAnalysis("Analyzing pattern with Hanwha Engineering LLM...");
    
    // Simulate AI analysis call
    try {
      const response = await fetch('/api/analyze-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataContext: anomaly })
      });
      const result = await response.json();
      setAiAnalysis(result.analysis || "Analysis complete. Pattern suggests transient thermal throttling at the power stage.");
    } catch {
      setAiAnalysis("AI Analysis service temporarily unavailable. Falling back to local heuristics.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-app-bg font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-brand-dark">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-hanwha-orange rounded flex items-center justify-center shadow-[0_0_15px_rgba(243,156,18,0.3)]">
              <Cpu className="text-brand-navy w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tighter text-hanwha-orange">PIAVS</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Power Intelligence Suite</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-4">
          {[
            { id: 'visualizer', label: 'Log Analysis', icon: Activity },
            { id: 'mbd', label: 'MBD Logic Validator', icon: ShieldCheck },
            { id: 'reports', label: 'Report Generator', icon: FileSearch },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full px-6 py-4 flex items-center gap-3 transition-all cursor-pointer text-left",
                activeTab === tab.id 
                  ? "bg-brand-dark border-l-4 border-hanwha-orange text-white" 
                  : "text-slate-400 hover:text-white hover:bg-brand-dark/50"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-hanwha-orange" : "text-slate-500")} />
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-brand-dark">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-slate-600 flex items-center justify-center text-[10px] font-bold">HK</div>
            <div>
              <p className="text-xs font-bold">H.S. Kim</p>
              <p className="text-[10px] text-slate-400">Firepower Systems</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">K9-S6 Power Unit Analysis</h2>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[9px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                System Active
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase tracking-wider">
                DBC Loaded
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="font-mono">2026-07-16 14:30:01</span>
            <label className="px-4 py-2 bg-brand-navy text-white rounded font-bold cursor-pointer hover:bg-brand-dark transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5" />
              Import Log File
              <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Top Summary Stats */}
          <div className="grid grid-cols-4 gap-4 shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Parsed Data Size</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-800">1.28</span>
                <span className="text-xs text-slate-400">GB</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Anomaly Count</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-red-600">{anomalies.length}</span>
                <span className="text-[9px] text-slate-400 italic">Unsupervised Detection</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">MBD Sync Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-800">98.4</span>
                <span className="text-xs text-slate-400">% Match</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Analysis Lead Time</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-green-600">-82</span>
                <span className="text-xs text-slate-400">% Reduced</span>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'visualizer' && (
              <motion.div 
                key="visualizer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex gap-6 min-h-0"
              >
                {/* Main Charts Area */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
                  <SignalChart 
                    title="Dynamic Power Signal Overlay (Id/Iq)" 
                    data={logData} 
                    lines={[
                      { key: 'id', color: '#3b82f6', name: 'Id Command' },
                      { key: 'iq', color: '#F39C12', name: 'Iq Actual' }
                    ]}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <SignalChart 
                      title="Bus Voltage (Vdc)" 
                      data={logData} 
                      lines={[{ key: 'vdc', color: '#64748b', name: 'Vdc Bus' }]}
                      height={200}
                      type="area"
                    />
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col">
                      <h3 className="text-xs font-bold text-slate-700 uppercase mb-4 flex items-center justify-between">
                        System Telemetry Highlights
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                      </h3>
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        {[
                          { label: 'IGBT Temp', value: '72.4°C', color: 'text-slate-800' },
                          { label: 'Peak Torque', value: '242 Nm', color: 'text-slate-800' },
                          { label: 'Avg Efficiency', value: '98.4%', color: 'text-green-600' },
                          { label: 'Loop Delay', value: '42us', color: 'text-slate-800' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-100">
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1">{item.label}</p>
                            <p className={cn("text-sm font-mono font-bold", item.color)}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Feed Sidebar */}
                <div className="w-80 shrink-0 flex flex-col gap-6">
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 overflow-hidden flex flex-col shadow-sm">
                    <AnomalyList 
                      anomalies={anomalies} 
                      onSelect={handleAnomalySelect} 
                      selectedId={selectedAnomaly?.id}
                    />
                  </div>
                  
                  {/* AI Context Card */}
                  <div className="bg-[#1B263B] border border-brand-dark rounded-xl p-5 flex flex-col shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Bot className="w-16 h-16 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="w-4 h-4 text-hanwha-orange" />
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">AI Anomaly Analysis</h4>
                    </div>
                    <div className="flex-1 max-h-32 overflow-y-auto custom-scrollbar">
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">
                        {aiAnalysis || "Select an event above for automated root-cause recommendation..."}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'mbd' && (
              <motion.div 
                key="mbd"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="flex-1 flex flex-col gap-6"
              >
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                         <div>
                            <h2 className="text-lg font-bold text-slate-800">MBD 정합성 검증 지표</h2>
                            <p className="text-xs text-slate-500 italic">Comparison Scenario: Step_Response_01 (Model vs. Real)</p>
                         </div>
                         <div className="flex items-center gap-4 text-[10px] font-semibold">
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 bg-blue-500 rounded-full"></i> Simulation Model</span>
                            <span className="flex items-center gap-1.5"><i className="w-2 h-2 bg-green-500 rounded-full"></i> Measured Actual</span>
                         </div>
                      </div>
                      <SignalChart 
                        title="Torque Response Alignment" 
                        data={mbdData} 
                        lines={[
                          { key: 'simulated', color: '#3b82f6', name: 'Simulated' },
                          { key: 'actual', color: '#10b981', name: 'Actual' }
                        ]}
                        height={400}
                      />
                   </div>
                   
                   <div className="col-span-4 flex flex-col gap-6">
                      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-700 uppercase mb-5 flex items-center justify-between">
                          Validation Metrics
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                        </h3>
                        <table className="w-full text-left">
                          <thead>
                            <tr className="text-[10px] text-slate-400 uppercase border-b border-slate-100">
                              <th className="pb-2 font-bold">Parameter</th>
                              <th className="pb-2 font-bold text-right">Error</th>
                              <th className="pb-2 font-bold text-right">Verdict</th>
                            </tr>
                          </thead>
                          <tbody className="text-[11px] font-medium">
                            <tr className="border-b border-slate-50">
                              <td className="py-3 text-slate-700">Settling Time</td>
                              <td className="py-3 text-right text-orange-600">+3.57%</td>
                              <td className="py-3 text-right font-bold text-green-600">PASS</td>
                            </tr>
                            <tr className="border-b border-slate-50">
                              <td className="py-3 text-slate-700">Overshoot</td>
                              <td className="py-3 text-right text-orange-600">+7.11%</td>
                              <td className="py-3 text-right font-bold text-green-600">PASS</td>
                            </tr>
                            <tr>
                              <td className="py-3 text-slate-700">Steady Error</td>
                              <td className="py-3 text-right text-slate-500">+0.01%</td>
                              <td className="py-3 text-right font-bold text-green-600">PASS</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-hanwha-orange/5 border border-hanwha-orange/20 rounded-xl p-6 flex-1">
                         <h3 className="text-[10px] font-bold text-hanwha-orange mb-4 uppercase tracking-widest">Parameter Optimization Hints</h3>
                         <ul className="space-y-4">
                            <li className="flex gap-3 text-[11px] text-slate-700 leading-relaxed">
                               <div className="shrink-0 w-5 h-5 rounded-full bg-hanwha-orange/10 flex items-center justify-center text-[10px] text-hanwha-orange font-bold">1</div>
                               <span>Actual torque lags simulation by 12ms. Recommend increasing Kp in speed loop by 5%.</span>
                            </li>
                            <li className="flex gap-3 text-[11px] text-slate-700 leading-relaxed">
                               <div className="shrink-0 w-5 h-5 rounded-full bg-hanwha-orange/10 flex items-center justify-center text-[10px] text-hanwha-orange font-bold">2</div>
                               <span>Steady state error observed at high load (&gt;80%). Verify feed-forward gain scheduling.</span>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div 
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col items-center justify-center"
              >
                <div className="max-w-xl w-full bg-white border border-slate-200 shadow-xl rounded-2xl p-10 text-center">
                   <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <FileSearch className="w-10 h-10 text-slate-400" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Automated Verification Report</h2>
                   <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                     Generate a comprehensive PDF verification report including signal charts, 
                     AI anomaly analysis, and MBD validation scores tailored for defense standards.
                   </p>
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left">
                         <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Last Analysis</p>
                         <p className="text-xs text-slate-800 font-mono">2026-07-16 17:45</p>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-left">
                         <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</p>
                         <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                         </p>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-brand-navy hover:bg-brand-dark text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" /> Generate Performance Report
                   </button>
                   <p className="mt-4 text-[10px] text-slate-400 italic font-medium">
                     * Compliant with H-Aero Internal standard STD-PRC-2026
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="h-10 bg-slate-800 text-slate-400 text-[10px] px-8 flex items-center justify-between shrink-0">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Local Server: <span className="text-slate-200">Connected</span> (192.168.10.42)
            </span>
            <span>Engine: Python 3.11 / Pandas Dask Backend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="font-medium">Ready for Automated Report Generation</span>
          </div>
        </footer>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isParsing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
               <div className="w-16 h-16 border-4 border-hanwha-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <h3 className="text-xl font-bold text-slate-800">Indexing Log Data</h3>
               <p className="text-slate-500 text-sm mt-2">Dask Parallel Parser: Loading high-frequency telemetry...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
