import React, { useState } from 'react';
import { CountryCityScreen } from './screens/CountryCityScreen';
import { CurrencyConverterScreen } from './screens/CurrencyConverterScreen';
import { UnitConverterScreen } from './screens/UnitConverterScreen';
import { Globe, Currency, Scale, Moon, Sun, Smartphone, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Material3FrameProps {
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  deviceFrame: 'mobile' | 'tablet' | 'fluid';
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

export const Material3Frame: React.FC<Material3FrameProps> = ({
  isDarkMode,
  setIsDarkMode,
  deviceFrame,
  isOffline,
  setIsOffline,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const containerStyle = () => {
    switch (deviceFrame) {
      case 'mobile':
        return 'max-w-md mx-auto rounded-[38px] border-[10px] border-slate-900 shadow-2xl my-4 overflow-hidden';
      case 'tablet':
        return 'max-w-3xl mx-auto rounded-[32px] border-[12px] border-slate-900 shadow-2xl my-4 overflow-hidden';
      case 'fluid':
      default:
        return 'w-full max-w-6xl mx-auto rounded-3xl border border-slate-800 shadow-xl overflow-hidden';
    }
  };

  const frameBg = isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900';
  const appBarBg = isDarkMode ? 'bg-slate-900/95 border-b border-slate-800' : 'bg-white/95 border-b border-slate-200';
  const bottomNavBg = isDarkMode ? 'bg-slate-900/95 border-t border-slate-800' : 'bg-white/95 border-t border-slate-200';

  const tabLabels = [
    { title: 'Country & City Lookup', icon: Globe, label: 'Countries & Cities' },
    { title: 'One-to-Many Currency Converter', icon: Currency, label: 'Currencies' },
    { title: 'One-to-Many Unit Converter', icon: Scale, label: 'Units' },
  ];

  return (
    <div className={`transition-all duration-300 ${containerStyle()} ${frameBg}`}>
      {/* Phone Notch/Statusbar in mobile mode */}
      {deviceFrame === 'mobile' && (
        <div className="bg-slate-900 text-white text-[11px] font-mono px-6 py-1.5 flex items-center justify-between border-b border-slate-800">
          <span>9:41 AM</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3 h-3" />
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Material 3 Top AppBar */}
      <div className={`px-5 py-3.5 ${appBarBg} flex items-center justify-between sticky top-0 z-40 backdrop-blur-md`}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30">
            M3
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">
              {tabLabels[activeTab].title}
            </h2>
            <p className="text-[11px] text-blue-500 font-medium">
              Flutter Material 3 Live App
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl transition-all ${
              isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-indigo-600 hover:bg-slate-200'
            }`}
            title="Toggle M3 Theme Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="p-4 sm:p-6 min-h-[550px] overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 0 && <CountryCityScreen isDarkMode={isDarkMode} />}
            {activeTab === 1 && (
              <CurrencyConverterScreen
                isDarkMode={isDarkMode}
                isOffline={isOffline}
                setIsOffline={setIsOffline}
              />
            )}
            {activeTab === 2 && <UnitConverterScreen isDarkMode={isDarkMode} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Material 3 Bottom NavigationBar */}
      <div className={`px-2 py-2 ${bottomNavBg} sticky bottom-0 z-40 backdrop-blur-md`}>
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {tabLabels.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-center justify-center space-y-1 py-1 px-4 rounded-2xl transition-all relative ${
                  isActive ? 'text-blue-500 font-bold' : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="m3-nav-pill"
                    className="absolute inset-0 bg-blue-500/15 dark:bg-blue-500/25 rounded-2xl -z-10 border border-blue-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110 text-blue-500' : ''} transition-transform`} />
                <span className="text-[11px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
