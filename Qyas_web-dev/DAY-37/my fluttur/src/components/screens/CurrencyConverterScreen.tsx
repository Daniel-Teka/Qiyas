import React, { useState, useEffect, useMemo } from 'react';
import { CURRENCIES, FALLBACK_RATES } from '../../data/currenciesData';
import { Currency } from '../../types/flutterApp';
import { RefreshCw, WifiOff, Check, Filter, Search, ArrowRightLeft, AlertCircle, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CurrencyConverterScreenProps {
  isDarkMode: boolean;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

export const CurrencyConverterScreen: React.FC<CurrencyConverterScreenProps> = ({
  isDarkMode,
  isOffline,
  setIsOffline,
}) => {
  const [baseCode, setBaseCode] = useState<string>('USD');
  const [amountInput, setAmountInput] = useState<string>('100');
  const [selectedTargets, setSelectedTargets] = useState<string[]>(['EUR', 'GBP', 'JPY', 'CAD']);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Cached Rates');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Fetch exchange rates from live API with timeout & fallback
  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) throw new Error('API Response not ok');
      const data = await res.json();
      if (data && data.rates) {
        setRates(data.rates);
        setIsOffline(false);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid rate object');
      }
    } catch (err) {
      // Offline fallback
      setRates(FALLBACK_RATES);
      setIsOffline(true);
      setLastUpdated('Offline Fallback');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const parsedAmount = useMemo(() => {
    const val = parseFloat(amountInput);
    if (isNaN(val) || !isFinite(val) || val < 0) return 0;
    return val;
  }, [amountInput]);

  const baseCurrency = useMemo(() => {
    return CURRENCIES.find((c) => c.code === baseCode) || CURRENCIES[0];
  }, [baseCode]);

  // Convert from base currency to target code
  const convertAmount = (targetCode: string): number => {
    const baseUsdRate = rates[baseCode] ?? FALLBACK_RATES[baseCode] ?? 1.0;
    const targetUsdRate = rates[targetCode] ?? FALLBACK_RATES[targetCode] ?? 1.0;
    if (baseUsdRate === 0) return 0;
    return (parsedAmount / baseUsdRate) * targetUsdRate;
  };

  const toggleTarget = (code: string) => {
    if (code === baseCode) return;
    if (selectedTargets.includes(code)) {
      if (selectedTargets.length > 1) {
        setSelectedTargets(selectedTargets.filter((c) => c !== code));
      }
    } else {
      setSelectedTargets([...selectedTargets, code]);
    }
  };

  const filteredCurrencies = useMemo(() => {
    if (!filterSearch.trim()) return CURRENCIES;
    const q = filterSearch.toLowerCase();
    return CURRENCIES.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [filterSearch]);

  const bgCard = isDarkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900';
  const bgSubtle = isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-900 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600';

  return (
    <div className="space-y-6">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Using cached offline rates. Network connection fallback active.</span>
          </div>
          <button
            onClick={fetchRates}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold transition-all"
          >
            Retry Fetch
          </button>
        </div>
      )}

      {/* Input Section: Amount & Base Currency */}
      <div className={`p-5 rounded-2xl border shadow-sm ${bgCard} space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>1. Base Currency & Amount</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Last updated: {lastUpdated}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          {/* Numeric Amount Input */}
          <div className="sm:col-span-2 space-y-1">
            <label className={`block text-xs font-semibold ${textMuted}`}>
              Amount to Convert
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-lg font-bold text-blue-500">
                {baseCurrency.symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-3 text-lg font-bold rounded-xl border outline-none transition-all ${inputBg}`}
              />
            </div>
            {parsedAmount === 0 && amountInput !== '0' && amountInput !== '' && (
              <p className="text-xs text-rose-400 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" />
                <span>Please enter a valid positive number</span>
              </p>
            )}
          </div>

          {/* Base Currency Dropdown Picker */}
          <div className="space-y-1">
            <label className={`block text-xs font-semibold ${textMuted}`}>
              Base Currency
            </label>
            <select
              value={baseCode}
              onChange={(e) => {
                setBaseCode(e.target.value);
                // Remove from targets if present
                setSelectedTargets(selectedTargets.filter((c) => c !== e.target.value));
              }}
              className={`w-full px-3 py-3 text-sm font-semibold rounded-xl border outline-none cursor-pointer transition-all ${inputBg}`}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Selection: Multi-Select FilterChips / Modal */}
      <div className={`p-5 rounded-2xl border shadow-sm ${bgCard} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>2. Pick Target Currencies (Multi-Select FilterChips)</span>
          </h2>
          <span className="text-xs text-blue-400 font-mono">
            {selectedTargets.length} selected
          </span>
        </div>

        {/* Quick Filter Search inside chips */}
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 w-3.5 h-3.5 ${textMuted}`} />
          <input
            type="text"
            placeholder="Search currency to add or toggle..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none ${inputBg}`}
          />
        </div>

        {/* FilterChips Container */}
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1 pt-1 custom-scrollbar">
          {filteredCurrencies.map((c) => {
            const isSelected = selectedTargets.includes(c.code);
            const isBase = c.code === baseCode;
            return (
              <button
                key={c.code}
                disabled={isBase}
                onClick={() => toggleTarget(c.code)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isBase
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                    : isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                    : isDarkMode
                    ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Section: Dynamic Real-time Conversion Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Conversion Output ({selectedTargets.length} target currencies)</span>
          </h2>

          <button
            onClick={fetchRates}
            disabled={isLoading}
            className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Fetching...' : 'Refresh Rates'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {selectedTargets.map((targetCode) => {
            const targetCurrency =
              CURRENCIES.find((c) => c.code === targetCode) || {
                code: targetCode,
                name: targetCode,
                symbol: targetCode,
                flag: '💱',
              };

            const convertedValue = convertAmount(targetCode);
            const unitRate = convertAmount(targetCode) / (parsedAmount === 0 ? 1 : parsedAmount);

            return (
              <motion.div
                key={targetCode}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl border ${bgCard} shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/50 transition-all`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center text-2xl shadow-inner">
                    {targetCurrency.flag}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-blue-500 flex items-center space-x-2">
                      <span>
                        {convertedValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-sm font-semibold">{targetCurrency.code}</span>
                    </h3>
                    <p className={`text-xs ${textMuted}`}>
                      {targetCurrency.name} ({targetCurrency.symbol})
                    </p>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border text-right text-xs font-mono ${bgSubtle}`}>
                  <span className={textMuted}>Exchange Rate:</span>
                  <p className="font-bold text-blue-400">
                    1 {baseCode} = {unitRate.toFixed(4)} {targetCode}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
