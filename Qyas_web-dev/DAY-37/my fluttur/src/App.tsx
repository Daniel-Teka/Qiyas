import React, { useState } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { Material3Frame } from './components/Material3Frame';
import { CodeExplorer } from './components/CodeExplorer';
import { ArchitectureGuide } from './components/ArchitectureGuide';

export default function App() {
  const [viewMode, setViewMode] = useState<'simulator' | 'code' | 'architecture'>('simulator');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'tablet' | 'fluid'>('fluid');
  const [isOffline, setIsOffline] = useState<boolean>(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Header Bar */}
      <HeaderBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isOffline={isOffline}
        onRefreshRates={() => {}}
        deviceFrame={deviceFrame}
        setDeviceFrame={setDeviceFrame}
      />

      {/* Main Container */}
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {viewMode === 'simulator' && (
          <Material3Frame
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            deviceFrame={deviceFrame}
            isOffline={isOffline}
            setIsOffline={setIsOffline}
          />
        )}

        {viewMode === 'code' && <CodeExplorer isDarkMode={isDarkMode} />}

        {viewMode === 'architecture' && <ArchitectureGuide isDarkMode={isDarkMode} />}
      </main>
    </div>
  );
}

