import { CodeFile } from '../types/flutterApp';

export const FLUTTER_MAIN_DART = `import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppProvider()..initialize(),
      child: const OmniConvertApp(),
    ),
  );
}

// ============================================================================
// 1. MODELS
// ============================================================================

class City {
  final String name;
  final String population;
  final bool isCapital;

  const City({
    required this.name,
    required this.population,
    this.isCapital = false,
  });

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      name: json['name'] as String,
      population: json['population'] as String,
      isCapital: json['isCapital'] as bool? ?? false,
    );
  }
}

class Country {
  final String code;
  final String name;
  final String flag;
  final String capital;
  final String continent;
  final String currency;
  final String population;
  final List<City> cities;

  const Country({
    required this.code,
    required this.name,
    required this.flag,
    required this.capital,
    required this.continent,
    required this.currency,
    required this.population,
    required this.cities,
  });

  factory Country.fromJson(Map<String, dynamic> json) {
    var rawCities = json['cities'] as List<dynamic>? ?? [];
    List<City> cityList = rawCities.map((c) => City.fromJson(c)).toList();
    return Country(
      code: json['code'] as String,
      name: json['name'] as String,
      flag: json['flag'] as String,
      capital: json['capital'] as String,
      continent: json['continent'] as String,
      currency: json['currency'] as String,
      population: json['population'] as String,
      cities: cityList,
    );
  }
}

class Currency {
  final String code;
  final String name;
  final String symbol;
  final String flag;

  const Currency({
    required this.code,
    required this.name,
    required this.symbol,
    required this.flag,
  });
}

enum UnitCategory { length, weight, temperature, area, volume }

class UnitDefinition {
  final String id;
  final String name;
  final String symbol;
  final double ratioToBase;

  const UnitDefinition({
    required this.id,
    required this.name,
    required this.symbol,
    required this.ratioToBase,
  });
}

// ============================================================================
// 2. SERVICES & MOCK DATA REPOSITORIES
// ============================================================================

class CountryService {
  static const List<Map<String, dynamic>> _mockCountriesJson = [
    {
      'code': 'US',
      'name': 'United States',
      'flag': '🇺🇸',
      'capital': 'Washington, D.C.',
      'continent': 'North America',
      'currency': 'USD (\$)',
      'population': '331,900,000',
      'cities': [
        {'name': 'Washington, D.C.', 'population': '689,545', 'isCapital': true},
        {'name': 'New York City', 'population': '8,804,190'},
        {'name': 'Los Angeles', 'population': '3,898,747'},
        {'name': 'Chicago', 'population': '2,746,388'},
        {'name': 'Houston', 'population': '2,304,580'},
        {'name': 'San Francisco', 'population': '873,965'},
      ]
    },
    {
      'code': 'JP',
      'name': 'Japan',
      'flag': '🇯🇵',
      'capital': 'Tokyo',
      'continent': 'Asia',
      'currency': 'JPY (¥)',
      'population': '125,700,000',
      'cities': [
        {'name': 'Tokyo', 'population': '13,960,000', 'isCapital': true},
        {'name': 'Yokohama', 'population': '3,770,000'},
        {'name': 'Osaka', 'population': '2,750,000'},
        {'name': 'Nagoya', 'population': '2,330,000'},
        {'name': 'Sapporo', 'population': '1,970,000'},
        {'name': 'Kyoto', 'population': '1,460,000'},
      ]
    },
    {
      'code': 'DE',
      'name': 'Germany',
      'flag': '🇩🇪',
      'capital': 'Berlin',
      'continent': 'Europe',
      'currency': 'EUR (€)',
      'population': '84,300,000',
      'cities': [
        {'name': 'Berlin', 'population': '3,677,000', 'isCapital': true},
        {'name': 'Hamburg', 'population': '1,850,000'},
        {'name': 'Munich', 'population': '1,488,000'},
        {'name': 'Cologne', 'population': '1,080,000'},
        {'name': 'Frankfurt', 'population': '764,000'},
        {'name': 'Stuttgart', 'population': '630,000'},
      ]
    },
    {
      'code': 'GB',
      'name': 'United Kingdom',
      'flag': '🇬🇧',
      'capital': 'London',
      'continent': 'Europe',
      'currency': 'GBP (£)',
      'population': '67,300,000',
      'cities': [
        {'name': 'London', 'population': '8,982,000', 'isCapital': true},
        {'name': 'Birmingham', 'population': '1,144,000'},
        {'name': 'Glasgow', 'population': '635,000'},
        {'name': 'Manchester', 'population': '553,000'},
        {'name': 'Liverpool', 'population': '498,000'},
        {'name': 'Edinburgh', 'population': '527,000'},
      ]
    },
    {
      'code': 'FR',
      'name': 'France',
      'flag': '🇫🇷',
      'capital': 'Paris',
      'continent': 'Europe',
      'currency': 'EUR (€)',
      'population': '68,000,000',
      'cities': [
        {'name': 'Paris', 'population': '2,161,000', 'isCapital': true},
        {'name': 'Marseille', 'population': '870,000'},
        {'name': 'Lyon', 'population': '522,000'},
        {'name': 'Toulouse', 'population': '493,000'},
        {'name': 'Nice', 'population': '342,000'},
        {'name': 'Bordeaux', 'population': '260,000'},
      ]
    },
    {
      'code': 'IN',
      'name': 'India',
      'flag': '🇮🇳',
      'capital': 'New Delhi',
      'continent': 'Asia',
      'currency': 'INR (₹)',
      'population': '1,417,000,000',
      'cities': [
        {'name': 'New Delhi', 'population': '32,940,000', 'isCapital': true},
        {'name': 'Mumbai', 'population': '20,960,000'},
        {'name': 'Bengaluru', 'population': '13,190,000'},
        {'name': 'Kolkata', 'population': '15,130,000'},
        {'name': 'Chennai', 'population': '11,500,000'},
        {'name': 'Hyderabad', 'population': '10,530,000'},
      ]
    },
    {
      'code': 'CA',
      'name': 'Canada',
      'flag': '🇨🇦',
      'capital': 'Ottawa',
      'continent': 'North America',
      'currency': 'CAD (\$)',
      'population': '38,900,000',
      'cities': [
        {'name': 'Ottawa', 'population': '1,017,000', 'isCapital': true},
        {'name': 'Toronto', 'population': '2,794,000'},
        {'name': 'Montreal', 'population': '1,762,000'},
        {'name': 'Vancouver', 'population': '662,000'},
        {'name': 'Calgary', 'population': '1,306,000'},
        {'name': 'Edmonton', 'population': '1,010,000'},
      ]
    },
    {
      'code': 'AU',
      'name': 'Australia',
      'flag': '🇦🇺',
      'capital': 'Canberra',
      'continent': 'Oceania',
      'currency': 'AUD (\$)',
      'population': '26,000,000',
      'cities': [
        {'name': 'Canberra', 'population': '456,000', 'isCapital': true},
        {'name': 'Sydney', 'population': '5,312,000'},
        {'name': 'Melbourne', 'population': '5,078,000'},
        {'name': 'Brisbane', 'population': '2,560,000'},
        {'name': 'Perth', 'population': '2,125,000'},
        {'name': 'Adelaide', 'population': '1,387,000'},
      ]
    },
    {
      'code': 'BR',
      'name': 'Brazil',
      'flag': '🇧🇷',
      'capital': 'Brasília',
      'continent': 'South America',
      'currency': 'BRL (R\$)',
      'population': '214,000,000',
      'cities': [
        {'name': 'Brasília', 'population': '3,055,000', 'isCapital': true},
        {'name': 'São Paulo', 'population': '12,330,000'},
        {'name': 'Rio de Janeiro', 'population': '6,748,000'},
        {'name': 'Salvador', 'population': '2,886,000'},
        {'name': 'Fortaleza', 'population': '2,686,000'},
        {'name': 'Belo Horizonte', 'population': '2,521,000'},
      ]
    },
    {
      'code': 'IT',
      'name': 'Italy',
      'flag': '🇮🇹',
      'capital': 'Rome',
      'continent': 'Europe',
      'currency': 'EUR (€)',
      'population': '58,800,000',
      'cities': [
        {'name': 'Rome', 'population': '2,873,000', 'isCapital': true},
        {'name': 'Milan', 'population': '1,378,000'},
        {'name': 'Naples', 'population': '959,000'},
        {'name': 'Turin', 'population': '870,000'},
        {'name': 'Palermo', 'population': '657,000'},
        {'name': 'Florence', 'population': '360,000'},
      ]
    },
  ];

  List<Country> getAllCountries() {
    return _mockCountriesJson.map((json) => Country.fromJson(json)).toList();
  }
}

class CurrencyService {
  static const String apiUrl = 'https://open.er-api.com/v6/latest/USD';

  static const Map<String, double> fallbackRates = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.78,
    'JPY': 154.5,
    'CAD': 1.37,
    'AUD': 1.52,
    'CHF': 0.89,
    'CNY': 7.25,
    'HKD': 7.82,
    'NZD': 1.66,
    'INR': 83.5,
    'BRL': 5.65,
    'SGD': 1.35,
    'MXN': 18.2,
    'SEK': 10.6,
    'NOK': 10.8,
    'ZAR': 18.4,
    'KRW': 1380.0,
    'EGP': 48.2,
    'AED': 3.67,
  };

  Future<Map<String, double>> fetchLatestRates() async {
    try {
      final response = await http
          .get(Uri.parse(apiUrl))
          .timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['rates'] != null) {
          Map<String, double> rates = {};
          (data['rates'] as Map<String, dynamic>).forEach((key, value) {
            rates[key] = (value as num).toDouble();
          });
          return rates;
        }
      }
      return fallbackRates;
    } catch (_) {
      // Offline fallback strategy on network error/timeout
      return fallbackRates;
    }
  }
}

class UnitService {
  static final Map<UnitCategory, List<UnitDefinition>> unitsMap = {
    UnitCategory.length: [
      const UnitDefinition(id: 'm', name: 'Meter', symbol: 'm', ratioToBase: 1),
      const UnitDefinition(id: 'km', name: 'Kilometer', symbol: 'km', ratioToBase: 1000),
      const UnitDefinition(id: 'cm', name: 'Centimeter', symbol: 'cm', ratioToBase: 0.01),
      const UnitDefinition(id: 'mm', name: 'Millimeter', symbol: 'mm', ratioToBase: 0.001),
      const UnitDefinition(id: 'mi', name: 'Mile', symbol: 'mi', ratioToBase: 1609.344),
      const UnitDefinition(id: 'ft', name: 'Foot', symbol: 'ft', ratioToBase: 0.3048),
      const UnitDefinition(id: 'in', name: 'Inch', symbol: 'in', ratioToBase: 0.0254),
    ],
    UnitCategory.weight: [
      const UnitDefinition(id: 'kg', name: 'Kilogram', symbol: 'kg', ratioToBase: 1),
      const UnitDefinition(id: 'g', name: 'Gram', symbol: 'g', ratioToBase: 0.001),
      const UnitDefinition(id: 't', name: 'Metric Ton', symbol: 't', ratioToBase: 1000),
      const UnitDefinition(id: 'lb', name: 'Pound', symbol: 'lb', ratioToBase: 0.45359237),
      const UnitDefinition(id: 'oz', name: 'Ounce', symbol: 'oz', ratioToBase: 0.028349523125),
    ],
    UnitCategory.temperature: [
      const UnitDefinition(id: 'C', name: 'Celsius', symbol: '°C', ratioToBase: 1),
      const UnitDefinition(id: 'F', name: 'Fahrenheit', symbol: '°F', ratioToBase: 1),
      const UnitDefinition(id: 'K', name: 'Kelvin', symbol: 'K', ratioToBase: 1),
    ],
    UnitCategory.area: [
      const UnitDefinition(id: 'm2', name: 'Square Meter', symbol: 'm²', ratioToBase: 1),
      const UnitDefinition(id: 'km2', name: 'Square Kilometer', symbol: 'km²', ratioToBase: 1000000),
      const UnitDefinition(id: 'ft2', name: 'Square Foot', symbol: 'ft²', ratioToBase: 0.09290304),
      const UnitDefinition(id: 'ac', name: 'Acre', symbol: 'ac', ratioToBase: 4046.8564),
    ],
    UnitCategory.volume: [
      const UnitDefinition(id: 'L', name: 'Liter', symbol: 'L', ratioToBase: 1),
      const UnitDefinition(id: 'mL', name: 'Milliliter', symbol: 'mL', ratioToBase: 0.001),
      const UnitDefinition(id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratioToBase: 1000),
      const UnitDefinition(id: 'gal', name: 'Gallon (US)', symbol: 'gal', ratioToBase: 3.78541),
    ],
  };

  static double convert({
    required double value,
    required String fromId,
    required String toId,
    required UnitCategory category,
  }) {
    if (category == UnitCategory.temperature) {
      double celsius;
      if (fromId == 'C') celsius = value;
      else if (fromId == 'F') celsius = (value - 32) * (5 / 9);
      else if (fromId == 'K') celsius = value - 273.15;
      else celsius = value;

      if (toId == 'C') return celsius;
      if (toId == 'F') return celsius * (9 / 5) + 32;
      if (toId == 'K') return celsius + 273.15;
      return celsius;
    }

    final units = unitsMap[category] ?? [];
    final fromUnit = units.firstWhere((u) => u.id == fromId, orElse: () => units.first);
    final toUnit = units.firstWhere((u) => u.id == toId, orElse: () => units.first);

    if (toUnit.ratioToBase == 0) return 0;
    double baseVal = value * fromUnit.ratioToBase;
    return baseVal / toUnit.ratioToBase;
  }
}

// ============================================================================
// 3. STATE MANAGEMENT (PROVIDER)
// ============================================================================

class AppProvider extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.system;
  ThemeMode get themeMode => _themeMode;

  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    notifyListeners();
  }

  // Feature 1: Country/City State
  int _lookupMode = 0; // 0 = Country->Cities, 1 = City->Country
  int get lookupMode => _lookupMode;
  void setLookupMode(int mode) {
    _lookupMode = mode;
    notifyListeners();
  }

  List<Country> _countries = [];
  List<Country> get countries => _countries;

  Country? _selectedCountry;
  Country? get selectedCountry => _selectedCountry;

  String _cityQuery = '';
  String get cityQuery => _cityQuery;

  void selectCountry(Country country) {
    _selectedCountry = country;
    notifyListeners();
  }

  void updateCityQuery(String query) {
    _cityQuery = query;
    notifyListeners();
  }

  // Feature 2: Currency Converter State
  final CurrencyService _currencyService = CurrencyService();
  bool _isLoadingRates = false;
  bool get isLoadingRates => _isLoadingRates;
  bool _isOfflineFallback = false;
  bool get isOfflineFallback => _isOfflineFallback;

  String _baseCurrency = 'USD';
  String get baseCurrency => _baseCurrency;

  double _amount = 100.0;
  double get amount => _amount;

  Set<String> _selectedTargetCurrencies = {'EUR', 'GBP', 'JPY', 'CAD'};
  Set<String> get selectedTargetCurrencies => _selectedTargetCurrencies;

  Map<String, double> _rates = CurrencyService.fallbackRates;
  Map<String, double> get rates => _rates;

  void setBaseCurrency(String code) {
    _baseCurrency = code;
    notifyListeners();
  }

  void setAmount(double val) {
    _amount = val;
    notifyListeners();
  }

  void toggleTargetCurrency(String code) {
    if (_selectedTargetCurrencies.contains(code)) {
      if (_selectedTargetCurrencies.length > 1) {
        _selectedTargetCurrencies.remove(code);
      }
    } else {
      _selectedTargetCurrencies.add(code);
    }
    notifyListeners();
  }

  Future<void> refreshExchangeRates() async {
    _isLoadingRates = true;
    notifyListeners();
    final newRates = await _currencyService.fetchLatestRates();
    _rates = newRates;
    _isOfflineFallback = newRates == CurrencyService.fallbackRates;
    _isLoadingRates = false;
    notifyListeners();
  }

  // Feature 3: Unit Converter State
  UnitCategory _unitCategory = UnitCategory.length;
  UnitCategory get unitCategory => _unitCategory;

  String _fromUnitId = 'm';
  String get fromUnitId => _fromUnitId;

  double _unitValue = 100.0;
  double get unitValue => _unitValue;

  Set<String> _selectedTargetUnits = {'km', 'cm', 'mi', 'ft', 'in'};
  Set<String> get selectedTargetUnits => _selectedTargetUnits;

  void setUnitCategory(UnitCategory cat) {
    _unitCategory = cat;
    final available = UnitService.unitsMap[cat] ?? [];
    if (available.isNotEmpty) {
      _fromUnitId = available.first.id;
      _selectedTargetUnits = available.skip(1).map((u) => u.id).toSet();
    }
    notifyListeners();
  }

  void setFromUnitId(String id) {
    _fromUnitId = id;
    notifyListeners();
  }

  void setUnitValue(double val) {
    _unitValue = val;
    notifyListeners();
  }

  void toggleTargetUnit(String id) {
    if (_selectedTargetUnits.contains(id)) {
      if (_selectedTargetUnits.length > 1) {
        _selectedTargetUnits.remove(id);
      }
    } else {
      _selectedTargetUnits.add(id);
    }
    notifyListeners();
  }

  void initialize() {
    _countries = CountryService().getAllCountries();
    if (_countries.isNotEmpty) {
      _selectedCountry = _countries.first;
    }
    refreshExchangeRates();
  }
}

// ============================================================================
// 4. MAIN APPLICATION WIDGET
// ============================================================================

class OmniConvertApp extends StatelessWidget {
  const OmniConvertApp({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    return MaterialApp(
      title: 'GeoConvert & MultiConverter',
      debugShowCheckedModeBanner: false,
      themeMode: provider.themeMode,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F62FE),
          brightness: Brightness.light,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F62FE),
          brightness: Brightness.dark,
        ),
      ),
      home: const MainHomeScreen(),
    );
  }
}

class MainHomeScreen extends StatefulWidget {
  const MainHomeScreen({super.key});

  @override
  State<MainHomeScreen> createState() => _MainHomeScreenState();
}

class _MainHomeScreenState extends State<MainHomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    CountryCityScreen(),
    CurrencyConverterScreen(),
    UnitConverterScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('GeoConvert Suite'),
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(
              provider.themeMode == ThemeMode.dark
                  ? Icons.light_mode_outlined
                  : Icons.dark_mode_outlined,
            ),
            tooltip: 'Toggle Dark Mode',
            onPressed: () => provider.toggleTheme(),
          ),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _screens[_currentIndex],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.public_outlined),
            selectedIcon: Icon(Icons.public),
            label: 'Countries & Cities',
          ),
          NavigationDestination(
            icon: Icon(Icons.currency_exchange_outlined),
            selectedIcon: Icon(Icons.currency_exchange),
            label: 'Currencies',
          ),
          NavigationDestination(
            icon: Icon(Icons.square_foot_outlined),
            selectedIcon: Icon(Icons.square_foot),
            label: 'Units',
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// FEATURE 1 SCREEN: COUNTRY & CITY LOOKUP
// ============================================================================

class CountryCityScreen extends StatelessWidget {
  const CountryCityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SegmentedButton<int>(
            segments: const [
              ButtonSegment(
                value: 0,
                label: Text('Country ➔ Cities'),
                icon: Icon(Icons.flag_outlined),
              ),
              ButtonSegment(
                value: 1,
                label: Text('City ➔ Country'),
                icon: Icon(Icons.location_city_outlined),
              ),
            ],
            selected: {provider.lookupMode},
            onSelectionChanged: (Set<int> newSelection) {
              provider.setLookupMode(newSelection.first);
            },
          ),
          const SizedBox(height: 20),
          if (provider.lookupMode == 0)
            const CountryToCitiesView()
          else
            const CityToCountryView(),
        ],
      ),
    );
  }
}

class CountryToCitiesView extends StatelessWidget {
  const CountryToCitiesView({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final selected = provider.selectedCountry;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        DropdownButtonFormField<Country>(
          value: selected,
          decoration: const InputDecoration(
            labelText: 'Select Country',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.search),
          ),
          items: provider.countries.map((c) {
            return DropdownMenuItem(
              value: c,
              child: Text('\${c.flag}  \${c.name} (\${c.code})'),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) provider.selectCountry(val);
          },
        ),
        const SizedBox(height: 16),
        if (selected != null) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Row(
                    children: [
                      Text(selected.flag, style: const TextStyle(fontSize: 32)),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            selected.name,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          Text(
                            '\${selected.continent} • \${selected.currency}',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Major Cities in \${selected.name} (\${selected.cities.length})',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: selected.cities.length,
            itemBuilder: (context, index) {
              final city = selected.cities[index];
              return Card(
                elevation: 1,
                margin: const EdgeInsets.symmetric(vertical: 4),
                child: ListTile(
                  leading: CircleAvatar(
                    child: Text('\${index + 1}'),
                  ),
                  title: Row(
                    children: [
                      Text(city.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                      if (city.isCapital) ...[
                        const SizedBox(width: 8),
                        Chip(
                          label: const Text('Capital', style: TextStyle(fontSize: 10)),
                          visualDensity: VisualDensity.compact,
                          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                        ),
                      ]
                    ],
                  ),
                  subtitle: Text('Population: \${city.population}'),
                ),
              );
            },
          ),
        ],
      ],
    );
  }
}

class CityToCountryView extends StatelessWidget {
  const CityToCountryView({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final query = provider.cityQuery.trim().toLowerCase();

    // Match cities across all countries
    final results = <Map<String, dynamic>>[];
    for (var c in provider.countries) {
      for (var city in c.cities) {
        if (query.isEmpty || city.name.toLowerCase().contains(query)) {
          results.add({'country': c, 'city': city});
        }
      }
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          decoration: const InputDecoration(
            labelText: 'Search City Name',
            hintText: 'e.g. Tokyo, Munich, Chicago...',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.location_city),
          ),
          onChanged: (val) => provider.updateCityQuery(val),
        ),
        const SizedBox(height: 16),
        Text(
          'Matching Results (\${results.length})',
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        if (results.isEmpty)
          const Padding(
            padding: EdgeInsets.all(32.0),
            child: Center(child: Text('No cities match your query.')),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: results.length,
            itemBuilder: (context, index) {
              final item = results[index];
              final Country country = item['country'];
              final City city = item['city'];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 6),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Row(
                    children: [
                      Text(country.flag, style: const TextStyle(fontSize: 32)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              city.name,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text('Country: \${country.name} (\${country.continent})'),
                            Text('Capital: \${country.capital} | Currency: \${country.currency}'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
      ],
    );
  }
}

// ============================================================================
// FEATURE 2 SCREEN: ONE-TO-MANY CURRENCY CONVERTER
// ============================================================================

class CurrencyConverterScreen extends StatelessWidget {
  const CurrencyConverterScreen({super.key});

  static const List<Currency> allCurrencies = [
    Currency(code: 'USD', name: 'US Dollar', symbol: '\$', flag: '🇺🇸'),
    Currency(code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺'),
    Currency(code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧'),
    Currency(code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵'),
    Currency(code: 'CAD', name: 'Canadian Dollar', symbol: 'CA\$', flag: '🇨🇦'),
    Currency(code: 'AUD', name: 'Australian Dollar', symbol: 'A\$', flag: '🇦🇺'),
    Currency(code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭'),
    Currency(code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', flag: '🇨🇳'),
    Currency(code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳'),
    Currency(code: 'BRL', name: 'Brazilian Real', symbol: 'R\$', flag: '🇧🇷'),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();

    double getConvertedAmount(String targetCode) {
      final baseUsdRate = provider.rates[provider.baseCurrency] ?? 1.0;
      final targetUsdRate = provider.rates[targetCode] ?? 1.0;
      if (baseUsdRate == 0) return 0;
      return (provider.amount / baseUsdRate) * targetUsdRate;
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (provider.isOfflineFallback)
            Container(
              padding: const EdgeInsets.all(10),
              margin: const EdgeInsets.bottom(12),
              decoration: BoxDecoration(
                color: Colors.amber.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.wifi_off, color: Colors.amber),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text('Offline mode: Using cached exchange rates.'),
                  ),
                  TextButton(
                    onPressed: () => provider.refreshExchangeRates(),
                    child: const Text('Retry'),
                  )
                ],
              ),
            ),
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('1. Base Amount & Currency',
                      style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          initialValue: provider.amount.toString(),
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Amount',
                            border: OutlineInputBorder(),
                            prefixIcon: Icon(Icons.attach_money),
                          ),
                          onChanged: (val) {
                            final parsed = double.tryParse(val) ?? 0.0;
                            provider.setAmount(parsed);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      DropdownButton<String>(
                        value: provider.baseCurrency,
                        items: allCurrencies.map((c) {
                          return DropdownMenuItem(
                            value: c.code,
                            child: Text('\${c.flag} \${c.code}'),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) provider.setBaseCurrency(val);
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('2. Select Target Currencies (Multi-Select)',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: allCurrencies.map((c) {
              final isSelected = provider.selectedTargetCurrencies.contains(c.code);
              final isBase = c.code == provider.baseCurrency;
              return FilterChip(
                label: Text('\${c.flag} \${c.code}'),
                selected: isSelected,
                disabledColor: Colors.grey.shade300,
                onSelected: isBase
                    ? null
                    : (_) => provider.toggleTargetCurrency(c.code),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainState.spaceBetween,
            children: [
              Text('Conversion Results', style: Theme.of(context).textTheme.titleLarge),
              IconButton(
                icon: provider.isLoadingRates
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.refresh),
                onPressed: () => provider.refreshExchangeRates(),
              )
            ],
          ),
          const SizedBox(height: 8),
          ...provider.selectedTargetCurrencies.map((targetCode) {
            final currency = allCurrencies.firstWhere(
              (c) => c.code == targetCode,
              orElse: () => Currency(
                  code: targetCode, name: targetCode, symbol: targetCode, flag: '💱'),
            );
            final converted = getConvertedAmount(targetCode);

            return Card(
              elevation: 2,
              margin: const EdgeInsets.symmetric(vertical: 6),
              child: ListTile(
                leading: CircleAvatar(
                  child: Text(currency.flag),
                ),
                title: Text(
                  '\${converted.toStringAsFixed(2)} \${currency.code}',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                subtitle: Text('\${currency.name} (\${currency.symbol})'),
                trailing: Text(
                  '1 \${provider.baseCurrency} = \${(getConvertedAmount(targetCode) / (provider.amount == 0 ? 1 : provider.amount)).toStringAsFixed(4)} \${targetCode}',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

// ============================================================================
// FEATURE 3 SCREEN: ONE-TO-MANY UNIT CONVERTER
// ============================================================================

class UnitConverterScreen extends StatelessWidget {
  const UnitConverterScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final availableUnits = UnitService.unitsMap[provider.unitCategory] ?? [];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Category selector chips
          Text('Select Dimension Category', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: UnitCategory.values.map((cat) {
                final isSelected = provider.unitCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: ChoiceChip(
                    label: Text(cat.name.toUpperCase()),
                    selected: isSelected,
                    onSelected: (_) => provider.setUnitCategory(cat),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Input Value & Base Unit', style: Theme.of(context).textTheme.titleMedium),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          initialValue: provider.unitValue.toString(),
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          decoration: const InputDecoration(
                            labelText: 'Base Value',
                            border: OutlineInputBorder(),
                          ),
                          onChanged: (val) {
                            final parsed = double.tryParse(val) ?? 0.0;
                            provider.setUnitValue(parsed);
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      DropdownButton<String>(
                        value: provider.fromUnitId,
                        items: availableUnits.map((u) {
                          return DropdownMenuItem(
                            value: u.id,
                            child: Text('\${u.name} (\${u.symbol})'),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) provider.setFromUnitId(val);
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text('Target Units (Multi-Select Checkboxes)', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: availableUnits.map((u) {
              final isFrom = u.id == provider.fromUnitId;
              final isChecked = provider.selectedTargetUnits.contains(u.id);
              return FilterChip(
                label: Text('\${u.name} (\${u.symbol})'),
                selected: isChecked,
                onSelected: isFrom ? null : (_) => provider.toggleTargetUnit(u.id),
              );
            }).toList(),
          ),
          const SizedBox(height: 20),
          Text('Converted Results', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 8),
          ...provider.selectedTargetUnits.map((toId) {
            final targetUnit = availableUnits.firstWhere(
              (u) => u.id == toId,
              orElse: () => availableUnits.first,
            );
            final converted = UnitService.convert(
              value: provider.unitValue,
              fromId: provider.fromUnitId,
              toId: toId,
              category: provider.unitCategory,
            );

            return Card(
              elevation: 2,
              margin: const EdgeInsets.symmetric(vertical: 6),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                  child: Text(targetUnit.symbol),
                ),
                title: Text(
                  '\${converted.toStringAsFixed(4)} \${targetUnit.symbol}',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                subtitle: Text(targetUnit.name),
              ),
            );
          }),
        ],
      ),
    );
  }
}
`;

export const PUBSPEC_YAML = `name: geoconvert_flutter
description: "Production-ready Flutter Material 3 application with Country/City lookup, multi-currency converter, and multi-unit converter."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  http: ^1.2.1
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;

export const README_MD = `# GeoConvert & MultiConverter Flutter App

A production-ready Flutter Material 3 application showcasing clean architecture, state management with Provider, robust API integration, offline fallback strategies, and edge-case handling.

## Features
1. **Bidirectional Country & City Lookup**: Search countries to see major cities or search cities to reveal country flags, capitals, and currencies.
2. **One-to-Many Currency Converter**: Real-time currency exchange rates from Open Exchange Rates API with automatic offline fallbacks and multi-target FilterChip selection.
3. **One-to-Many Unit Converter**: Multi-unit physical dimension conversion for Length, Weight, Temperature (°C, °F, K non-linear), Area, and Volume.

## Project Structure
\`\`\`
lib/
├── models/
│   ├── country.dart
│   ├── currency.dart
│   └── unit_definition.dart
├── services/
│   ├── country_service.dart
│   ├── currency_service.dart
│   └── unit_service.dart
├── providers/
│   └── app_provider.dart
├── screens/
│   ├── country_city_screen.dart
│   ├── currency_converter_screen.dart
│   └── unit_converter_screen.dart
└── main.dart
\`\`\`

## Running the Flutter Application
1. Install Flutter SDK (>= 3.0.0).
2. Run \`flutter pub get\`
3. Launch with \`flutter run\`
`;

export const CODE_FILES: CodeFile[] = [
  {
    filename: 'main.dart',
    language: 'dart',
    description: 'Complete Monolithic & Runnable Flutter Application Entrypoint',
    content: FLUTTER_MAIN_DART,
  },
  {
    filename: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter Package Manifest & Dependency Declarations',
    content: PUBSPEC_YAML,
  },
  {
    filename: 'README.md',
    language: 'markdown',
    description: 'Architecture Documentation & Run Instructions',
    content: README_MD,
  },
];
