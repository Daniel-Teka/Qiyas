import React, { useState, useMemo } from 'react';
import { COUNTRIES_DATA } from '../../data/countriesData';
import { Country, City } from '../../types/flutterApp';
import { Search, MapPin, Flag, Building2, Globe2, Coins, Users, CheckCircle2, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CountryCityScreenProps {
  isDarkMode: boolean;
}

export const CountryCityScreen: React.FC<CountryCityScreenProps> = ({ isDarkMode }) => {
  const [mode, setMode] = useState<'countryToCities' | 'cityToCountry'>('countryToCities');
  
  // Country -> Cities state
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('US');
  const [countryFilterText, setCountryFilterText] = useState<string>('');

  // City -> Country state
  const [citySearchText, setCitySearchText] = useState<string>('');

  const selectedCountry = useMemo(() => {
    return COUNTRIES_DATA.find((c) => c.code === selectedCountryCode) || COUNTRIES_DATA[0];
  }, [selectedCountryCode]);

  // Filtered list of countries for searchable selector
  const filteredCountries = useMemo(() => {
    if (!countryFilterText.trim()) return COUNTRIES_DATA;
    const q = countryFilterText.toLowerCase();
    return COUNTRIES_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
    );
  }, [countryFilterText]);

  // All cities flattened across all countries for City -> Country search
  const allCitiesWithCountries = useMemo(() => {
    const list: { city: City; country: Country }[] = [];
    COUNTRIES_DATA.forEach((country) => {
      country.cities.forEach((city) => {
        list.push({ city, country });
      });
    });
    return list;
  }, []);

  const matchedCities = useMemo(() => {
    if (!citySearchText.trim()) return allCitiesWithCountries.slice(0, 15);
    const q = citySearchText.toLowerCase();
    return allCitiesWithCountries.filter(
      (item) =>
        item.city.name.toLowerCase().includes(q) ||
        item.country.name.toLowerCase().includes(q) ||
        item.country.capital.toLowerCase().includes(q)
    );
  }, [citySearchText, allCitiesWithCountries]);

  const bgCard = isDarkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900';
  const bgSubtle = isDarkMode ? 'bg-slate-900/60' : 'bg-slate-50';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDarkMode ? 'bg-slate-900 text-white border-slate-700 focus:border-blue-500' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-blue-600';

  return (
    <div className="space-y-6">
      {/* Segmented Button Mode Toggle (Material 3 SegmentedButton) */}
      <div className={`p-1.5 rounded-2xl border flex items-center shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
        <button
          onClick={() => setMode('countryToCities')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            mode === 'countryToCities'
              ? 'bg-blue-600 text-white shadow-md'
              : `${textMuted} hover:text-blue-500`
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Mode 1: Country ➔ Cities</span>
        </button>

        <button
          onClick={() => setMode('cityToCountry')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            mode === 'cityToCountry'
              ? 'bg-blue-600 text-white shadow-md'
              : `${textMuted} hover:text-blue-500`
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Mode 2: City ➔ Country</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'countryToCities' ? (
          <motion.div
            key="countryToCities"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Searchable Dropdown / Country Picker */}
            <div className={`p-4 rounded-2xl border ${bgCard} space-y-3`}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-blue-500">
                1. Pick or Filter Country ({COUNTRIES_DATA.length} available)
              </label>

              <div className="relative">
                <Search className={`absolute left-3 top-3 w-4 h-4 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="Type country name or code to filter..."
                  value={countryFilterText}
                  onChange={(e) => setCountryFilterText(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* Country Selection Chips Grid */}
              <div className="max-h-36 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredCountries.map((country) => {
                    const isSelected = country.code === selectedCountryCode;
                    return (
                      <button
                        key={country.code}
                        onClick={() => setSelectedCountryCode(country.code)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                            : isDarkMode
                            ? 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-700/50 text-slate-200'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <span className="truncate">{country.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Country Details Card */}
            {selectedCountry && (
              <div className={`p-5 rounded-2xl border shadow-sm ${bgCard} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/30">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl sm:text-5xl">{selectedCountry.flag}</span>
                    <div>
                      <h2 className="text-xl font-bold flex items-center space-x-2">
                        <span>{selectedCountry.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {selectedCountry.code}
                        </span>
                      </h2>
                      <p className={`text-xs ${textMuted}`}>
                        Continent: <strong className="text-blue-400">{selectedCountry.continent}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${bgSubtle}`}>
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Capital: <strong>{selectedCountry.capital}</strong></span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${bgSubtle}`}>
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>Currency: <strong>{selectedCountry.currency}</strong></span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${bgSubtle}`}>
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pop: <strong>{selectedCountry.population}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Cities ListView */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Major Cities in {selectedCountry.name} ({selectedCountry.cities.length})</span>
                    </h3>
                    <span className="text-xs text-blue-400">ListView Output</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedCountry.cities.map((city, idx) => (
                      <div
                        key={city.name}
                        className={`p-3.5 rounded-xl border flex items-start justify-between transition-all hover:scale-[1.01] ${
                          city.isCapital
                            ? isDarkMode
                              ? 'bg-blue-950/40 border-blue-800/80 shadow-md ring-1 ring-blue-500/30'
                              : 'bg-blue-50/80 border-blue-300 shadow-sm'
                            : bgSubtle
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-slate-400">#{idx + 1}</span>
                            <h4 className="text-sm font-bold">{city.name}</h4>
                          </div>
                          <p className={`text-xs ${textMuted}`}>
                            Population: {city.population}
                          </p>
                        </div>

                        {city.isCapital ? (
                          <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Capital</span>
                          </span>
                        ) : (
                          <span className={`text-xs font-mono ${textMuted}`}>City</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="cityToCountry"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* City Search Bar */}
            <div className={`p-4 rounded-2xl border ${bgCard} space-y-3`}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-blue-500">
                Search or Type City Name
              </label>

              <div className="relative">
                <Search className={`absolute left-3.5 top-3.5 w-4 h-4 ${textMuted}`} />
                <input
                  type="text"
                  placeholder="e.g. Tokyo, Munich, Chicago, Kyoto, Sydney, Rio de Janeiro..."
                  value={citySearchText}
                  onChange={(e) => setCitySearchText(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <span className={textMuted}>Suggestions:</span>
                {['Tokyo', 'Berlin', 'London', 'Sydney', 'Chicago', 'Rio de Janeiro', 'Mumbai', 'Cairo'].map((name) => (
                  <button
                    key={name}
                    onClick={() => setCitySearchText(name)}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all whitespace-nowrap"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid / List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center space-x-2">
                  <Globe2 className="w-4 h-4 text-indigo-400" />
                  <span>Matching City-Country Pairings ({matchedCities.length})</span>
                </h3>
              </div>

              {matchedCities.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center ${bgCard}`}>
                  <p className="text-slate-400 text-sm">No cities found matching "{citySearchText}". Try searching another city!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchedCities.map(({ city, country }) => (
                    <div
                      key={`${country.code}-${city.name}`}
                      className={`p-4 rounded-2xl border ${bgCard} hover:border-blue-500/50 transition-all space-y-3 shadow-sm`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{country.flag}</span>
                          <div>
                            <h4 className="text-base font-bold flex items-center space-x-2">
                              <span>{city.name}</span>
                              {city.isCapital && (
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                                  Capital City
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-blue-400 font-medium">
                              Belongs to {country.name} ({country.code})
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`p-2.5 rounded-xl border grid grid-cols-2 gap-2 text-xs ${bgSubtle}`}>
                        <div>
                          <span className={textMuted}>Continent:</span>
                          <p className="font-semibold">{country.continent}</p>
                        </div>
                        <div>
                          <span className={textMuted}>Capital:</span>
                          <p className="font-semibold">{country.capital}</p>
                        </div>
                        <div>
                          <span className={textMuted}>Currency:</span>
                          <p className="font-semibold">{country.currency}</p>
                        </div>
                        <div>
                          <span className={textMuted}>City Population:</span>
                          <p className="font-semibold">{city.population}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
