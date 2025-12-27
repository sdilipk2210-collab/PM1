
import React, { useState } from 'react';
import { SOP, Company, RMIFocus } from '../types';
import { geminiService } from '../services/geminiService';

interface SOPLibraryProps {
  sops: SOP[];
  companies: Company[];
  onAddSOP: (sop: Partial<SOP>) => void;
  onUpdateSOP: (sop: SOP) => void;
}

const SOPLibrary: React.FC<SOPLibraryProps> = ({ sops, companies, onAddSOP, onUpdateSOP }) => {
  const [showModal, setShowModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [editingSOP, setEditingSOP] = useState<SOP | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    companyId: companies[0].id,
    rmiFocus: 'Maintain' as RMIFocus,
    status: 'Draft' as 'Draft' | 'Active' | 'Review Required'
  });

  const handleOpenCreate = () => {
    setEditingSOP(null);
    setForm({
      title: '',
      description: '',
      content: '',
      companyId: companies[0].id,
      rmiFocus: 'Maintain',
      status: 'Draft'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (sop: SOP) => {
    setEditingSOP(sop);
    setForm({
      title: sop.title,
      description: sop.description,
      content: sop.content,
      companyId: sop.companyId,
      rmiFocus: sop.rmiFocus,
      status: sop.status
    });
    setShowModal(true);
  };

  const handleGenerateAI = async () => {
    if (!form.title) return alert("Enter a title first");
    setLoadingAI(true);
    try {
      const draft = await geminiService.generateSOPDraft(form.title, form.description);
      setForm({ ...form, content: draft || '' });
    } catch (e) {
      console.error(e);
      alert("AI failed to generate draft.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = () => {
    if (editingSOP) {
      onUpdateSOP({ ...editingSOP, ...form, lastUpdated: new Date().toISOString().split('T')[0] });
    } else {
      onAddSOP({ ...form, lastUpdated: new Date().toISOString().split('T')[0] });
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">SOP Library</h2>
          <p className="text-slate-500 font-medium mt-1">Standard Operating Procedures for Portfolio Ops.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.05] transition-all flex items-center gap-3"
        >
          <span>📜</span> New Procedure
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sops.map(sop => (
          <div 
            key={sop.id} 
            onClick={() => handleOpenEdit(sop)}
            className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                 <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border uppercase ${
                   sop.companyId === 'c1' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'
                 }`}>
                   {sop.companyId === 'c1' ? '🎵 Maktune' : '🔷 DE'}
                 </span>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   {sop.rmiFocus} Focus
                 </span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                sop.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {sop.status}
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{sop.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6 flex-1">{sop.description}</p>
            
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span>Last Edit: {sop.lastUpdated}</span>
               <span className="group-hover:text-indigo-600 transition-colors">View Detail →</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-12 shadow-2xl animate-scaleIn h-[90vh] flex flex-col overflow-hidden">
            <h3 className="text-4xl font-black text-slate-900 mb-2">{editingSOP ? 'Optimize Procedure' : 'New Procedure'}</h3>
            <p className="text-slate-500 mb-8 font-medium">Standardize the mission for consistent execution.</p>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Responsible Entity</label>
                    <div className="grid grid-cols-2 gap-4">
                      {companies.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setForm({...form, companyId: c.id})}
                          className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-black text-sm ${
                            form.companyId === c.id 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                              : 'border-slate-100 text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          {c.name.includes('Maktune') ? 'Maktune' : 'DE'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cycle Focus</label>
                    <select 
                      value={form.rmiFocus}
                      onChange={e => setForm({...form, rmiFocus: e.target.value as RMIFocus})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none"
                    >
                      <option value="React">React</option>
                      <option value="Maintain">Maintain</option>
                      <option value="Improvise">Improvise</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Procedure Title</label>
                    <input 
                      type="text"
                      value={form.title}
                      onChange={e => setForm({...form, title: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none"
                      placeholder="e.g. Server Scaling Protocol"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Brief Logic</label>
                    <input 
                      type="text"
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none"
                      placeholder="Why do we need this?"
                    />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step-by-Step Instructions</label>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={loadingAI}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {loadingAI ? 'Oracle Thinking...' : '✨ Generate Draft with AI'}
                  </button>
                </div>
                <textarea 
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 font-medium min-h-[400px] outline-none focus:bg-white focus:border-indigo-600 transition-all whitespace-pre-wrap"
                  placeholder="Describe the process in detail..."
                />
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-slate-100 mt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Abort</button>
              <button onClick={handleSubmit} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] shadow-2xl transition-all">
                Finalize Procedure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPLibrary;
