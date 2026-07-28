import { UnitCategory, UnitDefinition } from '../types/flutterApp';

export const UNIT_CATEGORIES: UnitCategory[] = [
  'Length',
  'Weight',
  'Temperature',
  'Area',
  'Volume',
];

export const UNITS_BY_CATEGORY: Record<UnitCategory, UnitDefinition[]> = {
  Length: [
    { id: 'm', name: 'Meter', symbol: 'm', ratioToBase: 1 },
    { id: 'km', name: 'Kilometer', symbol: 'km', ratioToBase: 1000 },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01 },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001 },
    { id: 'mi', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344 },
    { id: 'yd', name: 'Yard', symbol: 'yd', ratioToBase: 0.9144 },
    { id: 'ft', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048 },
    { id: 'in', name: 'Inch', symbol: 'in', ratioToBase: 0.0254 },
  ],
  Weight: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', ratioToBase: 1 },
    { id: 'g', name: 'Gram', symbol: 'g', ratioToBase: 0.001 },
    { id: 'mg', name: 'Milligram', symbol: 'mg', ratioToBase: 0.000001 },
    { id: 't', name: 'Metric Ton', symbol: 't', ratioToBase: 1000 },
    { id: 'lb', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237 },
    { id: 'oz', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125 },
  ],
  Temperature: [
    { id: 'C', name: 'Celsius', symbol: '°C', ratioToBase: 1 },
    { id: 'F', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1 },
    { id: 'K', name: 'Kelvin', symbol: 'K', ratioToBase: 1 },
  ],
  Area: [
    { id: 'm2', name: 'Square Meter', symbol: 'm²', ratioToBase: 1 },
    { id: 'km2', name: 'Square Kilometer', symbol: 'km²', ratioToBase: 1000000 },
    { id: 'ft2', name: 'Square Foot', symbol: 'ft²', ratioToBase: 0.09290304 },
    { id: 'mi2', name: 'Square Mile', symbol: 'mi²', ratioToBase: 2589988.110336 },
    { id: 'ac', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564224 },
    { id: 'ha', name: 'Hectare', symbol: 'ha', ratioToBase: 10000 },
  ],
  Volume: [
    { id: 'L', name: 'Liter', symbol: 'L', ratioToBase: 1 },
    { id: 'mL', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001 },
    { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000 },
    { id: 'gal', name: 'Gallon (US)', symbol: 'gal', ratioToBase: 3.785411784 },
    { id: 'qt', name: 'Quart (US)', symbol: 'qt', ratioToBase: 0.946352946 },
    { id: 'pt', name: 'Pint (US)', symbol: 'pt', ratioToBase: 0.473176473 },
    { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', ratioToBase: 0.0295735295625 },
  ],
};

export function convertUnitValue(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  category: UnitCategory
): number {
  if (isNaN(value) || !isFinite(value)) return 0;

  // Non-linear calculation for Temperature
  if (category === 'Temperature') {
    // First convert fromUnit to Celsius
    let celsius: number;
    if (fromUnitId === 'C') {
      celsius = value;
    } else if (fromUnitId === 'F') {
      celsius = (value - 32) * (5 / 9);
    } else if (fromUnitId === 'K') {
      celsius = value - 273.15;
    } else {
      celsius = value;
    }

    // Then convert Celsius to toUnit
    if (toUnitId === 'C') {
      return celsius;
    } else if (toUnitId === 'F') {
      return celsius * (9 / 5) + 32;
    } else if (toUnitId === 'K') {
      return celsius + 273.15;
    }
    return celsius;
  }

  // Linear calculation for other categories
  const units = UNITS_BY_CATEGORY[category];
  const fromUnit = units.find((u) => u.id === fromUnitId);
  const toUnit = units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit || toUnit.ratioToBase === 0) return 0;

  // Value in Base Unit = value * fromUnit.ratioToBase
  const baseValue = value * fromUnit.ratioToBase;
  // Value in Target Unit = baseValue / toUnit.ratioToBase
  return baseValue / toUnit.ratioToBase;
}
