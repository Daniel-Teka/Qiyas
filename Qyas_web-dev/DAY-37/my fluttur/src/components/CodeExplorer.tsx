import React, { useState } from 'react';
import { CODE_FILES } from '../data/flutterSourceCode';
import { FileCode, Copy, Check, Download, Search, Terminal, BookOpen, Layers, ShieldCheck } from 'lucide-react';

interface CodeExplorerProps {
  isDarkMode: boolean;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ isDarkMode }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const currentFile = CODE_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const codeLines = currentFile.content.split('\n');

  // Filtered code lines if search active
  const matchesCount = searchTerm.trim()
    ? codeLines.filter((l) => l.toLowerCase().includes(searchTerm.toLowerCase())).length
    : 0;

  const bgCard = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top Banner with Architecture Quality Badges */}
      <div className={`p-4 rounded-2xl border ${bgCard} flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md`}>
        <div>
          <h2 className="text-base font-bold flex items-center space-x-2 text-blue-400">
            <Terminal className="w-5 h-5" />
            <span>Flutter 3 Production Source Code & Manifests</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            100% complete, runnable Dart code adhering to Provider, Material 3, and Clean Architecture.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Null Safety</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Provider v6.1.2
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Material 3
          </span>
        </div>
      </div>

      {/* Main Code Editor Layout */}
      <div className={`rounded-2xl border overflow-hidden shadow-2xl ${bgCard} grid grid-cols-1 md:grid-cols-4`}>
        {/* Sidebar File Tree */}
        <div className="md:col-span-1 border-r border-slate-800/80 bg-slate-950/60 p-3 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Project Files</span>
          </div>

          <div className="space-y-1">
            {CODE_FILES.map((file, idx) => {
              const isSelected = selectedFileIdx === idx;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center space-x-2 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4 shrink-0 text-blue-300" />
                  <div className="truncate">
                    <div className="font-bold">{file.filename}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {file.language.toUpperCase()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Description Box */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <strong className="text-slate-200 block">{currentFile.filename}</strong>
            <p>{currentFile.description}</p>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="md:col-span-3 flex flex-col bg-slate-950 text-slate-100 font-mono text-xs">
          {/* Editor Header Bar */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Search inside code */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search code syntax (e.g. AppProvider, http, UnitService)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 text-slate-200 border border-slate-800 rounded-lg outline-none text-xs focus:border-blue-500"
              />
              {searchTerm && (
                <span className="absolute right-3 top-2 text-[10px] text-blue-400">
                  {matchesCount} matches
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold transition-all shadow-sm"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-semibold border border-slate-700 transition-all"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar font-mono text-[12px] leading-relaxed">
            <table className="w-full border-collapse">
              <tbody>
                {codeLines.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isMatch =
                    searchTerm.trim() && line.toLowerCase().includes(searchTerm.toLowerCase());

                  return (
                    <tr
                      key={idx}
                      className={isMatch ? 'bg-blue-900/40 text-blue-200 font-bold' : 'hover:bg-slate-900/50'}
                    >
                      <td className="w-10 select-none text-slate-600 text-right pr-4 align-top">
                        {lineNum}
                      </td>
                      <td className="whitespace-pre align-top text-slate-200">
                        {line}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
