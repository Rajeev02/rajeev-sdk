/**
 * Document Demo — @rajeev02/document
 *
 * Demonstrates the full Document API: file picking, PDF annotation,
 * digital signatures, and file utility helpers.
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

export default function DocumentDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── Pick Photo ───────────────────────────────────────────── */
  const demoPickPhoto = useCallback(() => {
    add("── DocumentPicker.pick ──");
    add("  source: gallery");
    add("  result: IMG_0042.jpg");
    add("  size: 3.2 MB");
    add("  mime: image/jpeg ✅");
  }, [add]);

  /* ── Pick Document ────────────────────────────────────────── */
  const demoPickDocument = useCallback(() => {
    add("── DocumentPicker.pick ──");
    add("  source: files");
    add("  result: contract.pdf");
    add("  size: 1.8 MB");
    add("  mime: application/pdf ✅");
  }, [add]);

  /* ── Pick KYC Document ────────────────────────────────────── */
  const demoPickKYC = useCallback(() => {
    add("── DocumentPicker.pick ──");
    add("  source: camera");
    add("  result: Aadhaar scan");
    add("  mime: image/jpeg ✅");
    add("  KYC document captured");
  }, [add]);

  /* ── Multi-Select ─────────────────────────────────────────── */
  const demoMultiSelect = useCallback(() => {
    add("── DocumentPicker.pickMultiple ──");
    add("  maxSelection: 5");
    add("  selected: 3 files");
    add("    1. invoice_jan.pdf (420 KB)");
    add("    2. receipt.png (1.1 MB)");
    add("    3. statement.xlsx (890 KB)");
    add("  ✅ 3 files picked");
  }, [add]);

  /* ── MIME Categories ──────────────────────────────────────── */
  const demoMIME = useCallback(() => {
    add("── DocumentPicker.categories ──");
    add("  image    → image/*");
    add("  video    → video/*");
    add("  audio    → audio/*");
    add("  pdf      → application/pdf");
    add("  document → application/msword, .docx, .odt");
    add("  spreadsheet → application/vnd.ms-excel, .xlsx, .ods");
    add("  archive  → application/zip, .rar, .7z, .tar.gz");
  }, [add]);

  /* ── Open PDF ─────────────────────────────────────────────── */
  const demoOpenPDF = useCallback(() => {
    add("── PDFEditor.open ──");
    add("  file: contract.pdf");
    add("  pages: 10");
    add("  ✅ Document loaded (10 pages)");
  }, [add]);

  /* ── Add Highlight ────────────────────────────────────────── */
  const demoHighlight = useCallback(() => {
    add("── PDFEditor.addAnnotation ──");
    add("  type: highlight");
    add("  color: yellow (#FFEB3B)");
    add("  page: 1, range: lines 12–18");
    add("  ✅ Highlight added");
  }, [add]);

  /* ── Add Stamp ────────────────────────────────────────────── */
  const demoStamp = useCallback(() => {
    add("── PDFEditor.addStamp ──");
    add("  text: APPROVED");
    add("  color: green (#10B981)");
    add("  page: 1, position: center");
    add("  ✅ Stamp placed");
  }, [add]);

  /* ── Add Text Note ────────────────────────────────────────── */
  const demoTextNote = useCallback(() => {
    add("── PDFEditor.addAnnotation ──");
    add("  type: sticky_note");
    add('  text: "Review clause 3.2 before signing"');
    add("  page: 3, position: top-right");
    add("  ✅ Text note added");
  }, [add]);

  /* ── Freehand Drawing ─────────────────────────────────────── */
  const demoFreehand = useCallback(() => {
    add("── PDFEditor.addAnnotation ──");
    add("  type: freehand");
    add("  stroke: 2px, color: #EF4444");
    add("  page: 5, points: 48");
    add("  ✅ Freehand drawing added");
  }, [add]);

  /* ── Fill Form Field ──────────────────────────────────────── */
  const demoFormField = useCallback(() => {
    add("── PDFEditor.fillField ──");
    add('  field: "full_name"');
    add('  value: "Rajeev Joshi"');
    add("  ✅ Form field populated");
  }, [add]);

  /* ── Rotate Page ──────────────────────────────────────────── */
  const demoRotate = useCallback(() => {
    add("── PDFEditor.rotatePage ──");
    add("  page: 1, rotation: 90° clockwise");
    add("  ✅ Page rotated");
  }, [add]);

  /* ── Undo ─────────────────────────────────────────────────── */
  const demoUndo = useCallback(() => {
    add("── PDFEditor.undo ──");
    add("  Reverted last annotation");
    add("  ✅ Undo successful (history: 4 items remaining)");
  }, [add]);

  /* ── Create Typed Signature ───────────────────────────────── */
  const demoTypedSig = useCallback(() => {
    add("── Signature.createTyped ──");
    add('  text: "Rajeev Joshi"');
    add("  font: Dancing Script");
    add("  color: #1E3A5F");
    add("  ✅ Typed signature created");
  }, [add]);

  /* ── Create Drawn Signature ───────────────────────────────── */
  const demoDrawnSig = useCallback(() => {
    add("── Signature.createDrawn ──");
    add("  source: canvas");
    add("  stroke: 3px, color: #111827");
    add("  points captured: 156");
    add("  ✅ Drawn signature created");
  }, [add]);

  /* ── Place Signature ──────────────────────────────────────── */
  const demoPlaceSig = useCallback(() => {
    add("── Signature.place ──");
    add("  page: 10");
    add("  position: 60% × 90%");
    add("  size: 200 × 60px");
    add("  ✅ Signature placed on document");
  }, [add]);

  /* ── Signing Record ───────────────────────────────────────── */
  const demoSigningRecord = useCallback(() => {
    add("── Signature.getRecord ──");
    add("  timestamp: 2026-02-07T14:30:00Z");
    add("  IP: 103.21.58.xx");
    add('  reason: "Contract acceptance"');
    add("  documentHash: sha256:a1b2c3d4e5f6…");
    add("  ✅ Signing record generated");
  }, [add]);

  /* ── Categorize MIME ──────────────────────────────────────── */
  const demoCategorize = useCallback(() => {
    add("── FileUtils.categorize ──");
    add("  input: application/pdf");
    add("  category: pdf ✅");
  }, [add]);

  /* ── Format Size ──────────────────────────────────────────── */
  const demoFormatSize = useCallback(() => {
    add("── FileUtils.formatSize ──");
    add("  input: 2,457,600 bytes");
    add("  output: 2.3 MB ✅");
  }, [add]);

  /* ── Get Extension ────────────────────────────────────────── */
  const demoExtension = useCallback(() => {
    add("── FileUtils.getExtension ──");
    add("  input: report.xlsx");
    add("  output: xlsx ✅");
  }, [add]);

  return (
    <Screen
      title="Document"
      subtitle="File picking, PDF annotation, digital signatures, and file utilities."
      onBack={onBack}
    >
      <SectionHeader title="Document Picker" />
      <Card title="Pick Files">
        <Row label="Sources" value="8" />
        <Row label="Categories" value="9" />
        <Button title="Pick Photo" onPress={demoPickPhoto} />
        <Button title="Pick Document" onPress={demoPickDocument} />
        <Button title="Pick KYC Document" onPress={demoPickKYC} />
        <Button title="Multi-Select" onPress={demoMultiSelect} />
        <Button title="Show MIME Categories" onPress={demoMIME} />
      </Card>

      <SectionHeader title="PDF Editor" />
      <Card title="Annotations">
        <Button title="Open PDF" onPress={demoOpenPDF} />
        <Button title="Add Highlight" onPress={demoHighlight} />
        <Button title="Add Stamp: APPROVED" onPress={demoStamp} />
        <Button title="Add Text Note" onPress={demoTextNote} />
        <Button title="Add Freehand Drawing" onPress={demoFreehand} />
        <Button title="Fill Form Field" onPress={demoFormField} />
        <Button title="Rotate Page" onPress={demoRotate} />
        <Button title="Undo" onPress={demoUndo} />
      </Card>

      <SectionHeader title="Signature" />
      <Card title="Digital Signatures">
        <Row label="Stamp Types" value="8" />
        <Row label="Sig Types" value="4" />
        <Button title="Create Typed Signature" onPress={demoTypedSig} />
        <Button title="Create Drawn Signature" onPress={demoDrawnSig} />
        <Button title="Place Signature" onPress={demoPlaceSig} />
        <Button title="Show Signing Record" onPress={demoSigningRecord} />
      </Card>

      <SectionHeader title="File Utils" />
      <Card title="Helpers">
        <Button
          title="Categorize: application/pdf → pdf"
          onPress={demoCategorize}
        />
        <Button
          title="Format Size: 2,457,600 → 2.3 MB"
          onPress={demoFormatSize}
        />
        <Button
          title="Get Extension: report.xlsx → xlsx"
          onPress={demoExtension}
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
