
import React, { useState } from 'react';
import { Company, RMIFocus, RMIMeta, Project } from '../types';

interface SettingsProps {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  teamMembers: string[];
  setTeamMembers: React.Dispatch<React.SetStateAction<string[]>>;
  rmiConfig: Record<RMIFocus, RMIMeta>;
  setRmiConfig: React.Dispatch<React.SetStateAction<Record<RMIFocus, RMIMeta>>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const Settings: React.FC<SettingsProps> = ({ 
  companies, setCompanies, 
  teamMembers, setTeamMembers, 
  rmiConfig, setRmiConfig,
  projects, setProjects
}) => {
  const [newMember, setNewMember] = useState('');

  const updateCompany = (id: string, field: keyof Company, value: string) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateRMI = (focus: RMIFocus, field: keyof RMIMeta, value: string) => {
    setRmiConfig({
      ...rmiConfig,
      [focus]: { ...rmiConfig[focus], [field]: value }
    });
  };

  const addMember = () => {
    if (newMember && !teamMembers.includes(newMember)) {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember('');
    }
  };

  const removeMember = (name: string) => {
    setTeamMembers(teamMembers.filter(m => m !== name));
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <header>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Global Command Center</h2>
        <p className="text-slate-500 font-medium mt-1">Configure labels, branding, and strategic parameters across the portfolio.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Company Branding */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">🏢</span>
             Entity Branding
          </h3>
          <div className="space-y-6">
            {companies.map(company => (
              <div key={company.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{company.logo}</span>
                  <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Edit {company.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={company.name} 
                      onChange={(e) => updateCompany(company.id, 'name', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Symbol / Icon</label>
                    <input 
                      type="text" 
                      value={company.logo} 
                      onChange={(e) => updateCompany(company.id, 'logo', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Human Resources */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">👥</span>
             Team Registry
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newMember} 
              onChange={(e) => setNewMember(e.target.value)}
              placeholder="Full Name"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:bg-white"
            />
            <button 
              onClick={addMember}
              className="bg-slate-900 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Add Lead
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {teamMembers.map(member => (
              <div key={member} className="flex items-center gap-3 bg-slate-50 border border-slate-100 pl-4 pr-2 py-2 rounded-xl">
                <span className="text-sm font-bold text-slate-700">{member}</span>
                <button 
                  onClick={() => removeMember(member)}
                  className="w-6 h-6 rounded-lg hover:bg-rose-50 hover:text-rose-500 text-slate-300 flex items-center justify-center transition-all"
                >✕</button>
              </div>
            ))}
          </div>
        </section>

        {/* RMI Strategy Definition */}
        <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8 xl:col-span-2">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
             <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">🛡️</span>
             RMI Strategy Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['React', 'Maintain', 'Improvise'] as RMIFocus[]).map(focus => (
              <div key={focus} className={`p-8 rounded-[2.5rem] border-2 border-dashed border-${rmiConfig[focus].color}-200 bg-${rmiConfig[focus].color}-50/30 space-y-6`}>
                <div className="flex items-center gap-4">
                   <span className="text-2xl">{rmiConfig[focus].icon}</span>
                   <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">{focus} Cycle</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Display Label</label>
                    <input 
                      type="text" 
                      value={rmiConfig[focus].label} 
                      onChange={(e) => updateRMI(focus, 'label', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-bold text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Strategic Description</label>
                    <textarea 
                      value={rmiConfig[focus].desc} 
                      onChange={(e) => updateRMI(focus, 'desc', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium text-xs outline-none h-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
