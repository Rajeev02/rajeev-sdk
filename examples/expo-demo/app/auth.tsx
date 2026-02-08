/**
 * Auth Demo — @rajeev02/auth
 *
 * Demonstrates the full Auth API: OTP authentication, session management,
 * multiple auth providers including Aadhaar eKYC and DigiLocker.
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

export default function AuthDemo({ onBack }: { onBack: () => void }) {
  const [log, setLog] = useState<string[]>([]);
  const add = useCallback(
    (msg: string) => setLog((p) => [...p, `› ${msg}`]),
    [],
  );

  /* ── OTP Authentication ───────────────────────────────────── */
  const demoSendOTP = useCallback(() => {
    add("── OTP.send ──");
    add("  phone: +91 98765 43210");
    add("  channel: SMS");
    add("  ✅ OTP sent successfully");
    add("  messageId: msg_a8f3c1d2e4b5");
    add("  ⏳ Cooldown: 30s (do not resend before)");
  }, [add]);

  const demoVerifyOTP = useCallback(() => {
    add("── OTP.verify ──");
    add('  code: "847291"');
    add("  ✅ OTP verified successfully");
    add("  accessToken:  eyJhbGciOiJSUzI1NiIsInR5cCI6…");
    add("  refreshToken: dGhpcyBpcyBhIHJlZnJlc2ggdG9r…");
    add("  expiresIn: 3600s");
    add("  tokenType: Bearer");
  }, [add]);

  /* ── Session Management ───────────────────────────────────── */
  const demoInitSession = useCallback(() => {
    add("── Session.initialize ──");
    add("  Loading persisted tokens from Vault…");
    add("  ✅ Tokens loaded");
    add("  JWT decode:");
    add('    sub: "usr_rajeev02"');
    add('    name: "Rajeev Joshi"');
    add('    email: "rajeev@example.com"');
    add("    iat: 1738886400 (2026-02-07)");
    add("    exp: 1738890000 (2026-02-07 +1h)");
  }, [add]);

  const demoCheckAuth = useCallback(() => {
    add("── Session.checkAuthState ──");
    add("  state: authenticated ✅");
    add('  userId: "usr_rajeev02"');
    add("  tokenValid: true");
    add("  expiresIn: 2847s");
  }, [add]);

  const demoRefreshToken = useCallback(() => {
    add("── Session.refresh ──");
    add("  Refreshing access token…");
    add("  ✅ Token refreshed (auto-refresh enabled)");
    add("  newAccessToken: eyJhbGciOiJSUzI1NiJ9…");
    add("  expiresIn: 3600s");
    add("  rotatedRefreshToken: true");
  }, [add]);

  const demoLogout = useCallback(() => {
    add("── Session.logout ──");
    add("  Revoking tokens on server…");
    add("  Clearing local session from Vault…");
    add("  ✅ Session cleared");
    add("  state: unauthenticated");
  }, [add]);

  /* ── Auth Providers ───────────────────────────────────────── */
  const demoShowProviders = useCallback(() => {
    add("── AuthProviders.list ──");
    add("  Available providers:");
    add("    1. Phone OTP          (SMS / WhatsApp)");
    add("    2. Google              (OAuth 2.0)");
    add("    3. Apple               (Sign in with Apple)");
    add("    4. Aadhaar eKYC        (UIDAI XML + OTP)");
    add("    5. DigiLocker          (NAD / Document pull)");
  }, [add]);

  const demoGoogleLogin = useCallback(() => {
    add("── AuthProviders.google ──");
    add("  Opening OAuth consent screen…");
    add("  redirect: com.rajeev.demo://auth/callback");
    add("  scopes: openid, profile, email");
    add("  ✅ Google sign-in successful");
    add('  googleId: "118234567890"');
    add('  email: "rajeev.joshi@gmail.com"');
    add('  displayName: "Rajeev Joshi"');
    add("  accessToken: ya29.a0AfH6SM…");
  }, [add]);

  const demoAadhaarEKYC = useCallback(() => {
    add("── AuthProviders.aadhaarEKYC ──");
    add("  Step 1: Consent collection…");
    add("    ✅ User consent obtained");
    add("  Step 2: Send Aadhaar OTP…");
    add("    aadhaarLast4: ****7890");
    add("    ✅ OTP sent to registered mobile");
    add("  Step 3: Verify OTP & fetch profile…");
    add("    ✅ eKYC verification successful");
    add("  Profile:");
    add('    name: "Rajeev Joshi"');
    add('    dob: "1995-03-15"');
    add('    gender: "M"');
    add('    address: "Bangalore, Karnataka 560001"');
    add("    photoBase64: /9j/4AAQSkZJR…(truncated)");
  }, [add]);

  return (
    <Screen
      title="Auth"
      subtitle="OTP authentication, session management, and multi-provider login including Aadhaar eKYC."
      onBack={onBack}
    >
      <SectionHeader title="OTP Authentication" />
      <Card title="Phone OTP">
        <Badge label="SMS" />
        <Button title="Send OTP" onPress={demoSendOTP} />
        <Button title="Verify OTP" onPress={demoVerifyOTP} />
      </Card>

      <SectionHeader title="Session Management" />
      <Card title="Session">
        <Button title="Initialize Session" onPress={demoInitSession} />
        <Button title="Check Auth State" onPress={demoCheckAuth} />
        <Button title="Refresh Token" onPress={demoRefreshToken} />
        <Button title="Logout" onPress={demoLogout} variant="danger" />
      </Card>

      <SectionHeader title="Auth Providers" />
      <Card title="Multi-Provider Login">
        <Button title="Show Available Providers" onPress={demoShowProviders} />
        <Button title="Login with Google" onPress={demoGoogleLogin} />
        <Button title="Aadhaar eKYC" onPress={demoAadhaarEKYC} />
      </Card>

      <SectionHeader title="Configuration" />
      <Card>
        <Row label="OTP Length" value="6" />
        <Row label="Cooldown" value="30s" />
        <Row label="Max Attempts" value="5" />
        <Row label="Lockout" value="300s" />
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
