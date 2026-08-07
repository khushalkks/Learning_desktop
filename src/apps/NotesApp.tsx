import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { FileText, Plus, Save, Trash2, Download, Edit } from 'lucide-react';

export const NotesApp: React.FC = () => {
  const { notes, saveNote, deleteNote, addNotification } = useOSStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Auto-select first note if available and none selected
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      const firstNote = notes[0];
      setSelectedNoteId(firstNote.id);
      setTitle(firstNote.title);
      setContent(firstNote.content);
    }
  }, [notes, selectedNoteId]);

  // Handle sidebar note click selection
  const handleSelectNote = (id: string) => {
    const target = notes.find((n) => n.id === id);
    if (target) {
      setSelectedNoteId(id);
      setTitle(target.title);
      setContent(target.content);
    }
  };

  // Create new blank note
  const handleCreateNote = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    saveNote(newId, 'Untitled Note', '');
    setSelectedNoteId(newId);
    setTitle('Untitled Note');
    setContent('');
    addNotification('Note Created', 'Start writing your notes!', 'info');
  };

  // Save current note edits
  const handleSave = () => {
    if (!selectedNoteId) return;
    saveNote(selectedNoteId, title || 'Untitled Note', content);
    addNotification('Note Saved', 'Your edits were saved successfully to local storage.', 'success');
  };

  // Delete note
  const handleDelete = () => {
    if (!selectedNoteId) return;
    deleteNote(selectedNoteId);
    setSelectedNoteId(null);
    setTitle('');
    setContent('');
    addNotification('Note Deleted', 'The note has been removed.', 'info');
  };

  // Export note to local machine
  const handleExport = () => {
    if (!selectedNoteId) return;
    const element = document.createElement("a");
    const file = new Blob([`# ${title}\n\n${content}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('Note Exported', 'Downloaded markdown note to your machine.', 'success');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full font-sans select-text">
      {/* Sidebar notes listing */}
      <div className="w-full md:w-56 bg-slate-950/40 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col shrink-0 p-3 select-none justify-between">
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-xs font-bold font-mono text-indigo-400">Notes Index</span>
            <button
              onClick={handleCreateNote}
              className="p-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow"
              title="Create New Note"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Notes list */}
          <div className="space-y-1.5 max-h-[160px] md:max-h-[320px] overflow-y-auto w-full">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
                className={`w-full p-2.5 rounded-lg border font-mono text-[10px] text-left flex items-start space-x-2 transition ${
                  selectedNoteId === note.id
                    ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <FileText size={14} className="shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold truncate">{note.title || 'Untitled Note'}</div>
                  <div className="text-[8px] text-slate-500 truncate mt-0.5">{note.lastUpdated}</div>
                </div>
              </button>
            ))}

            {notes.length === 0 && (
              <div className="text-center py-6 text-slate-500 font-mono text-[10px]">
                No notes saved. Click + to create.
              </div>
            )}
          </div>
        </div>

        {/* Action Button cluster */}
        {selectedNoteId && (
          <div className="hidden md:grid grid-cols-2 gap-2 mt-4 select-none">
            <button
              onClick={handleSave}
              className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center space-x-1 text-[10px] font-bold transition-all shadow"
            >
              <Save size={10} />
              <span>Save</span>
            </button>
            <button
              onClick={handleExport}
              className="py-1.5 px-2 bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center space-x-1 text-[10px] font-bold transition-all"
            >
              <Download size={10} />
              <span>Export</span>
            </button>
            <button
              onClick={handleDelete}
              className="col-span-2 py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center space-x-1 text-[10px] font-bold transition-all"
            >
              <Trash2 size={10} />
              <span>Delete Note</span>
            </button>
          </div>
        )}
      </div>

      {/* Note Editor area */}
      <div className="flex-1 p-5 flex flex-col justify-between h-full bg-slate-950/20">
        {selectedNoteId ? (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Title field */}
            <div className="flex items-center space-x-3 border-b border-white/5 pb-2">
              <Edit size={14} className="text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent border-none text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:ring-0 p-0"
              />
            </div>

            {/* Content field */}
            <textarea
              placeholder="Start writing note content (markdown supported)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-slate-300 leading-relaxed placeholder:text-slate-700 resize-none focus:ring-0 p-0"
            />

            {/* Mobile Actions tray */}
            <div className="flex md:hidden items-center justify-end space-x-2 pt-2 border-t border-white/5 select-none">
              <button
                onClick={handleDelete}
                className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
              <button
                onClick={handleExport}
                className="p-2 bg-slate-900 border border-white/5 text-slate-300 rounded-xl"
                title="Export"
              >
                <Download size={12} />
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1 transition"
              >
                <Save size={12} />
                <span>Save</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 select-none">
            <FileText size={40} className="text-slate-700 animate-pulse" />
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-400">No Note Selected</h3>
              <p className="text-xs text-slate-600 font-mono">Select a note from the index, or click + to create one.</p>
            </div>
            <button 
              onClick={handleCreateNote}
              className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold text-xs transition"
            >
              Create New Note
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
