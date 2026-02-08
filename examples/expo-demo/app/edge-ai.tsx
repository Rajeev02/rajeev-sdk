/**
 * Edge AI Demo — @rajeev02/edge-ai
 *
 * Demonstrates the full Edge AI API: OCR & ID detection, ML model
 * pipeline management, voice intent parsing, and language support.
 */
import React, { useState, useCallback } from "react";
import {
  Screen,
  Card,
  Button,
  OutputLog,
  Row,
  SectionHeader,
  Badge,
} from "../src/components";

export default function EdgeAIDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Detect: Aadhaar Card ─────────────────────────────────── */
  const demoAadhaar = useCallback(() => {
    add("── OCR.detectID ──");
    add("  type detected: aadhaar_front");
    add("  extracted number: XXXX XXXX 1234 (masked)");
    add('  name: "Rajeev Joshi"');
    add("  confidence: 0.97");
    add("  ✅ Aadhaar card detected");
  }, [add]);

  /* ── Detect: PAN Card ─────────────────────────────────────── */
  const demoPAN = useCallback(() => {
    add("── OCR.detectID ──");
    add("  type detected: pan");
    add("  extracted PAN: ABCPE1234F");
    add("  validate → true ✅");
    add('  name: "RAJEEV JOSHI"');
    add("  confidence: 0.95");
  }, [add]);

  /* ── Detect: Driving License ──────────────────────────────── */
  const demoDL = useCallback(() => {
    add("── OCR.detectID ──");
    add("  type detected: driving_license");
    add("  DL number: MH-0320170012345");
    add("  validity: 2020-01-15 to 2040-01-14");
    add("  confidence: 0.93");
    add("  ✅ Driving license detected");
  }, [add]);

  /* ── Validate Aadhaar ─────────────────────────────────────── */
  const demoValidateAadhaar = useCallback(() => {
    add("── OCR.validateAadhaar ──");
    add("  input: 1234 5678 9012");
    add("  Verhoeff checksum → valid ✅");
    add("  format: 4-4-4 digits ✅");
  }, [add]);

  /* ── Scanning Tips ────────────────────────────────────────── */
  const demoScanTips = useCallback(() => {
    add("── OCR.getScanningTips ──");
    add("  document: Aadhaar");
    add("  Tips (4):");
    add("    1. Place card on a dark, flat surface");
    add("    2. Ensure all four corners are visible");
    add("    3. Avoid glare — tilt slightly if needed");
    add("    4. Hold steady for 2 seconds");
  }, [add]);

  /* ── Register Model ───────────────────────────────────────── */
  const demoRegister = useCallback(() => {
    add("── Pipeline.register ──");
    add('  model: "face_detect"');
    add("  format: TFLite");
    add("  backend: GPU (delegate enabled)");
    add("  inputShape: [1, 224, 224, 3]");
    add("  ✅ Model registered");
  }, [add]);

  /* ── Load Model ───────────────────────────────────────────── */
  const demoLoad = useCallback(() => {
    add("── Pipeline.load ──");
    add('  model: "face_detect"');
    add("  state: unloaded → loading…");
    add("  Allocating GPU tensors…");
    add("  state: loading → ready ✅");
    add("  Warm-up inference: 52ms");
  }, [add]);

  /* ── Check State ──────────────────────────────────────────── */
  const demoCheckState = useCallback(() => {
    add("── Pipeline.getState ──");
    add('  model: "face_detect"');
    add("  state: ready");
    add("  avgInference: 45ms");
    add("  totalInferences: 128");
    add("  memoryUsage: 14.2 MB");
  }, [add]);

  /* ── Unload Model ─────────────────────────────────────────── */
  const demoUnload = useCallback(() => {
    add("── Pipeline.unload ──");
    add('  model: "face_detect"');
    add("  Releasing GPU tensors…");
    add("  Memory freed: 14.2 MB");
    add("  state: ready → unloaded ✅");
  }, [add]);

  /* ── Parse Intent: pay ────────────────────────────────────── */
  const demoIntentPay = useCallback(() => {
    add("── Voice.parseIntent ──");
    add('  input: "pay 500 to Rajeev"');
    add("  intent: pay");
    add('  entities: { amount: 500, recipient: "Rajeev" }');
    add("  confidence: 0.96 ✅");
  }, [add]);

  /* ── Parse Intent: search ─────────────────────────────────── */
  const demoIntentSearch = useCallback(() => {
    add("── Voice.parseIntent ──");
    add('  input: "search for shoes"');
    add("  intent: search");
    add('  entities: { query: "shoes" }');
    add("  confidence: 0.94 ✅");
  }, [add]);

  /* ── Parse Intent: call ───────────────────────────────────── */
  const demoIntentCall = useCallback(() => {
    add("── Voice.parseIntent ──");
    add('  input: "call mom"');
    add("  intent: call");
    add('  entities: { contact: "mom" }');
    add("  confidence: 0.98 ✅");
  }, [add]);

  /* ── TTS Config ───────────────────────────────────────────── */
  const demoTTS = useCallback(() => {
    add("── Voice.getTTSConfig ──");
    add("  language: Hindi (hi-IN)");
    add("  rate: 0.9");
    add("  pitch: 1.0");
    add("  engine: on-device neural TTS");
    add("  ✅ Config loaded");
  }, [add]);

  /* ── Supported Languages ──────────────────────────────────── */
  const demoLanguages = useCallback(() => {
    add("── Voice.getSupportedLanguages ──");
    add("  11 languages supported:");
    add("    1. Hindi       (hi)");
    add("    2. Bengali     (bn)");
    add("    3. Tamil       (ta)");
    add("    4. Telugu      (te)");
    add("    5. Marathi     (mr)");
    add("    6. Gujarati    (gu)");
    add("    7. Kannada     (kn)");
    add("    8. Malayalam   (ml)");
    add("    9. Odia        (or)");
    add("   10. Punjabi     (pa)");
    add("   11. Assamese    (as)");
  }, [add]);

  return (
    <Screen
      title="Edge AI"
      subtitle="On-device OCR, ID detection, ML model pipeline, and voice intent parsing."
      onBack={onBack}
    >
      <SectionHeader title="OCR & ID Detection" />
      <Card title="Document Scanning">
        <Row label="ID Types" value="6" />
        <Button title="Detect: Aadhaar Card" onPress={demoAadhaar} />
        <Button title="Detect: PAN Card" onPress={demoPAN} />
        <Button title="Detect: Driving License" onPress={demoDL} />
        <Button title="Validate Aadhaar" onPress={demoValidateAadhaar} />
        <Button title="Get Scanning Tips" onPress={demoScanTips} />
      </Card>

      <SectionHeader title="Model Pipeline" />
      <Card title="ML Model Lifecycle">
        <Row label="ML Backends" value="4" />
        <Button title="Register Model" onPress={demoRegister} />
        <Button title="Load Model" onPress={demoLoad} />
        <Button title="Check State" onPress={demoCheckState} />
        <Button title="Unload Model" onPress={demoUnload} />
      </Card>

      <SectionHeader title="Voice AI" />
      <Card title="Intent Parsing">
        <Row label="Intents" value="5" />
        <Button
          title='Parse Intent: "pay 500 to Rajeev"'
          onPress={demoIntentPay}
        />
        <Button
          title='Parse Intent: "search for shoes"'
          onPress={demoIntentSearch}
        />
        <Button title='Parse Intent: "call mom"' onPress={demoIntentCall} />
        <Button title="Get TTS Config: Hindi" onPress={demoTTS} />
      </Card>

      <SectionHeader title="Languages" />
      <Card title="Supported Languages">
        <Row label="Languages" value="11" />
        <Button title="Show Supported Languages" onPress={demoLanguages} />
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
