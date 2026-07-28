import React, { useState } from 'react';
import { Smartphone, Code, Moon, Sun, Layers, Wifi, Eye, EyeOff } from 'lucide-react';

interface HeaderBarProps {
  viewMode: 'simulator' | 'code' | 'architecture';
  setViewMode: (mode: 'simulator' | 'code' | 'architecture') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isOffline: boolean;
  onRefreshRates: () => void;
  deviceFrame: 'mobile' | 'tablet' | 'fluid';
  setDeviceFrame: (frame: 'mobile' | 'tablet' | 'fluid') => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  viewMode,
  setViewMode,
  isDarkMode,
  setIsDarkMode,
  isOffline,
  onRefreshRates,
  deviceFrame,
  setDeviceFrame,
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  if (!isHeaderVisible) {
    return (
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={() => setIsHeaderVisible(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 shadow-xl backdrop-blur-md transition-all text-xs font-semibold group cursor-pointer"
          title="Show Header & Controls"
        >
          <Eye className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Show Header</span>
        </button>
      </div>
    );
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 px-4 py-3 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title and Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            🩵
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                GeoConvert & MultiConverter
              </h1>
              <span className="bg-blue-900/60 text-blue-300 text-xs px-2 py-0.5 rounded-full font-mono border border-blue-700/50">
                Flutter M3
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Principal Flutter Architecture • Clean Code • Provider Pattern
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setViewMode('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'simulator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'code'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Dart Source & Pubspec</span>
          </button>

          <button
            onClick={() => setViewMode('architecture')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'architecture'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Architecture Guide</span>
          </button>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center space-x-3">
          {/* Frame selection for simulator */}
          {viewMode === 'simulator' && (
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setDeviceFrame('mobile')}
                className={`px-2 py-1 rounded ${deviceFrame === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Mobile Frame"
              >
                Mobile
              </button>
              <button
                onClick={() => setDeviceFrame('tablet')}
                className={`px-2 py-1 rounded ${deviceFrame === 'tablet' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Tablet Frame"
              >
                Tablet
              </button>
              <button
                onClick={() => setDeviceFrame('fluid')}
                className={`px-2 py-1 rounded ${deviceFrame === 'fluid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Full Fluid"
              >
                Fluid
              </button>
            </div>
          )}

          {/* Network status */}
          <div
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border ${
              isOffline
                ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
            }`}
            title={isOffline ? 'Using offline fallback rates' : 'Connected to live currency API'}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{isOffline ? 'Offline Rates' : 'Live ER API'}</span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Toggle Light/Dark Material 3 Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
          </button>

          {/* Hide Header Toggle Button */}
          <button
            onClick={() => setIsHeaderVisible(false)}
            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
            title="Hide Header Bar"
          >
            <EyeOff className="w-4 h-4 text-slate-400" />
            <span className="hidden xl:inline text-xs font-medium">Hide Header</span>
          </button>
        </div>
      </div>
    </header>
  );
};
