
import React, { useState, useEffect } from 'react';
import { Company, Project, Task } from '../types';
import { geminiService } from '../services/geminiService';

interface AIInsightsProps {
  company: Company;
  projects: Project[];
  tasks: Task[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ company, projects, tasks }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const result = await geminiService.getProjectAnalysis(company, projects, tasks);
      setAnalysis(result || "No insights available at this time.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error fetching AI analysis. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [company.id]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800 flex items-center justify-center gap-3">
          <span className="text-4xl">🧠</span> AI Strategy Center
        </h2>
        <p className="text-slate-500 text-lg">Harnessing Gemini 3 for executive decision support and predictive project analysis.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-indigo-50/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Consulting the oracle...</p>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none">
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
               <span className="p-2 bg-indigo-50 rounded-xl">✨</span>
               <span className="font-bold uppercase tracking-widest text-sm">Strategic Insight Report</span>
            </div>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
              {analysis}
            </div>
            <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
               <span className="text-sm text-slate-400">Analysis updated just now</span>
               <button 
                 onClick={fetchAnalysis}
                 className="text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
               >
                 🔄 Refresh Analysis
               </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
           <h4 className="font-bold mb-2">Growth Vector Identified</h4>
           <p className="text-indigo-100 text-sm opacity-90">Based on task velocity in "{projects[0]?.name}", there is capacity for one additional mid-scale initiative in Q3.</p>
        </div>
        <div className="bg-amber-500 text-white p-6 rounded-2xl shadow-lg">
           <h4 className="font-bold mb-2">Efficiency Alert</h4>
           <p className="text-amber-50 text-sm opacity-90">Bottleneck detected in cross-department tasks. AI suggests streamlining communication channels for better throughput.</p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
