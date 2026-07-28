import 'package:flutter/material.dart';
import 'package:currency_converter_pro/currency_converter_pro.dart';

void main() {
  runApp(const CurrencyConverterApp());
}

class CurrencyConverterApp extends StatelessWidget {
  const CurrencyConverterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Currency Converter Pro',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      home: const ConverterHomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class ConverterHomeScreen extends StatefulWidget {
  const ConverterHomeScreen({super.key});

  @override
  State<ConverterHomeScreen> createState() => _ConverterHomeScreenState();
}

class _ConverterHomeScreenState extends State<ConverterHomeScreen> {
  final TextEditingController _amountController = TextEditingController(text: '1.0');
  
  String _fromCurrency = 'usd';
  String _toCurrency = 'eur';
  double _convertedValue = 0.0;
  bool _isLoading = false;

  // Supported options by the package
  final List<String> _currencies = ['usd', 'eur', 'gbp', 'inr', 'jpy', 'aud', 'cad'];
  final _converter = CurrencyConverterPro();

  @override
  void initState() {
    super.initState();
    _convertCurrency();
  }

  Future<void> _convertCurrency() async {
    FocusScope.of(context).unfocus();
    setState(() {
      _isLoading = true;
    });

    try {
      double amount = double.tryParse(_amountController.text) ?? 1.0;
      
      // Real-time conversion using currency_converter_pro
      final result = await _converter.convertCurrency(
        amount: amount,
        fromCurrency: _fromCurrency,
        toCurrency: _toCurrency,
      );

      setState(() {
        _convertedValue = result.convertedAmount;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Conversion failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Currency Converter Pro'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Amount Input
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: InputDecoration(
                labelText: 'Enter Amount',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                prefixIcon: const Icon(Icons.wallet),
              ),
            ),
            const SizedBox(height: 24),

            // Currency Dropdowns
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _fromCurrency,
                    decoration: InputDecoration(
                      labelText: 'From',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    items: _currencies.map((String code) {
                      return DropdownMenuItem<String>(
                        value: code,
                        child: Text(code.toUpperCase()),
                      );
                    }).toList(),
                    onChanged: (String? val) {
                      if (val != null) setState(() => _fromCurrency = val);
                    },
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12.0),
                  child: Icon(Icons.swap_horiz, size: 28, color: Colors.grey),
                ),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _toCurrency,
                    decoration: InputDecoration(
                      labelText: 'To',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    items: _currencies.map((String code) {
                      return DropdownMenuItem<String>(
                        value: code,
                        child: Text(code.toUpperCase()),
                      );
                    }).toList(),
                    onChanged: (String? val) {
                      if (val != null) setState(() => _toCurrency = val);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 30),

            // Convert Action Button
            ElevatedButton(
              onPressed: _isLoading ? null : _convertCurrency,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                backgroundColor: Colors.indigo,
                foregroundColor: Colors.white,
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Text(
                      'Convert Currency',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
            ),
            const SizedBox(height: 40),

            // Result Display Card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    const Text(
                      'Converted Result',
                      style: TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      '${_convertedValue.toStringAsFixed(4)} ${_toCurrency.toUpperCase()}',
                      style: const TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: Colors.indigo,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}