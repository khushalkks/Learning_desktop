import React, { useState } from 'react';
import { User, Code, GraduationCap, Briefcase, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bio' | 'skills' | 'timeline'>('bio');

  const skillsData = {
    languages: ['Python', 'JavaScript', 'C++', 'Java', 'SQL'],
    frontend: ['React.js', 'Tailwind CSS', 'Bootstrap', 'HTML5/CSS3', 'Framer Motion', 'Web Speech API'],
    backend: ['Node.js', 'Express.js', 'Flask', 'FastAPI', 'Firebase', 'REST APIs'],
    aiml: ['Hugging Face', 'scikit-learn', 'Google LLM APIs'],
    databases: ['MongoDB', 'MySQL', 'SQLite', 'Firebase Realtime DB'],
    tools: ['Git', 'GitHub', 'Postman', 'Vercel', 'Netlify', 'Google Cloud', 'VS Code']
  };

  const timelineData = [
    {
      type: 'exp',
      title: 'Research Intern',
      org: 'National Forensic Sciences University (NFSU)',
      date: 'May 2026 - July 2026',
      desc: 'Researched LLM-based Abstractive Summarization using Prompt Engineering and NLP. Applied Hugging Face Transformers, keyword extraction, and ROUGE evaluation metrics for summary optimization.'
    },
    {
      type: 'exp',
      title: 'Participant',
      org: 'Murf AI Coding Challenge',
      date: 'July 2025',
      desc: 'Solved complex algorithmic challenges and explored AI-powered developer workflows in a competitive settings environment.'
    },
    {
      type: 'edu',
      title: 'B.Tech in Computer Science & Engineering',
      org: 'Jaypee University of Engineering & Technology (JUET)',
      date: '2023 - 2027',
      desc: 'Currently in 4th year. Solid foundation in Data Structures and Algorithms with 300+ LeetCode problems solved. GPA: 8.56 / 10.'
    },
    {
      type: 'edu',
      title: 'Senior Secondary (Class XII)',
      org: 'Bishop Johnson School & College, Allahabad',
      date: '2022',
      desc: 'Completed XII grade with high honors, majoring in Science stream. Score: 87%.'
    }
  ];

  const achievementsList = [
    'GirlScript Summer of Code (GSSoC) 2026: Contributed to multiple open-source repositories with 7+ merged Pull Requests.',
    'Walmart Sparkathon 2025: Contributed to scalable solution design in Walmart\'s national innovation challenge.',
    'Hackathon Finalist - Hacksagon, IIITM Gwalior: Developed an automated Resume Tracker with performance analytics in 36 hours.',
    'Hacktoberfest Participant: Raised multiple accepted PRs across open-source GitHub projects.'
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full font-sans select-text">
      {/* Side Tabs navigation */}
      <div className="w-full md:w-48 bg-slate-950/40 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col p-2 space-x-1 md:space-x-0 md:space-y-1 select-none shrink-0">
        <button
          onClick={() => setActiveTab('bio')}
          className={`flex-1 md:flex-none py-2 px-3 rounded-lg flex items-center justify-center md:justify-start space-x-2 text-xs font-bold transition-all ${
            activeTab === 'bio' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <User size={14} />
          <span>Biography</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 md:flex-none py-2 px-3 rounded-lg flex items-center justify-center md:justify-start space-x-2 text-xs font-bold transition-all ${
            activeTab === 'skills' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <Code size={14} />
          <span>Skills Grid</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 md:flex-none py-2 px-3 rounded-lg flex items-center justify-center md:justify-start space-x-2 text-xs font-bold transition-all ${
            activeTab === 'timeline' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          <Briefcase size={14} />
          <span>Timeline</span>
        </button>
      </div>

      {/* Content panel */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        
        {/* Tab 1: Biography */}
        {activeTab === 'bio' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex flex-col items-center justify-center text-indigo-400 font-display font-black text-2xl shadow-neon-blue select-none uppercase shrink-0">
                KKS
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h1 className="text-xl md:text-2xl font-bold font-display text-white">Khushal Kumar Sahu</h1>
                <p className="text-indigo-400 font-mono text-xs md:text-sm font-semibold uppercase tracking-wider">
                  Full-stack Developer & AI Solutions Architect
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-indigo-300">
                    JUET Undergrad (2023 - 2027)
                  </span>
                  <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-slate-900 border border-white/5 rounded text-emerald-300">
                    GPA: 8.56 / 10
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <h2 className="text-xs font-bold font-mono text-indigo-400 tracking-wider uppercase border-b border-white/5 pb-1">
                Introduction
              </h2>
              <p>
                I am a full-stack developer specializing in the MERN stack and AI-integrated applications. I have experience building scalable web platforms using Large Language Models (LLMs), Hugging Face models, and modern web technologies.
              </p>
              <p>
                I possess a strong foundation in Data Structures and Algorithms with over 300+ LeetCode problems solved, which powers my approach to writing efficient, scalable backend architectures and robust state machines.
              </p>
            </div>

            {/* Achievements Bullet Block */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold font-mono text-indigo-400 tracking-wider uppercase border-b border-white/5 pb-1">
                Key Accomplishments
              </h3>
              <div className="grid grid-cols-1 gap-2.5">
                {achievementsList.map((ach, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-300 text-xs font-sans leading-normal">
                    <CheckCircle2 size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <span className="text-xs text-slate-400 font-mono">Connect with me or view my project details next!</span>
              <button 
                onClick={() => {
                  const clickEvent = new CustomEvent('terminal_command', { detail: 'projects' });
                  window.dispatchEvent(clickEvent);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl shadow-lg hover:shadow-neon-blue flex items-center space-x-1.5 transition select-none"
              >
                <span>View My Projects</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold font-display text-white">Technical Core Competencies</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">My tech stack categorizations, languages, and technical frameworks.</p>
            </div>

            <div className="space-y-5">
              {[
                { title: 'Languages', items: skillsData.languages, color: 'text-indigo-400 border-indigo-500/20' },
                { title: 'Frontend UI', items: skillsData.frontend, color: 'text-sky-400 border-sky-500/20' },
                { title: 'Backend & APIs', items: skillsData.backend, color: 'text-emerald-400 border-emerald-500/20' },
                { title: 'AI / ML Frameworks', items: skillsData.aiml, color: 'text-purple-400 border-purple-500/20' },
                { title: 'Databases', items: skillsData.databases, color: 'text-amber-400 border-amber-500/20' },
                { title: 'Developer Tools', items: skillsData.tools, color: 'text-pink-400 border-pink-500/20' }
              ].map((group) => (
                <div key={group.title} className="space-y-2">
                  <h3 className="text-xs font-bold font-mono text-slate-400 tracking-wider uppercase">
                    {group.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className={`text-xs font-mono bg-slate-900 border px-3 py-1 rounded-xl font-medium ${group.color}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold font-display text-white">Experience & Education Steps</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">Milestones on my academic and professional research timeline.</p>
            </div>

            <div className="relative pl-6 border-l border-white/10 space-y-8 py-2">
              {timelineData.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline bullet dot */}
                  <span className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center transition group-hover:scale-115 ${
                    item.type === 'exp' ? 'border-indigo-500 text-indigo-400' : 'border-emerald-500 text-emerald-400'
                  }`}>
                    {item.type === 'exp' ? (
                      <Briefcase size={8} />
                    ) : (
                      <GraduationCap size={8} />
                    )}
                  </span>

                  {/* Timeline block */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition duration-150">
                        {item.title}
                      </h3>
                      <span className="text-[9px] font-mono font-bold bg-white/5 border border-white/5 px-2 py-0.5 rounded text-slate-400 self-start sm:self-auto flex items-center space-x-1 shrink-0 select-none">
                        <Calendar size={10} />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wide">
                      {item.org}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
