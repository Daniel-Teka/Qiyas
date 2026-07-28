import React, { useState, useMemo } from 'react';
import { UNIT_CATEGORIES, UNITS_BY_CATEGORY, convertUnitValue } from '../../data/unitsData';
import { UnitCategory, UnitDefinition } from '../../types/flutterApp';
import { Calculator, CheckSquare, Square, Scale, Ruler, Thermometer, Box, Maximize, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface UnitConverterScreenProps {
  isDarkMode: boolean;
}

export const UnitConverterScreen: React.FC<UnitConverterScreenProps> = ({ isDarkMode }) => {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [inputValue, setInputValue] = useState<string>('100');
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>(['km', 'cm', 'mi', 'ft', 'in']);

  const availableUnits = useMemo(() => {
    return UNITS_BY_CATEGORY[category] || [];
  }, [category]);

  const currentFromUnit = useMemo(() => {
    return availableUnits.find((u) => u.id === fromUnitId) || availableUnits[0];
  }, [availableUnits, fromUnitId]);

  const parsedValue = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || !isFinite(val)) return 0;
    return val;
  }, [inputValue]);

  // When changing category, reset base unit & default targets
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNITS_BY_CATEGORY[newCat];
    if (units && units.length > 0) {
      setFromUnitId(units[0].id);
      setSelectedTargetIds(units.slice(1).map((u) => u.id));
    }
  };

  const toggleTargetUnit = (id: string) => {
    if (id === fromUnitId) return;
    if (selectedTargetIds.includes(id)) {
      if (selectedTargetIds.length > 1) {
        setSelectedTargetIds(selectedTargetIds.filter((item) => item !== id));
      }
    } else {
      setSelectedTargetIds([...selectedTargetIds, id]);
    }
  };

  const categoryIcon = (cat: UnitCategory) => {
    switch (cat) {
      case 'Length': return <Ruler className="w-4 h-4 text-blue-400" />;
      case 'Weight': return <Scale className="w-4 h-4 text-emerald-400" />;
      case 'Temperature': return <Thermometer className="w-4 h-4 text-amber-400" />;
      case 'Area': return <Maximize className="w-4 h-4 text-indigo-400" />;
      case 'Volume': return <Box className="w-4 h-4 text-cyan-400" />;
    }
  };

  const bgCard = isDarkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900';
  const bgSubtle = isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-900 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600';

  return (
    <div className="space-y-6">
      {/* Category Selection (Physical Dimensions) */}
      <div className={`p-4 rounded-2xl border ${bgCard} space-y-3`}>
        <label className="block text-xs font-semibold uppercase tracking-wider text-blue-500">
          1. Physical Dimension Category
        </label>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
          {UNIT_CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                    : isDarkMode
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {categoryIcon(cat)}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Base Value & Starting Unit */}
      <div className={`p-5 rounded-2xl border shadow-sm ${bgCard} space-y-4`}>
        <div className="flex items-center justify-between border-b border-slate-700/30 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>2. Base Value & Starting Unit</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Category: {category}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2 space-y-1">
            <label className={`block text-xs font-semibold ${textMuted}`}>
              Enter Base Value
            </label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 100"
              className={`w-full px-4 py-3 text-lg font-bold rounded-xl border outline-none transition-all ${inputBg}`}
            />
          </div>

          <div className="space-y-1">
            <label className={`block text-xs font-semibold ${textMuted}`}>
              Starting Unit
            </label>
            <select
              value={fromUnitId}
              onChange={(e) => {
                setFromUnitId(e.target.value);
                setSelectedTargetIds(selectedTargetIds.filter((id) => id !== e.target.value));
              }}
              className={`w-full px-3 py-3 text-sm font-semibold rounded-xl border outline-none cursor-pointer transition-all ${inputBg}`}
            >
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Select Target Units Checkboxes / Chips */}
      <div className={`p-5 rounded-2xl border shadow-sm ${bgCard} space-y-3`}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 flex items-center space-x-2">
            <CheckSquare className="w-4 h-4" />
            <span>3. Multi-Select Target Units ({selectedTargetIds.length} active)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
          {availableUnits.map((u) => {
            const isFrom = u.id === fromUnitId;
            const isChecked = selectedTargetIds.includes(u.id);
            return (
              <button
                key={u.id}
                disabled={isFrom}
                onClick={() => toggleTargetUnit(u.id)}
                className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  isFrom
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                    : isChecked
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                    : isDarkMode
                    ? 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="truncate">
                  {u.name} ({u.symbol})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Dynamic Results Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center space-x-2">
          <ArrowRight className="w-4 h-4 text-emerald-400" />
          <span>Real-time Multi-Unit Conversion Results</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedTargetIds.map((toId) => {
            const targetUnit = availableUnits.find((u) => u.id === toId) || availableUnits[0];
            const converted = convertUnitValue(parsedValue, fromUnitId, toId, category);

            return (
              <motion.div
                key={toId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl border ${bgCard} shadow-sm space-y-2 hover:border-blue-500/50 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-blue-400 tracking-wider">
                    {targetUnit.name}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {targetUnit.symbol}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-blue-500">
                    {converted.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{targetUnit.symbol}</span>
                </div>

                <div className={`p-2 rounded-xl text-[11px] font-mono ${bgSubtle} text-slate-400 flex items-center justify-between`}>
                  <span>Formula:</span>
                  <span>
                    {category === 'Temperature'
                      ? 'Non-linear Scale'
                      : `1 ${currentFromUnit.symbol} = ${(
                          currentFromUnit.ratioToBase / targetUnit.ratioToBase
                        ).toFixed(6)} ${targetUnit.symbol}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
