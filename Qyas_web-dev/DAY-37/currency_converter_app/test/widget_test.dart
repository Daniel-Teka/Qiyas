import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:currency_converter_app/main.dart';

void main() {
  testWidgets('Currency Converter basic UI test', (WidgetTester tester) async {
    // 1. Render the app widget
    await tester.pumpWidget(const MyApp());

    // 2. Verify basic components exist (adjust text/widgets to match your actual UI)
    // Example: Check if a TextField for amount input is present
    expect(find.byType(TextField), findsWidgets);

    // Example: Check if a convert button or title text is present
    // expect(find.text('Convert'), findsOneWidget);
  });
}