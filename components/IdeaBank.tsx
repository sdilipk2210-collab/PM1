
import React, { useState } from 'react';
import { Idea, Company, RMIFocus } from '../types';

interface IdeaBankProps {
  ideas: Idea[];
  onAddIdea: (idea: Partial<Idea>) => void;
  onUpdateIdea: (idea: Idea) => void;
  onPromoteToTask: (idea: Idea, rmi: RMIFocus) => void;
  companies: Company[];
}

const IdeaBank: React.FC<IdeaBankProps> = ({ ideas, onAddIdea, onUpdateIdea, onPromoteToTask, companies }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [promotingIdea, setPromotingIdea] = useState<Idea | null>(null);

  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    impact: 5, 
    confidence: 5, 
    ease: 5,
    companyId: companies[0]?.id || ''
  });

  const sortedIdeas = [...ideas].sort((a, b) => b.iceScore - a.iceScore);

  const handleOpenCreate = () => {
    setEditingIdea(null);
    setForm({ title: '', description: '', impact: 5, confidence: 5, ease: 5, companyId: companies[0]?.id || '' });
    setShowModal(true);
  };

  const handleOpenEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setForm({ 
      title: idea.title, 
      description: idea.description, 
      impact: idea.impact, 
      confidence: idea.confidence, 
      ease: idea.ease, 
      companyId: idea.companyId 
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    const iceScore = form.impact * form.confidence * form.ease;
    if (editingIdea) {
      onUpdateIdea({ ...editingIdea, ...form, iceScore });
    } else {
      onAddIdea({ ...form, iceScore, status: 'Backlog' });
    }
    setShowModal(false);
  };

  const CompanyBadge = ({ id }: { id: string }) => {
    const company = companies.find(c => c.id === id) || companies[0];
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${
        id === 'c1' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'
      }`}>
        <span className="text-xs leading-none">{company?.logo}</span>
        <span className="leading-none">{company?.name.includes('Maktune') ? 'Maktune' : 'DE'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-fadeIn pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none mb-2 sm:mb-3">Idea Bank</h2>
          <p className="text-slate-500 font-medium text-xs sm:text-sm">Cross-portfolio innovation pipeline using ICE scoring.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="w-full md:w-auto bg-slate-900 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] shadow-2xl shadow-slate-200 hover:scale-[1.05] transition-all flex items-center justify-center gap-3 relative z-10"
        >
          <span className="text-sm">💡</span> Draft Concept
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {sortedIdeas.map(idea => (
          <div key={idea.id} className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row xl:items-center gap-6 sm:gap-10 hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <CompanyBadge id={idea.companyId} />
                <span className={`text-[8px] sm:text-[10px] px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl font-black uppercase tracking-widest border ${
                  idea.status === 'Validating' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}>
                  {idea.status}
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-4 group-hover:text-indigo-600 transition-colors leading-tight">{idea.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-3xl font-medium text-xs sm:text-[15px]">{idea.description}</p>
              
              <div className="flex flex-wrap gap-3 mt-6 sm:mt-8 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all translate-y-0 sm:translate-y-2 group-hover:translate-y-0">
                <button 
                  onClick={() => handleOpenEdit(idea)}
                  className="flex-1 sm:flex-none px-5 py-2 sm:px-6 sm:py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Modify
                </button>
                <button 
                  onClick={() => setPromotingIdea(idea)}
                  className="flex-1 sm:flex-none px-5 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Deploy
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-slate-50 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex-shrink-0 w-full xl:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <div className="text-center px-2 sm:px-4 flex-1 sm:flex-none">
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1 sm:mb-2 whitespace-nowrap">Impact</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-800 leading-none">{idea.impact}</p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-slate-200 mx-1" />
                <div className="text-center px-2 sm:px-4 flex-1 sm:flex-none">
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1 sm:mb-2 whitespace-nowrap">Conf.</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-800 leading-none">{idea.confidence}</p>
                </div>
                <div className="w-px h-8 sm:h-10 bg-slate-200 mx-1" />
                <div className="text-center px-2 sm:px-4 flex-1 sm:flex-none">
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1 sm:mb-2 whitespace-nowrap">Ease</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-800 leading-none">{idea.ease}</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 sm:h-16 bg-slate-200 mx-2 sm:mx-4" />
              <div className="text-center bg-white px-6 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-[1.5rem] shadow-sm border border-slate-100 min-w-full sm:min-w-[140px]">
                <p className="text-[8px] sm:text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1 sm:mb-2">ICE SCORE</p>
                <p className="text-3xl sm:text-5xl font-black text-indigo-600 leading-none">{idea.iceScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Idea Creation / Editing Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] w-full max-w-2xl p-6 sm:p-12 shadow-2xl animate-scaleIn flex flex-col max-h-[90vh] relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">{editingIdea ? 'Refine Concept' : 'Draft Idea'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-50 rounded-xl text-lg">✕</button>
            </div>
            <p className="text-slate-500 mb-6 sm:mb-10 font-medium text-xs sm:text-sm tracking-tight">Quantify the next growth vector for your portfolio.</p>
            
            <div className="overflow-y-auto pr-2 space-y-8 sm:space-y-10 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
                <div className="space-y-3">
                   <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Target Company</label>
                   <div className="flex gap-3">
                      {companies.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setForm({...form, companyId: c.id})}
                          className={`flex-1 p-3 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all font-black text-[11px] sm:text-[12px] flex items-center justify-center gap-2 ${
                            form.companyId === c.id 
                              ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                              : 'border-slate-100 text-slate-400 hover:border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          {c.name.includes('Maktune') ? 'Maktune' : 'DE'}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="space-y-3">
                   <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Concept Name</label>
                   <input 
                    type="text" 
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 outline-none font-bold text-slate-800 focus:bg-white focus:border-indigo-600 transition-all text-xs sm:text-[15px]" 
                    placeholder="Short & Punchy" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Brief Logic</label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 outline-none font-medium h-24 sm:h-36 focus:bg-white focus:border-indigo-600 transition-all text-xs sm:text-sm leading-relaxed" 
                  placeholder="Explain the value proposition..." 
                />
              </div>
              
              <div className="grid grid-cols-3 gap-3 sm:gap-8 bg-slate-50 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] border border-slate-100">
                {['impact', 'confidence', 'ease'].map((key) => (
                  <div key={key}>
                    <label className="block text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 sm:mb-4 text-center leading-none">{key}</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={form[key as keyof typeof form] as number}
                      onChange={e => setForm({...form, [key]: parseInt(e.target.value) || 0})}
                      className="w-full text-center text-xl sm:text-4xl font-black bg-white border border-slate-200 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm outline-none leading-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 pt-6 sm:pt-10 border-t border-slate-100 mt-auto">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 sm:py-5 border-2 border-slate-100 text-slate-400 rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-4 sm:py-5 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] hover:scale-[1.02] shadow-2xl transition-all">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Selector Modal */}
      {promotingIdea && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] w-full max-w-md p-8 sm:p-12 shadow-2xl animate-scaleIn text-center relative overflow-hidden">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-2xl sm:rounded-[1.75rem] flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6 sm:mb-8 shadow-xl shadow-indigo-100 border border-indigo-100">🚀</div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tight">Deploy Concept</h3>
            <p className="text-slate-500 mb-8 sm:mb-10 font-medium text-xs sm:text-sm">Assign "{promotingIdea.title}" to a strategic focus.</p>
            
            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {(['React', 'Maintain', 'Improvise'] as RMIFocus[]).map(rmi => (
                <button
                  key={rmi}
                  onClick={() => {
                    onPromoteToTask(promotingIdea, rmi);
                    setPromotingIdea(null);
                  }}
                  className="w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 font-black uppercase tracking-[0.2em] text-[10px] sm:text-[11px] transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-lg sm:text-xl">{rmi === 'React' ? '⚡' : rmi === 'Maintain' ? '🛡️' : '🚀'}</span>
                    <span>{rmi} Cycle</span>
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all text-[9px]">DEPLOY →</span>
                </button>
              ))}
            </div>
            
            <button onClick={() => setPromotingIdea(null)} className="text-slate-400 font-black uppercase tracking-widest text-[9px] sm:text-[10px] hover:text-slate-600 transition-colors">Abort Deployment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaBank;
