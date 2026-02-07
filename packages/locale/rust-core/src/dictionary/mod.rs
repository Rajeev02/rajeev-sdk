use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::RwLock;

/// A translation dictionary for a single language
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguagePack {
    /// Language code (e.g., "hi", "bn", "ta")
    pub code: String,
    /// Language name in English
    pub name: String,
    /// Language name in its own script
    pub native_name: String,
    /// Whether the script is RTL (e.g., Urdu)
    pub rtl: bool,
    /// Translation key-value pairs
    pub translations: HashMap<String, String>,
}

/// Pluralization rules
#[derive(Debug, Clone, Copy)]
pub enum PluralForm {
    Zero,
    One,
    Two,
    Few,
    Many,
    Other,
}

/// Translation engine with fallback chain
pub struct TranslationEngine {
    /// Currently active language
    current_language: RwLock<String>,
    /// Fallback language (typically "en")
    fallback_language: String,
    /// All loaded language packs
    packs: RwLock<HashMap<String, LanguagePack>>,
}

impl TranslationEngine {
    pub fn new(default_language: &str, fallback: &str) -> Self {
        TranslationEngine {
            current_language: RwLock::new(default_language.to_string()),
            fallback_language: fallback.to_string(),
            packs: RwLock::new(HashMap::new()),
        }
    }

    /// Load a language pack
    pub fn load_language(&self, pack: LanguagePack) {
        if let Ok(mut packs) = self.packs.write() {
            packs.insert(pack.code.clone(), pack);
        }
    }

    /// Load a language from JSON string
    pub fn load_language_json(&self, json: &str) -> Result<String, String> {
        let pack: LanguagePack =
            serde_json::from_str(json).map_err(|e| format!("Invalid JSON: {}", e))?;
        let code = pack.code.clone();
        self.load_language(pack);
        Ok(code)
    }

    /// Set the current language
    pub fn set_language(&self, code: &str) -> bool {
        let packs = self.packs.read().ok();
        let exists = packs.map(|p| p.contains_key(code)).unwrap_or(false);
        if exists {
            if let Ok(mut lang) = self.current_language.write() {
                *lang = code.to_string();
            }
        }
        exists
    }

    /// Get current language code
    pub fn get_language(&self) -> String {
        self.current_language
            .read()
            .map(|l| l.clone())
            .unwrap_or_else(|_| self.fallback_language.clone())
    }

    /// Translate a key, with optional parameter interpolation
    /// Parameters in the translation string use {{param}} syntax
    /// Example: "Hello, {{name}}!" with params {"name": "Rajeev"} → "Hello, Rajeev!"
    pub fn translate(&self, key: &str, params: Option<&HashMap<String, String>>) -> String {
        let current = self.get_language();

        // Try current language first
        if let Some(value) = self.get_translation(&current, key) {
            return self.interpolate(&value, params);
        }

        // Try fallback language
        if current != self.fallback_language {
            if let Some(value) = self.get_translation(&self.fallback_language, key) {
                return self.interpolate(&value, params);
            }
        }

        // Return key itself as last resort
        key.to_string()
    }

    /// Translate with pluralization
    /// Keys should follow pattern: "key.zero", "key.one", "key.other"
    pub fn translate_plural(
        &self,
        key: &str,
        count: u64,
        params: Option<&HashMap<String, String>>,
    ) -> String {
        let plural_key = match count {
            0 => format!("{}.zero", key),
            1 => format!("{}.one", key),
            2 => format!("{}.two", key),
            _ => format!("{}.other", key),
        };

        // Try specific plural form, fall back to "other", then key itself
        let mut merged_params = params.cloned().unwrap_or_default();
        merged_params.insert("count".to_string(), count.to_string());

        let result = self.translate(&plural_key, Some(&merged_params));
        if result == plural_key {
            // Specific form not found, try "other"
            let other_key = format!("{}.other", key);
            let other = self.translate(&other_key, Some(&merged_params));
            if other == other_key {
                // Neither found, use base key
                self.translate(key, Some(&merged_params))
            } else {
                other
            }
        } else {
            result
        }
    }

    fn get_translation(&self, lang: &str, key: &str) -> Option<String> {
        self.packs
            .read()
            .ok()
            .and_then(|packs| packs.get(lang).and_then(|p| p.translations.get(key).cloned()))
    }

    fn interpolate(&self, template: &str, params: Option<&HashMap<String, String>>) -> String {
        match params {
            None => template.to_string(),
            Some(params) => {
                let mut result = template.to_string();
                for (key, value) in params {
                    result = result.replace(&format!("{{{{{}}}}}", key), value);
                }
                result
            }
        }
    }

    /// Get all loaded language codes
    pub fn available_languages(&self) -> Vec<String> {
        self.packs
            .read()
            .map(|p| p.keys().cloned().collect())
            .unwrap_or_default()
    }

    /// Check if a language is RTL
    pub fn is_rtl(&self, code: &str) -> bool {
        self.packs
            .read()
            .ok()
            .and_then(|p| p.get(code).map(|pack| pack.rtl))
            .unwrap_or(false)
    }

    /// Get all translation keys for current language
    pub fn get_all_keys(&self) -> Vec<String> {
        let current = self.get_language();
        self.packs
            .read()
            .ok()
            .and_then(|p| p.get(&current).map(|pack| pack.translations.keys().cloned().collect()))
            .unwrap_or_default()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_engine() -> TranslationEngine {
        let engine = TranslationEngine::new("en", "en");

        let en = LanguagePack {
            code: "en".to_string(),
            name: "English".to_string(),
            native_name: "English".to_string(),
            rtl: false,
            translations: HashMap::from([
                ("greeting".to_string(), "Hello, {{name}}!".to_string()),
                ("items.one".to_string(), "{{count}} item".to_string()),
                ("items.other".to_string(), "{{count}} items".to_string()),
                ("items.zero".to_string(), "No items".to_string()),
                ("welcome".to_string(), "Welcome".to_string()),
            ]),
        };

        let hi = LanguagePack {
            code: "hi".to_string(),
            name: "Hindi".to_string(),
            native_name: "\u{0939}\u{093F}\u{0928}\u{094D}\u{0926}\u{0940}".to_string(),
            rtl: false,
            translations: HashMap::from([
                ("greeting".to_string(), "\u{0928}\u{092E}\u{0938}\u{094D}\u{0924}\u{0947}, {{name}}!".to_string()),
                ("welcome".to_string(), "\u{0938}\u{094D}\u{0935}\u{093E}\u{0917}\u{0924}".to_string()),
            ]),
        };

        engine.load_language(en);
        engine.load_language(hi);
        engine
    }

    #[test]
    fn test_basic_translation() {
        let engine = create_test_engine();
        assert_eq!(engine.translate("welcome", None), "Welcome");
    }

    #[test]
    fn test_translation_with_params() {
        let engine = create_test_engine();
        let params = HashMap::from([("name".to_string(), "Rajeev".to_string())]);
        assert_eq!(
            engine.translate("greeting", Some(&params)),
            "Hello, Rajeev!"
        );
    }

    #[test]
    fn test_language_switch() {
        let engine = create_test_engine();
        engine.set_language("hi");
        assert_eq!(engine.get_language(), "hi");

        let result = engine.translate("welcome", None);
        assert_ne!(result, "Welcome"); // Should be Hindi
    }

    #[test]
    fn test_fallback_to_english() {
        let engine = create_test_engine();
        engine.set_language("hi");

        // "items.one" doesn't exist in Hindi, should fall back to English
        let params = HashMap::from([("count".to_string(), "1".to_string())]);
        let result = engine.translate("items.one", Some(&params));
        assert_eq!(result, "1 item");
    }

    #[test]
    fn test_missing_key_returns_key() {
        let engine = create_test_engine();
        assert_eq!(engine.translate("nonexistent.key", None), "nonexistent.key");
    }

    #[test]
    fn test_pluralization() {
        let engine = create_test_engine();
        assert_eq!(engine.translate_plural("items", 0, None), "No items");
        assert_eq!(engine.translate_plural("items", 1, None), "1 item");
        assert_eq!(engine.translate_plural("items", 5, None), "5 items");
    }

    #[test]
    fn test_available_languages() {
        let engine = create_test_engine();
        let langs = engine.available_languages();
        assert!(langs.contains(&"en".to_string()));
        assert!(langs.contains(&"hi".to_string()));
    }

    #[test]
    fn test_load_json() {
        let engine = TranslationEngine::new("en", "en");
        let json = r#"{
            "code": "ta",
            "name": "Tamil",
            "native_name": "தமிழ்",
            "rtl": false,
            "translations": {"hello": "வணக்கம்"}
        }"#;
        let code = engine.load_language_json(json).unwrap();
        assert_eq!(code, "ta");
    }

    #[test]
    fn test_set_invalid_language() {
        let engine = create_test_engine();
        assert!(!engine.set_language("xyz")); // Should return false
        assert_eq!(engine.get_language(), "en"); // Should remain unchanged
    }
}
