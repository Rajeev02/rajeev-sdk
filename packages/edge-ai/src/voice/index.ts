/**
 * @rajeev02/edge-ai — Voice Commands
 * On-device wake word detection, speech-to-text, intent parsing for Indian languages
 */

export type VoiceState = "idle" | "listening" | "processing" | "speaking";

export interface VoiceConfig {
  /** Wake word (e.g., "Hey Rajeev", "Ok App") */
  wakeWord?: string;
  /** Language for speech recognition */
  language: string;
  /** Whether to run recognition on-device only */
  offlineOnly?: boolean;
  /** Max listening duration in seconds */
  maxDurationSeconds?: number;
  /** Minimum confidence to accept (0-1) */
  minConfidence?: number;
}

export interface SpeechResult {
  /** Recognized text */
  text: string;
  /** Confidence (0-1) */
  confidence: number;
  /** Detected language */
  language: string;
  /** Whether this is a final result or interim */
  isFinal: boolean;
  /** Alternative transcriptions */
  alternatives?: { text: string; confidence: number }[];
}

export interface VoiceIntent {
  /** Parsed intent name (e.g., "navigate", "search", "pay", "call") */
  intent: string;
  /** Confidence of intent classification */
  confidence: number;
  /** Extracted entities */
  entities: Record<string, string>;
  /** Original speech text */
  originalText: string;
}

/** Supported Indian languages for voice */
export const SUPPORTED_VOICE_LANGUAGES: Record<string, string> = {
  "hi-IN": "Hindi",
  "en-IN": "English (India)",
  "bn-IN": "Bengali",
  "ta-IN": "Tamil",
  "te-IN": "Telugu",
  "mr-IN": "Marathi",
  "gu-IN": "Gujarati",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
  "pa-IN": "Punjabi",
  "or-IN": "Odia",
};

/**
 * Parse simple voice commands into intents
 * This is a rule-based parser for common commands; production would use an NLU model
 */
export function parseVoiceIntent(
  text: string,
  language: string = "en-IN",
): VoiceIntent {
  const lower = text.toLowerCase().trim();
  const result: VoiceIntent = {
    intent: "unknown",
    confidence: 0.5,
    entities: {},
    originalText: text,
  };

  // Navigation intents
  if (/^(go to|open|show|navigate to)\s+(.+)$/i.test(lower)) {
    result.intent = "navigate";
    result.entities.destination = lower.replace(
      /^(go to|open|show|navigate to)\s+/i,
      "",
    );
    result.confidence = 0.9;
  }
  // Search
  else if (/^(search|find|look for)\s+(.+)$/i.test(lower)) {
    result.intent = "search";
    result.entities.query = lower.replace(/^(search|find|look for)\s+/i, "");
    result.confidence = 0.9;
  }
  // Payment
  else if (/^(pay|send|transfer)\s+(.+)/i.test(lower)) {
    result.intent = "pay";
    const amountMatch = lower.match(/(\d+)/);
    if (amountMatch) result.entities.amount = amountMatch[1];
    const toMatch = lower.match(/to\s+(\w+)/);
    if (toMatch) result.entities.recipient = toMatch[1];
    result.confidence = 0.85;
  }
  // Call
  else if (/^(call|phone|dial)\s+(.+)$/i.test(lower)) {
    result.intent = "call";
    result.entities.contact = lower.replace(/^(call|phone|dial)\s+/i, "");
    result.confidence = 0.9;
  }
  // Read aloud
  else if (/^(read|read out|speak)\s+(.+)$/i.test(lower)) {
    result.intent = "read_aloud";
    result.entities.content = lower.replace(/^(read|read out|speak)\s+/i, "");
    result.confidence = 0.85;
  }
  // Help
  else if (/^(help|kya kar sakte|madad)$/i.test(lower)) {
    result.intent = "help";
    result.confidence = 0.95;
  }

  return result;
}

/**
 * Text-to-Speech configuration for Indian languages
 */
export function getTtsConfig(language: string): {
  rate: number;
  pitch: number;
} {
  // Indian languages generally benefit from slightly slower rate
  switch (language) {
    case "hi-IN":
      return { rate: 0.9, pitch: 1.0 };
    case "bn-IN":
      return { rate: 0.85, pitch: 1.0 };
    case "ta-IN":
      return { rate: 0.85, pitch: 1.0 };
    default:
      return { rate: 0.95, pitch: 1.0 };
  }
}
