import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider(prefs)),
        ChangeNotifierProvider(create: (_) => FavoritesProvider(prefs)),
        ChangeNotifierProvider(create: (_) => CurrencyProvider()),
        ChangeNotifierProvider(create: (_) => UnitProvider()),
        ChangeNotifierProvider(create: (_) => LocationProvider()),
      ],
      child: const CurrencyConverterApp(),
    ),
  );
}

// ============================================================================
// 1. THEME & APP ROOT
// ============================================================================

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'is_dark_mode';
  final SharedPreferences _prefs;
  late bool _isDarkMode;

  ThemeProvider(this._prefs) {
    _isDarkMode = _prefs.getBool(_themeKey) ?? false;
  }

  bool get isDarkMode => _isDarkMode;

  void toggleTheme() {
    _isDarkMode = !_isDarkMode;
    _prefs.setBool(_themeKey, _isDarkMode);
    notifyListeners();
  }
}

class CurrencyConverterApp extends StatelessWidget {
  const CurrencyConverterApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'Global Utility Suite',
      debugShowCheckedModeBanner: false,
      themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.indigo,
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFAFAFA),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade200),
          ),
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: Colors.indigo,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Colors.grey.shade800),
          ),
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

// ============================================================================
// 2. FAVORITES MANAGEMENT & PERSISTENCE
// ============================================================================

enum FavoriteType { location, currency, unit }

class FavoriteItem {
  final String id;
  final FavoriteType type;
  final String title;
  final String subtitle;
  final Map<String, dynamic> data;

  FavoriteItem({
    required this.id,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.data,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type.index,
        'title': title,
        'subtitle': subtitle,
        'data': data,
      };

  factory FavoriteItem.fromJson(Map<String, dynamic> json) => FavoriteItem(
        id: json['id'],
        type: FavoriteType.values[json['type']],
        title: json['title'],
        subtitle: json['subtitle'],
        data: Map<String, dynamic>.from(json['data']),
      );
}

class FavoritesProvider extends ChangeNotifier {
  static const String _favsKey = 'user_favorites_v1';
  final SharedPreferences _prefs;
  List<FavoriteItem> _items = [];

  FavoritesProvider(this._prefs) {
    _loadFavorites();
  }

  List<FavoriteItem> get items => List.unmodifiable(_items);

  void _loadFavorites() {
    final String? rawJson = _prefs.getString(_favsKey);
    if (rawJson != null) {
      try {
        final List<dynamic> decoded = jsonDecode(rawJson);
        _items = decoded.map((e) => FavoriteItem.fromJson(e)).toList();
      } catch (_) {
        _items = [];
      }
    }
  }

  Future<void> _save() async {
    final raw = jsonEncode(_items.map((e) => e.toJson()).toList());
    await _prefs.setString(_favsKey, raw);
    notifyListeners();
  }

  bool isFavorite(String id) => _items.any((e) => e.id == id);

  void toggleFavorite(FavoriteItem item) {
    if (isFavorite(item.id)) {
      _items.removeWhere((e) => e.id == item.id);
    } else {
      _items.add(item);
    }
    _save();
  }

  void removeFavorite(String id) {
    _items.removeWhere((e) => e.id == id);
    _save();
  }
}

// ============================================================================
// 3. FEATURE 1: COUNTRY & CITY LOOKUP DATA & CONTROLLER
// ============================================================================

class CountryData {
  final String name;
  final String code;
  final String flag;
  final String capital;
  final String continent;
  final List<String> cities;

  const CountryData({
    required this.name,
    required this.code,
    required this.flag,
    required this.capital,
    required this.continent,
    required this.cities,
  });
}

const List<CountryData> kMockCountries = [
  CountryData(name: 'United States', code: 'US', flag: '🇺🇸', capital: 'Washington, D.C.', continent: 'North America', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Miami']),
  CountryData(name: 'United Kingdom', code: 'GB', flag: '🇬🇧', capital: 'London', continent: 'Europe', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow']),
  CountryData(name: 'Japan', code: 'JP', flag: '🇯🇵', capital: 'Tokyo', continent: 'Asia', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo']),
  CountryData(name: 'Germany', code: 'DE', flag: '🇩🇪', capital: 'Berlin', continent: 'Europe', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne']),
  CountryData(name: 'France', code: 'FR', flag: '🇫🇷', capital: 'Paris', continent: 'Europe', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice']),
  CountryData(name: 'Canada', code: 'CA', flag: '🇨🇦', capital: 'Ottawa', continent: 'North America', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa']),
  CountryData(name: 'Australia', code: 'AU', flag: '🇦🇺', capital: 'Canberra', continent: 'Oceania', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']),
  CountryData(name: 'India', code: 'IN', flag: '🇮🇳', capital: 'New Delhi', continent: 'Asia', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']),
  CountryData(name: 'Brazil', code: 'BR', flag: '🇧🇷', capital: 'Brasília', continent: 'South America', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza']),
  CountryData(name: 'China', code: 'CN', flag: '🇨🇳', capital: 'Beijing', continent: 'Asia', cities: ['Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou', 'Chengdu']),
  CountryData(name: 'Italy', code: 'IT', flag: '🇮🇹', capital: 'Rome', continent: 'Europe', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Florence']),
  CountryData(name: 'Spain', code: 'ES', flag: '🇪🇸', capital: 'Madrid', continent: 'Europe', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao']),
  CountryData(name: 'South Korea', code: 'KR', flag: '🇰🇷', capital: 'Seoul', continent: 'Asia', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon']),
  CountryData(name: 'Mexico', code: 'MX', flag: '🇲🇽', capital: 'Mexico City', continent: 'North America', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana']),
  CountryData(name: 'South Africa', code: 'ZA', flag: '🇿🇦', capital: 'Pretoria', continent: 'Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Gqeberha']),
  CountryData(name: 'Egypt', code: 'EG', flag: '🇪🇬', capital: 'Cairo', continent: 'Africa', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said']),
  CountryData(name: 'Argentina', code: 'AR', flag: '🇦🇷', capital: 'Buenos Aires', continent: 'South America', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata']),
  CountryData(name: 'Nigeria', code: 'NG', flag: '🇳🇬', capital: 'Abuja', continent: 'Africa', cities: ['Lagos', 'Kano', 'Ibadan', 'Kaduna', 'Port Harcourt']),
  CountryData(name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', capital: 'Abu Dhabi', continent: 'Asia', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman']),
  CountryData(name: 'Netherlands', code: 'NL', flag: '🇳🇱', capital: 'Amsterdam', continent: 'Europe', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven']),
];

class LocationProvider extends ChangeNotifier {
  bool _isCountryToCityMode = true;
  CountryData _selectedCountry = kMockCountries.first;
  String _cityQuery = '';
  
  bool get isCountryToCityMode => _isCountryToCityMode;
  CountryData get selectedCountry => _selectedCountry;
  String get cityQuery => _cityQuery;

  void toggleMode() {
    _isCountryToCityMode = !_isCountryToCityMode;
    notifyListeners();
  }

  void selectCountry(CountryData country) {
    _selectedCountry = country;
    notifyListeners();
  }

  void updateCityQuery(String query) {
    _cityQuery = query.trim().toLowerCase();
    notifyListeners();
  }

  List<Map<String, dynamic>> searchCities() {
    if (_cityQuery.isEmpty) return [];
    List<Map<String, dynamic>> results = [];
    for (var country in kMockCountries) {
      for (var city in country.cities) {
        if (city.toLowerCase().contains(_cityQuery)) {
          results.add({'city': city, 'country': country});
        }
      }
    }
    return results;
  }
}

// ============================================================================
// 4. FEATURE 2: ONE-TO-MANY CURRENCY CONVERTER CONTROLLER & API
// ============================================================================

class CurrencyProvider extends ChangeNotifier {
  String _baseCurrency = 'USD';
  double _baseAmount = 100.0;
  Set<String> _selectedTargets = {'EUR', 'GBP', 'JPY', 'CAD', 'AUD'};
  Map<String, double> _rates = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 155.2,
    'CAD': 1.36,
    'AUD': 1.51,
    'CHF': 0.90,
    'CNY': 7.23,
    'INR': 83.3,
    'BRL': 5.15,
  };
  bool _isLoading = false;
  String? _error;

  CurrencyProvider() {
    fetchRates();
  }

  String get baseCurrency => _baseCurrency;
  double get baseAmount => _baseAmount;
  Set<String> get selectedTargets => _selectedTargets;
  List<String> get availableCurrencies => _rates.keys.toList()..sort();
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setBaseCurrency(String currency) {
    _baseCurrency = currency;
    notifyListeners();
  }

  void setBaseAmount(double amount) {
    _baseAmount = amount;
    notifyListeners();
  }

  void toggleTarget(String currency) {
    if (_selectedTargets.contains(currency)) {
      if (_selectedTargets.length > 1) {
        _selectedTargets.remove(currency);
      }
    } else {
      _selectedTargets.add(currency);
    }
    notifyListeners();
  }

  void applyPreset(String base, double amount, List<String> targets) {
    _baseCurrency = base;
    _baseAmount = amount;
    _selectedTargets = targets.toSet();
    notifyListeners();
  }

  double calculateConvertedAmount(String targetCurrency) {
    final baseRate = _rates[_baseCurrency] ?? 1.0;
    final targetRate = _rates[targetCurrency] ?? 1.0;
    return (_baseAmount / baseRate) * targetRate;
  }

  Future<void> fetchRates() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http
          .get(Uri.parse('https://open.er-api.com/v6/latest/USD'))
          .timeout(const Duration(seconds: 5));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final Map<String, dynamic> rawRates = data['rates'];
        _rates = rawRates.map((k, v) => MapEntry(k, (v as num).toDouble()));
      } else {
        _error = 'Using offline fallback rates';
      }
    } catch (e) {
      _error = 'Offline Mode - Fallback rates active';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// ============================================================================
// 5. FEATURE 3: ONE-TO-MANY UNIT CONVERTER CONTROLLER & MATH
// ============================================================================

enum UnitCategory { length, weight, temperature, area, volume }

class UnitProvider extends ChangeNotifier {
  UnitCategory _category = UnitCategory.length;
  String _baseUnit = 'Meters';
  double _baseValue = 1.0;
  Set<String> _selectedTargets = {'Feet', 'Inches', 'Centimeters', 'Kilometers'};

  static const Map<UnitCategory, List<String>> _categoryUnits = {
    UnitCategory.length: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    UnitCategory.weight: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons'],
    UnitCategory.temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
    UnitCategory.area: ['Square Meters', 'Square Kilometers', 'Square Feet', 'Acres', 'Hectares'],
    UnitCategory.volume: ['Liters', 'Milliliters', 'Gallons', 'Quarts', 'Pints', 'Cubic Meters'],
  };

  UnitCategory get category => _category;
  String get baseUnit => _baseUnit;
  double get baseValue => _baseValue;
  Set<String> get selectedTargets => _selectedTargets;
  List<String> get availableUnits => _categoryUnits[_category] ?? [];

  void setCategory(UnitCategory cat) {
    _category = cat;
    _baseUnit = _categoryUnits[cat]!.first;
    _selectedTargets = _categoryUnits[cat]!.skip(1).take(4).toSet();
    notifyListeners();
  }

  void setBaseUnit(String unit) {
    _baseUnit = unit;
    _selectedTargets.remove(unit);
    notifyListeners();
  }

  void setBaseValue(double val) {
    _baseValue = val;
    notifyListeners();
  }

  void toggleTarget(String unit) {
    if (unit == _baseUnit) return;
    if (_selectedTargets.contains(unit)) {
      if (_selectedTargets.length > 1) {
        _selectedTargets.remove(unit);
      }
    } else {
      _selectedTargets.add(unit);
    }
    notifyListeners();
  }

  void applyPreset(UnitCategory cat, String base, double val, List<String> targets) {
    _category = cat;
    _baseUnit = base;
    _baseValue = val;
    _selectedTargets = targets.toSet();
    notifyListeners();
  }

  double convert(String targetUnit) {
    if (_category == UnitCategory.temperature) {
      return _convertTemperature(_baseValue, _baseUnit, targetUnit);
    }

    final double baseInSI = _toSIBase(_baseValue, _baseUnit);
    return _fromSIBase(baseInSI, targetUnit);
  }

  double _convertTemperature(double val, String from, String to) {
    if (from == to) return val;
    double celsius;
    if (from == 'Celsius') celsius = val;
    else if (from == 'Fahrenheit') celsius = (val - 32) * 5 / 9;
    else celsius = val - 273.15; // Kelvin

    if (to == 'Celsius') return celsius;
    if (to == 'Fahrenheit') return (celsius * 9 / 5) + 32;
    return celsius + 273.15; // Kelvin
  }

  double _toSIBase(double val, String unit) {
    switch (unit) {
      // Length (Base: Meters)
      case 'Kilometers': return val * 1000;
      case 'Centimeters': return val / 100;
      case 'Millimeters': return val / 1000;
      case 'Miles': return val * 1609.344;
      case 'Yards': return val * 0.9144;
      case 'Feet': return val * 0.3048;
      case 'Inches': return val * 0.0254;
      // Weight (Base: Kilograms)
      case 'Grams': return val / 1000;
      case 'Milligrams': return val / 1000000;
      case 'Pounds': return val * 0.45359237;
      case 'Ounces': return val * 0.028349523125;
      case 'Tons': return val * 1000;
      // Area (Base: Sq Meters)
      case 'Square Kilometers': return val * 1000000;
      case 'Square Feet': return val * 0.09290304;
      case 'Acres': return val * 4046.8564224;
      case 'Hectares': return val * 10000;
      // Volume (Base: Liters)
      case 'Milliliters': return val / 1000;
      case 'Gallons': return val * 3.785411784;
      case 'Quarts': return val * 0.946352946;
      case 'Pints': return val * 0.473176473;
      case 'Cubic Meters': return val * 1000;
      default: return val;
    }
  }

  double _fromSIBase(double siVal, String unit) {
    switch (unit) {
      // Length
      case 'Kilometers': return siVal / 1000;
      case 'Centimeters': return siVal * 100;
      case 'Millimeters': return siVal * 1000;
      case 'Miles': return siVal / 1609.344;
      case 'Yards': return siVal / 0.9144;
      case 'Feet': return siVal / 0.3048;
      case 'Inches': return siVal / 0.0254;
      // Weight
      case 'Grams': return siVal * 1000;
      case 'Milligrams': return siVal * 1000000;
      case 'Pounds': return siVal / 0.45359237;
      case 'Ounces': return siVal / 0.028349523125;
      case 'Tons': return siVal / 1000;
      // Area
      case 'Square Kilometers': return siVal / 1000000;
      case 'Square Feet': return siVal / 0.09290304;
      case 'Acres': return siVal / 4046.8564224;
      case 'Hectares': return siVal / 10000;
      // Volume
      case 'Milliliters': return siVal * 1000;
      case 'Gallons': return siVal / 3.785411784;
      case 'Quarts': return siVal / 0.946352946;
      case 'Pints': return siVal / 0.473176473;
      case 'Cubic Meters': return siVal / 1000;
      default: return siVal;
    }
  }
}

// ============================================================================
// 6. MAIN NAVIGATION UI WITH ADAPTIVE BREAKPOINT
// ============================================================================

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _views = const [
    CurrencyConverterView(),
    UnitConverterView(),
    LocationLookupView(),
    FavoritesView(),
  ];

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          _currentIndex == 0
              ? 'Currency Converter'
              : _currentIndex == 1
                  ? 'Unit Converter'
                  : _currentIndex == 2
                      ? 'Country & City Finder'
                      : 'Saved Presets',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(themeProvider.isDarkMode ? Icons.light_mode : Icons.dark_mode),
            tooltip: 'Toggle Theme',
            onPressed: () => themeProvider.toggleTheme(),
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: _views,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.attach_money),
            selectedIcon: Icon(Icons.attach_money, color: Colors.indigo),
            label: 'Currency',
          ),
          NavigationDestination(
            icon: Icon(Icons.square_foot),
            selectedIcon: Icon(Icons.square_foot, color: Colors.indigo),
            label: 'Units',
          ),
          NavigationDestination(
            icon: Icon(Icons.public),
            selectedIcon: Icon(Icons.public, color: Colors.indigo),
            label: 'Lookup',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_border),
            selectedIcon: Icon(Icons.favorite, color: Colors.red),
            label: 'Favorites',
          ),
        ],
      ),
    );
  }
}

// ============================================================================
// 7. FEATURE VIEW 1: CURRENCY CONVERTER (RESPONSIVE <500px)
// ============================================================================

class CurrencyConverterView extends StatelessWidget {
  const CurrencyConverterView({super.key});

  void _showTargetSelectorModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => const DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        expand: false,
        builder: (context, controller) => SingleChildScrollView(
          controller: controller,
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: CurrencyTargetSelector(isModal: true),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currency = Provider.of<CurrencyProvider>(context);
    final favs = Provider.of<FavoritesProvider>(context);

    final String favId = 'curr_${currency.baseCurrency}_${currency.selectedTargets.join('_')}';
    final bool isFav = favs.isFavorite(favId);

    return LayoutBuilder(
      builder: (context, constraints) {
        final bool isCompact = constraints.maxWidth < 500;

        return Scaffold(
          floatingActionButton: isCompact
              ? FloatingActionButton.extended(
                  onPressed: () => _showTargetSelectorModal(context),
                  icon: const Icon(Icons.tune),
                  label: Text('Targets (${currency.selectedTargets.length})'),
                )
              : null,
          body: RefreshIndicator(
            onRefresh: () => currency.fetchRates(),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (currency.error != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        currency.error!,
                        style: TextStyle(color: Colors.amber.shade900, fontSize: 12),
                        textAlign: TextAlign.center,
                      ),
                    ),

                  // Base Currency Control Card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Base Amount & Currency', style: TextStyle(fontWeight: FontWeight.bold)),
                              IconButton(
                                icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : null),
                                onPressed: () {
                                  favs.toggleFavorite(
                                    FavoriteItem(
                                      id: favId,
                                      type: FavoriteType.currency,
                                      title: '${currency.baseAmount} ${currency.baseCurrency}',
                                      subtitle: 'Targets: ${currency.selectedTargets.join(', ')}',
                                      data: {
                                        'base': currency.baseCurrency,
                                        'amount': currency.baseAmount,
                                        'targets': currency.selectedTargets.toList(),
                                      },
                                    ),
                                  );
                                },
                              )
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                flex: 2,
                                child: TextFormField(
                                  initialValue: currency.baseAmount.toString(),
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  decoration: const InputDecoration(
                                    labelText: 'Amount',
                                    border: OutlineInputBorder(),
                                  ),
                                  onChanged: (v) {
                                    final val = double.tryParse(v) ?? 0.0;
                                    currency.setBaseAmount(val);
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                flex: 1,
                                child: DropdownButtonFormField<String>(
                                  value: currency.baseCurrency,
                                  decoration: const InputDecoration(
                                    labelText: 'Base',
                                    border: OutlineInputBorder(),
                                  ),
                                  items: currency.availableCurrencies
                                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                                      .toList(),
                                  onChanged: (val) {
                                    if (val != null) currency.setBaseCurrency(val);
                                  },
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Expanded/Standard Mode Display Target Chips Inline
                  if (!isCompact) ...[
                    const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: CurrencyTargetSelector(isModal: false),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Calculated Output Cards
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Conversions (${currency.selectedTargets.length})', style: Theme.of(context).textTheme.titleMedium),
                      if (currency.isLoading)
                        const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                    ],
                  ),
                  const SizedBox(height: 8),

                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: currency.selectedTargets.length,
                    itemBuilder: (context, idx) {
                      final target = currency.selectedTargets.elementAt(idx);
                      final converted = currency.calculateConvertedAmount(target);
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                            child: Text(target.substring(0, 2)),
                          ),
                          title: Text(
                            '${converted.toStringAsFixed(2)} $target',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          subtitle: Text('1 ${currency.baseCurrency} = ${(converted / (currency.baseAmount == 0 ? 1 : currency.baseAmount)).toStringAsFixed(4)} $target'),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 60), // Extra space for FAB
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class CurrencyTargetSelector extends StatelessWidget {
  final bool isModal;
  const CurrencyTargetSelector({super.key, required this.isModal});

  @override
  Widget build(BuildContext context) {
    final currency = Provider.of<CurrencyProvider>(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Select Target Currencies', style: Theme.of(context).textTheme.titleMedium),
            if (isModal)
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              )
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8.0,
          runSpacing: 4.0,
          children: currency.availableCurrencies.map((c) {
            final isSelected = currency.selectedTargets.contains(c);
            final isBase = c == currency.baseCurrency;
            return FilterChip(
              label: Text(c),
              selected: isSelected,
              onSelected: isBase ? null : (_) => currency.toggleTarget(c),
            );
          }).toList(),
        ),
      ],
    );
  }
}

// ============================================================================
// 8. FEATURE VIEW 2: UNIT CONVERTER (RESPONSIVE <500px)
// ============================================================================

class UnitConverterView extends StatelessWidget {
  const UnitConverterView({super.key});

  void _showTargetSelectorModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => const DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.85,
        expand: false,
        builder: (context, controller) => SingleChildScrollView(
          controller: controller,
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: UnitTargetSelector(isModal: true),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final unit = Provider.of<UnitProvider>(context);
    final favs = Provider.of<FavoritesProvider>(context);

    final String favId = 'unit_${unit.category.name}_${unit.baseUnit}_${unit.selectedTargets.join('_')}';
    final bool isFav = favs.isFavorite(favId);

    return LayoutBuilder(
      builder: (context, constraints) {
        final bool isCompact = constraints.maxWidth < 500;

        return Scaffold(
          floatingActionButton: isCompact
              ? FloatingActionButton.extended(
                  onPressed: () => _showTargetSelectorModal(context),
                  icon: const Icon(Icons.checklist),
                  label: Text('Targets (${unit.selectedTargets.length})'),
                )
              : null,
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Category Picker Dropdown
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Measurement Category', style: TextStyle(fontWeight: FontWeight.bold)),
                            IconButton(
                              icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : null),
                              onPressed: () {
                                favs.toggleFavorite(
                                  FavoriteItem(
                                    id: favId,
                                    type: FavoriteType.unit,
                                    title: '${unit.baseValue} ${unit.baseUnit}',
                                    subtitle: '${unit.category.name.toUpperCase()}: ${unit.selectedTargets.join(', ')}',
                                    data: {
                                      'category': unit.category.index,
                                      'base': unit.baseUnit,
                                      'value': unit.baseValue,
                                      'targets': unit.selectedTargets.toList(),
                                    },
                                  ),
                                );
                              },
                            )
                          ],
                        ),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<UnitCategory>(
                          value: unit.category,
                          decoration: const InputDecoration(border: OutlineInputBorder()),
                          items: UnitCategory.values.map((cat) {
                            return DropdownMenuItem(
                              value: cat,
                              child: Text(cat.name.toUpperCase()),
                            );
                          }).toList(),
                          onChanged: (cat) {
                            if (cat != null) unit.setCategory(cat);
                          },
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: TextFormField(
                                initialValue: unit.baseValue.toString(),
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                decoration: const InputDecoration(
                                  labelText: 'Value',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (v) {
                                  final val = double.tryParse(v) ?? 0.0;
                                  unit.setBaseValue(val);
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 2,
                              child: DropdownButtonFormField<String>(
                                value: unit.baseUnit,
                                isExpanded: true,
                                decoration: const InputDecoration(
                                  labelText: 'From Unit',
                                  border: OutlineInputBorder(),
                                ),
                                items: unit.availableUnits
                                    .map((u) => DropdownMenuItem(value: u, child: Text(u, overflow: TextOverflow.ellipsis)))
                                    .toList(),
                                onChanged: (val) {
                                  if (val != null) unit.setBaseUnit(val);
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Standard Inline Controls (≥ 500px)
                if (!isCompact) ...[
                  const Card(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: UnitTargetSelector(isModal: false),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],

                Text('Results (${unit.selectedTargets.length})', style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 8),

                // Calculated Output Cards
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: unit.selectedTargets.length,
                  itemBuilder: (context, idx) {
                    final target = unit.selectedTargets.elementAt(idx);
                    final result = unit.convert(target);
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
                          child: const Icon(Icons.straighten, size: 20),
                        ),
                        title: Text(
                          '${result.toStringAsFixed(4)} $target',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        subtitle: Text('Base: ${unit.baseValue} ${unit.baseUnit}'),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 60),
              ],
            ),
          ),
        );
      },
    );
  }
}

class UnitTargetSelector extends StatelessWidget {
  final bool isModal;
  const UnitTargetSelector({super.key, required this.isModal});

  @override
  Widget build(BuildContext context) {
    final unit = Provider.of<UnitProvider>(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Select Target Units', style: Theme.of(context).textTheme.titleMedium),
            if (isModal)
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              )
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8.0,
          runSpacing: 4.0,
          children: unit.availableUnits.map((u) {
            final isSelected = unit.selectedTargets.contains(u);
            final isBase = u == unit.baseUnit;
            return FilterChip(
              label: Text(u),
              selected: isSelected,
              onSelected: isBase ? null : (_) => unit.toggleTarget(u),
            );
          }).toList(),
        ),
      ],
    );
  }
}

// ============================================================================
// 9. FEATURE VIEW 3: COUNTRY & CITY LOOKUP
// ============================================================================

class LocationLookupView extends StatelessWidget {
  const LocationLookupView({super.key});

  @override
  Widget build(BuildContext context) {
    final location = Provider.of<LocationProvider>(context);
    final favs = Provider.of<FavoritesProvider>(context);

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          // Mode Toggle
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment(value: true, label: Text('Country -> Cities'), icon: Icon(Icons.flag)),
              ButtonSegment(value: false, label: Text('City -> Country'), icon: Icon(Icons.location_city)),
            ],
            selected: {location.isCountryToCityMode},
            onSelectionChanged: (set) => location.toggleMode(),
          ),
          const SizedBox(height: 16),

          // MODE 1: Country -> Cities
          if (location.isCountryToCityMode) ...[
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<CountryData>(
                        value: location.selectedCountry,
                        decoration: const InputDecoration(
                          labelText: 'Select Country',
                          border: OutlineInputBorder(),
                        ),
                        items: kMockCountries.map((c) {
                          return DropdownMenuItem(
                            value: c,
                            child: Text('${c.flag} ${c.name}'),
                          );
                        }).toList(),
                        onChanged: (c) {
                          if (c != null) location.selectCountry(c);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ListTile(
                        leading: Text(location.selectedCountry.flag, style: const TextStyle(fontSize: 32)),
                        title: Text(location.selectedCountry.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Capital: ${location.selectedCountry.capital} | Continent: ${location.selectedCountry.continent}'),
                      ),
                      const Divider(),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                        child: Text('Major Cities:', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                      Expanded(
                        child: ListView.builder(
                          itemCount: location.selectedCountry.cities.length,
                          itemBuilder: (context, idx) {
                            final city = location.selectedCountry.cities[idx];
                            final favId = 'loc_${location.selectedCountry.code}_$city';
                            final isFav = favs.isFavorite(favId);

                            return ListTile(
                              leading: const Icon(Icons.city),
                              title: Text(city),
                              trailing: IconButton(
                                icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : null),
                                onPressed: () {
                                  favs.toggleFavorite(
                                    FavoriteItem(
                                      id: favId,
                                      type: FavoriteType.location,
                                      title: '$city, ${location.selectedCountry.name}',
                                      subtitle: '${location.selectedCountry.flag} Capital: ${location.selectedCountry.capital}',
                                      data: {
                                        'countryCode': location.selectedCountry.code,
                                        'cityName': city,
                                      },
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                      )
                    ],
                  ),
                ),
              ),
            ),
          ]
          // MODE 2: City -> Country
          else ...[
            TextField(
              decoration: const InputDecoration(
                hintText: 'Search for any major city...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              ),
              onChanged: (v) => location.updateCityQuery(v),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: Builder(
                builder: (context) {
                  final results = location.searchCities();
                  if (location.cityQuery.isEmpty) {
                    return const Center(child: Text('Type a city name above to search.'));
                  }
                  if (results.isEmpty) {
                    return const Center(child: Text('No matching cities found in mock database.'));
                  }
                  return ListView.builder(
                    itemCount: results.length,
                    itemBuilder: (context, idx) {
                      final city = results[idx]['city'] as String;
                      final country = results[idx]['country'] as CountryData;
                      final favId = 'loc_${country.code}_$city';
                      final isFav = favs.isFavorite(favId);

                      return Card(
                        child: ListTile(
                          leading: Text(country.flag, style: const TextStyle(fontSize: 28)),
                          title: Text(city, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('${country.name} (${country.continent}) - Capital: ${country.capital}'),
                          trailing: IconButton(
                            icon: Icon(isFav ? Icons.favorite : Icons.favorite_border, color: isFav ? Colors.red : null),
                            onPressed: () {
                              favs.toggleFavorite(
                                FavoriteItem(
                                  id: favId,
                                  type: FavoriteType.location,
                                  title: '$city, ${country.name}',
                                  subtitle: '${country.flag} Capital: ${country.capital}',
                                  data: {
                                    'countryCode': country.code,
                                    'cityName': city,
                                  },
                                ),
                              );
                            },
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            )
          ],
        ],
      ),
    );
  }
}

// ============================================================================
// 10. PERSISTENT FAVORITES MANAGEMENT VIEW
// ============================================================================

class FavoritesView extends StatelessWidget {
  const FavoritesView({super.key});

  @override
  Widget build(BuildContext context) {
    final favs = Provider.of<FavoritesProvider>(context);

    if (favs.items.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.favorite_outline, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('No saved presets yet!', style: TextStyle(fontSize: 18, color: Colors.grey)),
            SizedBox(height: 8),
            Text('Bookmark conversions or locations to access them quickly here.', style: TextStyle(color: Colors.grey), textAlign: TextAlign.center),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16.0),
      itemCount: favs.items.length,
      itemBuilder: (context, idx) {
        final item = favs.items[idx];
        IconData iconData;
        Color iconColor;

        switch (item.type) {
          case FavoriteType.currency:
            iconData = Icons.attach_money;
            iconColor = Colors.green;
            break;
          case FavoriteType.unit:
            iconData = Icons.square_foot;
            iconColor = Colors.orange;
            break;
          case FavoriteType.location:
            iconData = Icons.public;
            iconColor = Colors.blue;
            break;
        }

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: iconColor.withOpacity(0.2),
              child: Icon(iconData, color: iconColor),
            ),
            title: Text(item.title, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(item.subtitle),
            trailing: IconButton(
              icon: const Icon(Icons.delete_outline, color: Colors.red),
              onPressed: () => favs.removeFavorite(item.id),
            ),
            onTap: () {
              // Apply preset parameters back into provider state on selection
              if (item.type == FavoriteType.currency) {
                final base = item.data['base'] as String;
                final amount = (item.data['amount'] as num).toDouble();
                final targets = List<String>.from(item.data['targets']);
                Provider.of<CurrencyProvider>(context, listen: false).applyPreset(base, amount, targets);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Currency preset applied! Switch to Currency tab.')));
              } else if (item.type == FavoriteType.unit) {
                final cat = UnitCategory.values[item.data['category'] as int];
                final base = item.data['base'] as String;
                final val = (item.data['value'] as num).toDouble();
                final targets = List<String>.from(item.data['targets']);
                Provider.of<UnitProvider>(context, listen: false).applyPreset(cat, base, val, targets);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Unit preset applied! Switch to Unit tab.')));
              }
            },
          ),
        );
      },
    );
  }
}