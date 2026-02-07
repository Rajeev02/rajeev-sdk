pub mod dictionary;
pub mod formatting;
pub mod transliteration;

pub use dictionary::{LanguagePack, TranslationEngine};
pub use formatting::{
    format_date_indian, format_indian_number, format_inr, format_inr_short,
    format_phone_indian, format_time_12h,
};
pub use transliteration::{detect_script, supported_scripts, transliterate_to_devanagari, Script};

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_integrated_locale_workflow() {
        // Create translation engine
        let engine = TranslationEngine::new("en", "en");
        engine.load_language(LanguagePack {
            code: "en".to_string(),
            name: "English".to_string(),
            native_name: "English".to_string(),
            rtl: false,
            translations: HashMap::from([
                ("balance".to_string(), "Your balance: {{amount}}".to_string()),
            ]),
        });

        // Format currency in Indian style
        let amount = format_inr(1234567.50);

        // Use in translation
        let params = HashMap::from([("amount".to_string(), amount)]);
        let result = engine.translate("balance", Some(&params));
        assert!(result.contains("\u{20B9}"));
        assert!(result.contains("12,34,567"));
    }

    #[test]
    fn test_script_detection_and_transliteration() {
        // Detect that "Hello" is Latin
        assert_eq!(detect_script("Hello"), Script::Latin);

        // Detect Devanagari
        assert_eq!(detect_script("\u{0928}\u{092E}\u{0938}\u{094D}\u{0924}\u{0947}"), Script::Devanagari);

        // Transliterate
        let result = transliterate_to_devanagari("namaste");
        assert_ne!(result, "namaste");
    }
}
