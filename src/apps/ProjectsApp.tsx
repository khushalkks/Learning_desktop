import React, { useState } from 'react';
import { FolderGit, ExternalLink, Laptop, Database, Code, Gamepad } from 'lucide-react';
import { Github } from '../components/BrandIcons';

interface Project {
  id: string;
  title: string;
  desc: string;
  category: 'all' | 'fullstack' | 'frontend' | 'games';
  tags: string[];
  github: string;
  demo?: string;
  icon: React.ComponentType<any>;
}

export const ProjectsApp: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'frontend' | 'games'>('all');

  const projectsList: Project[] = [
    {
      id: 'medicare',
      title: 'MediCare - AI Medical Care Platform',
      desc: 'Developed a MERN platform with local Vector RAG matching blood reports to NIH guidelines using OpenAI embeddings. Implemented an agentic scheduler extracting follow-up dates and urgency tags from doctor notes via gpt-4o-mini. Created interactive dashboards using Recharts and MongoDB aggregations.',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'MongoDB', 'Recharts', 'OpenAI API', 'Vector RAG', 'Tailwind CSS'],
      github: 'https://github.com/kkskumarsahu31/medicare',
      demo: '#',
      icon: Database
    },
    {
      id: 'readyboss',
      title: 'ReadyBoss - Resume & Job Application Tracker',
      desc: 'Built a job platform integrating Gemini and Cohere APIs for semantic resume evaluation and ATS keyword matching. Developed an AI mock interview tool and personalized learning roadmaps, utilizing Socket.io for real-time feedback. Implemented secure JWT routing and microservices.',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'Cohere API', 'Socket.io', 'Tailwind CSS'],
      github: 'https://github.com/kkskumarsahu31/readyboss',
      demo: '#',
      icon: Laptop
    },
    {
      id: 'cortexcraft',
      title: 'CortexCraft - AI study Assistant',
      desc: 'Built an AI study assistant providing automated text summarization, flashcard generators, and interactive quizzes. Integrated Google Gemini and Hugging Face models for NLP-driven personalized content and pathways. Designed a Python-based AI microservice.',
      category: 'fullstack',
      tags: ['React', 'Node.js', 'Python', 'Hugging Face', 'MongoDB', 'Gemini API', 'CSS'],
      github: 'https://github.com/kkskumarsahu31/cortexcraft',
      demo: '#',
      icon: Code
    },
    {
      id: 'snake',
      title: 'Retro Snake Game',
      desc: 'Control the snake to eat food and grow. A canvas-based arcade mini-game built to run entirely inside the operating system.',
      category: 'games',
      tags: ['HTML5 Canvas', 'React', 'Zustand', 'Game Loop'],
      github: 'https://github.com/kkskumarsahu31/khushal-os',
      demo: 'snake',
      icon: Gamepad
    },
    {
      id: 'memory-flip',
      title: 'Skill Memory Cards',
      desc: 'A memory match card flip game. Test matching skills by turning identical technology blocks. Features score memory and custom timers.',
      category: 'games',
      tags: ['React', 'Tailwind CSS', 'CSS Transitions'],
      github: 'https://github.com/kkskumarsahu31/khushal-os',
      demo: 'memory',
      icon: Gamepad
    },
    {
      id: 'space-shooter',
      title: 'Stellar Space Combat',
      desc: 'An arcade-style vertical space shooter. Destroy alien ships and dodge collisions. Integrates leaderboard score states.',
      category: 'games',
      tags: ['HTML5 Canvas', 'Vanilla JS', 'Web Audio API', 'Physics'],
      github: 'https://github.com/kkskumarsahu31/khushal-os',
      demo: 'shooter',
      icon: Gamepad
    }
  ];

  const filteredProjects = projectsList.filter(
    (p) => filter === 'all' || p.category === filter
  );

  const filterButtons = [
    { id: 'all', label: 'All Projects', icon: FolderGit },
    { id: 'fullstack', label: 'AI & Full Stack', icon: Database },
    { id: 'games', label: 'Mini Games', icon: Gamepad },
  ];

  return (
    <div className="flex-1 flex flex-col h-full font-sans select-text">
      
      {/* Header controls & Filters */}
      <div className="p-4 bg-slate-950/40 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none shrink-0">
        <div>
          <h2 className="text-base font-bold font-display text-white">Project Work Portfolio</h2>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Explore source code repositories and online applications.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`py-1.5 px-3 rounded-lg border font-mono text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
                  filter === btn.id
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-neon-blue'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon size={12} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                className="bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Icon + Title block */}
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-slate-900 border border-white/5 rounded-xl text-indigo-400 group-hover:scale-105 transition-all">
                      <Icon size={20} className="group-hover:rotate-6 transition duration-200" />
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-slate-950 border border-white/5 text-slate-400 rounded-full capitalize select-none">
                      {project.category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                      {project.desc}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono bg-slate-950/60 border border-white/5 px-2 py-0.5 rounded text-indigo-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center space-x-2 pt-5 border-t border-white/5 mt-5 font-mono select-none">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-white/5 hover:border-indigo-500/30 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white flex items-center justify-center space-x-1.5 transition"
                  >
                    <Github size={12} />
                    <span>CODE</span>
                  </a>
                  {project.demo && (
                    <button
                      onClick={() => {
                        if (project.id === 'snake' || project.id === 'memory-flip' || project.id === 'space-shooter') {
                          const clickEvent = new CustomEvent('terminal_command', { detail: 'games' });
                          window.dispatchEvent(clickEvent);
                        } else {
                          alert(`Simulating Live Demo for ${project.title}. All active work is running locally in the portfolio OS!`);
                        }
                      }}
                      className="flex-1 py-1.5 px-3 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 hover:border-indigo-500 rounded-xl text-[10px] font-bold text-indigo-400 hover:text-indigo-200 flex items-center justify-center space-x-1.5 transition"
                    >
                      <ExternalLink size={12} />
                      <span>DEMO</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
