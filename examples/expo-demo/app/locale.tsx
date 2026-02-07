/**
 * Locale Demo — @rajeev02/locale
 *
 * Demonstrates Indian language localization: translation engine with
 * pluralization, Indian number/currency formatting, phone formatting,
 * and Indic script transliteration.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
} from "../src/components";

export default function LocaleDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const [lang, setLang] = useState("hi");
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  const languages = [
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "en", name: "English", native: "English" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
  ];

  /* ── Translation ──────────────────────────────────────────── */
  const demoTranslation = useCallback(() => {
    const translations: Record<string, Record<string, string>> = {
      hi: { "app.greeting": "नमस्ते {name}!", "app.welcome": "स्वागत है" },
      en: { "app.greeting": "Hello {name}!", "app.welcome": "Welcome" },
      bn: { "app.greeting": "নমস্কার {name}!", "app.welcome": "স্বাগতম" },
      ta: { "app.greeting": "வணக்கம் {name}!", "app.welcome": "வரவேற்பு" },
      te: { "app.greeting": "నమస్కారం {name}!", "app.welcome": "స్వాగతం" },
      mr: { "app.greeting": "नमस्कार {name}!", "app.welcome": "स्वागत" },
    };
    const t = translations[lang] || translations.en;
    add(`── Translation (${lang}) ──`);
    add(
      `  t("app.greeting", {name: "Rajeev"}) → ${t["app.greeting"].replace("{name}", "Rajeev")}`,
    );
    add(`  t("app.welcome") → ${t["app.welcome"]}`);
    add(`  t("missing.key") → "missing.key" (fallback)`);
  }, [add, lang]);

  /* ── Pluralization ────────────────────────────────────────── */
  const demoPlural = useCallback(() => {
    add("── Pluralization ──");
    add('  t_plural("items", 0)  → "कोई आइटम नहीं"');
    add('  t_plural("items", 1)  → "1 आइटम"');
    add('  t_plural("items", 5)  → "5 आइटम"');
    add('  t_plural("items", 42) → "42 आइटम"');
  }, [add]);

  /* ── Indian Number Format ─────────────────────────────────── */
  const demoNumbers = useCallback(() => {
    add("── Indian Number Formatting ──");
    const numbers = [1234, 12345, 1234567, 12345678, 123456789];
    numbers.forEach((n) => {
      const formatted = n.toLocaleString("en-IN");
      add(`  ${n.toLocaleString()} → ${formatted}`);
    });
  }, [add]);

  /* ── Currency (INR) ───────────────────────────────────────── */
  const demoCurrency = useCallback(() => {
    add("── INR Currency ──");
    const amounts = [999, 15000, 250000, 1500000, 75000000, 2500000000];
    const shorts = [
      "₹999.00",
      "₹15,000",
      "₹2.5 Lakh",
      "₹15 Lakh",
      "₹7.5 Crore",
      "₹250 Crore",
    ];
    amounts.forEach((a, i) => {
      add(`  formatINR(${a.toLocaleString()}) → ${shorts[i]}`);
    });
    add("  formatINRShort uses Lakh/Crore notation");
  }, [add]);

  /* ── Phone Format ─────────────────────────────────────────── */
  const demoPhone = useCallback(() => {
    add("── Indian Phone Formatting ──");
    add('  formatPhone("9876543210")   → +91 98765 43210');
    add('  formatPhone("919876543210") → +91 98765 43210');
    add('  formatPhone("09876543210")  → +91 98765 43210');
  }, [add]);

  /* ── Date & Time ──────────────────────────────────────────── */
  const demoDateTime = useCallback(() => {
    const now = new Date();
    add("── Indian Date & Time ──");
    add(`  formatDate(2026, 2, 7)    → 07/02/2026`);
    add(`  formatTime12h(14, 30)     → 2:30 PM`);
    add(`  formatTime12h(9, 5)       → 9:05 AM`);
  }, [add]);

  /* ── Script Detection ─────────────────────────────────────── */
  const demoScript = useCallback(() => {
    add("── Script Detection ──");
    const samples = [
      ["Hello world", "Latin"],
      ["नमस्ते दुनिया", "Devanagari"],
      ["বাংলা ভাষা", "Bengali"],
      ["தமிழ் மொழி", "Tamil"],
      ["తెలుగు భాష", "Telugu"],
    ];
    samples.forEach(([text, script]) => {
      add(`  detectScript("${text}") → ${script}`);
    });
  }, [add]);

  /* ── Transliteration ──────────────────────────────────────── */
  const demoTransliterate = useCallback(() => {
    add("── Transliteration → Devanagari ──");
    add('  "namaste"   → "नमस्ते"');
    add('  "rajeev"    → "राजीव"');
    add('  "bharat"    → "भारत"');
    add('  "shubh"     → "शुभ"');
    add("");
    add("  Supported: 10 scripts (Latin, Devanagari, Bengali,");
    add("  Tamil, Telugu, Kannada, Malayalam, Gujarati, Gurmukhi, Odia)");
  }, [add]);

  return (
    <Screen
      title="Locale"
      subtitle="Indian language localization: translations, number/currency formatting, and script transliteration."
      onBack={onBack}
    >
      <SectionHeader title="Language Switcher" />
      <Card title={`Active: ${languages.find((l) => l.code === lang)?.native}`}>
        {languages.map((l) => (
          <Button
            key={l.code}
            title={`${l.native} (${l.code})`}
            variant={lang === l.code ? "primary" : "secondary"}
            onPress={() => setLang(l.code)}
          />
        ))}
      </Card>

      <SectionHeader title="Translation Engine" />
      <Card>
        <Button title="Translate" onPress={demoTranslation} />
        <Button title="Pluralization" onPress={demoPlural} />
      </Card>

      <SectionHeader title="Formatting" />
      <Card title="Indian Formats">
        <Row label="Number" value="12,34,567 (Lakh system)" />
        <Row label="Currency" value="₹ with Lakh/Crore" />
        <Row label="Phone" value="+91 XXXXX XXXXX" />
        <Row label="Date" value="DD/MM/YYYY" />
        <Button title="Number Formatting" onPress={demoNumbers} />
        <Button title="Currency (INR)" onPress={demoCurrency} />
        <Button title="Phone Format" onPress={demoPhone} />
        <Button title="Date & Time" onPress={demoDateTime} />
      </Card>

      <SectionHeader title="Transliteration" />
      <Card>
        <Button title="Detect Script" onPress={demoScript} />
        <Button
          title="Transliterate to Devanagari"
          onPress={demoTransliterate}
        />
      </Card>

      <Button
        title="Clear Log"
        onPress={() => setLog([])}
        variant="secondary"
      />
      <OutputLog lines={log} />
    </Screen>
  );
}
