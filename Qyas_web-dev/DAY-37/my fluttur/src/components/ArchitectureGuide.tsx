import React from 'react';
import { Layers, ShieldCheck, Cpu, RefreshCw, Smartphone, GitBranch, CheckCircle2, FileText } from 'lucide-react';

interface ArchitectureGuideProps {
  isDarkMode: boolean;
}

export const ArchitectureGuide: React.FC<ArchitectureGuideProps> = ({ isDarkMode }) => {
  const bgCard = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const bgSubtle = isDarkMode ? 'bg-slate-950/60' : 'bg-slate-50';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title Hero Banner */}
      <div className={`p-6 rounded-2xl border ${bgCard} shadow-md space-y-2`}>
        <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase font-bold tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Principal Flutter Architecture & Design System Specification</span>
        </div>
        <h2 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
          GeoConvert & MultiConverter Architecture Guide
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Designed using Clean Architecture layered principles (Data / Service ➔ Domain Model ➔ State Management Provider ➔ Material 3 UI Presentation Widgets).
        </p>
      </div>

      {/* Clean Code Layers Architecture Diagram */}
      <div className={`p-6 rounded-2xl border ${bgCard} space-y-4 shadow-md`}>
        <h3 className="text-sm font-bold flex items-center space-x-2 text-indigo-400 uppercase tracking-wider">
          <GitBranch className="w-4 h-4" />
          <span>Layered Architecture Diagram</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className={`p-4 rounded-xl border border-blue-500/30 ${bgSubtle} space-y-2`}>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
              1. Models Layer
            </span>
            <h4 className="font-bold text-slate-200">Domain Entities</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Immutably typed Dart classes (<code className="text-blue-300">Country</code>, <code className="text-blue-300">City</code>, <code className="text-blue-300">Currency</code>, <code className="text-blue-300">UnitDefinition</code>) with JSON factory constructors.
            </p>
          </div>

          <div className={`p-4 rounded-xl border border-emerald-500/30 ${bgSubtle} space-y-2`}>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
              2. Services Layer
            </span>
            <h4 className="font-bold text-slate-200">Data Sources & APIs</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              HTTP Service with fallback rates dictionary (<code className="text-emerald-300">CurrencyService</code>), static mock repo (<code className="text-emerald-300">CountryService</code>), and linear/non-linear math converters (<code className="text-emerald-300">UnitService</code>).
            </p>
          </div>

          <div className={`p-4 rounded-xl border border-purple-500/30 ${bgSubtle} space-y-2`}>
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
              3. Provider State Layer
            </span>
            <h4 className="font-bold text-slate-200">AppProvider State</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              <code className="text-purple-300">ChangeNotifier</code> decoupling business logic from UI. Listens to state changes, exposes reactive getters, and calls <code className="text-purple-300">notifyListeners()</code> cleanly.
            </p>
          </div>

          <div className={`p-4 rounded-xl border border-amber-500/30 ${bgSubtle} space-y-2`}>
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
              4. M3 Widgets Layer
            </span>
            <h4 className="font-bold text-slate-200">Material 3 UI Views</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Re-renders efficiently via <code className="text-amber-300">context.watch&lt;AppProvider&gt;()</code>. Uses FilterChips, SegmentedButtons, AnimatedSwitcher, and NavigationBar.
            </p>
          </div>
        </div>
      </div>

      {/* Feature & Edge-Case Resilience Matrix */}
      <div className={`p-6 rounded-2xl border ${bgCard} space-y-4 shadow-md`}>
        <h3 className="text-sm font-bold flex items-center space-x-2 text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Edge-Case Handling & Fault Tolerance</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-2.5">Scenario / Risk</th>
                <th className="p-2.5">Architectural Solution</th>
                <th className="p-2.5">User Experience Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-2.5 font-bold text-rose-400">Network Failure / Offline Mode</td>
                <td className="p-2.5">5s HTTP Timeout + Offline Static Fallback Rates Dictionary</td>
                <td className="p-2.5 text-slate-400">Displays offline amber badge with cached rates and a retry button without crashing.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-amber-400">Non-Linear Temp Conversions</td>
                <td className="p-2.5">Custom piecewise formulas for Celsius, Fahrenheit, and Kelvin in <code className="text-blue-300">UnitService</code></td>
                <td className="p-2.5 text-slate-400">Correctly calculates offset temperature formulas (°C = (°F-32)*5/9) rather than multiplying simple linear ratios.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-cyan-400">Empty / Zero Numeric Inputs</td>
                <td className="p-2.5">Safe <code className="text-blue-300">double.tryParse()</code> + Division-by-zero guards</td>
                <td className="p-2.5 text-slate-400">Guarantees no NaN, Infinity, or unhandled format exception crashes when user deletes input text.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-indigo-400">Multi-Select Minimum Bounds</td>
                <td className="p-2.5">Selection check preventing removal if target count equals 1</td>
                <td className="p-2.5 text-slate-400">Ensures output list never becomes completely empty by accident during multi-chip toggling.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dependencies & Pubspec Specifications */}
      <div className={`p-6 rounded-2xl border ${bgCard} space-y-3 shadow-md`}>
        <h3 className="text-sm font-bold flex items-center space-x-2 text-blue-400 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Pubspec.yaml Requirements</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 space-y-1">
          <p>dependencies:</p>
          <p className="pl-4 text-slate-200">flutter: sdk: flutter</p>
          <p className="pl-4 text-emerald-400">provider: ^6.1.2 <span className="text-slate-500"># State Management</span></p>
          <p className="pl-4 text-emerald-400">http: ^1.2.1 <span className="text-slate-500"># Network REST Client</span></p>
          <p className="pl-4 text-emerald-400">cupertino_icons: ^1.0.8</p>
        </div>
      </div>
    </div>
  );
};
