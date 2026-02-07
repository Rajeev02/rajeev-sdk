use std::collections::HashMap;

/// Supported Indian scripts
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Script {
    Latin,
    Devanagari,  // Hindi, Marathi, Sanskrit
    Bengali,     // Bengali, Assamese
    Tamil,
    Telugu,
    Kannada,
    Malayalam,
    Gujarati,
    Gurmukhi,    // Punjabi
    Odia,
}

impl Script {
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "latin" | "en" => Some(Script::Latin),
            "devanagari" | "hi" | "hindi" | "mr" | "marathi" => Some(Script::Devanagari),
            "bengali" | "bn" | "bangla" => Some(Script::Bengali),
            "tamil" | "ta" => Some(Script::Tamil),
            "telugu" | "te" => Some(Script::Telugu),
            "kannada" | "kn" => Some(Script::Kannada),
            "malayalam" | "ml" => Some(Script::Malayalam),
            "gujarati" | "gu" => Some(Script::Gujarati),
            "gurmukhi" | "pa" | "punjabi" => Some(Script::Gurmukhi),
            "odia" | "or" | "oriya" => Some(Script::Odia),
            _ => None,
        }
    }

    pub fn code(&self) -> &'static str {
        match self {
            Script::Latin => "en",
            Script::Devanagari => "hi",
            Script::Bengali => "bn",
            Script::Tamil => "ta",
            Script::Telugu => "te",
            Script::Kannada => "kn",
            Script::Malayalam => "ml",
            Script::Gujarati => "gu",
            Script::Gurmukhi => "pa",
            Script::Odia => "or",
        }
    }

    pub fn name(&self) -> &'static str {
        match self {
            Script::Latin => "Latin",
            Script::Devanagari => "Devanagari",
            Script::Bengali => "Bengali",
            Script::Tamil => "Tamil",
            Script::Telugu => "Telugu",
            Script::Kannada => "Kannada",
            Script::Malayalam => "Malayalam",
            Script::Gujarati => "Gujarati",
            Script::Gurmukhi => "Gurmukhi",
            Script::Odia => "Odia",
        }
    }
}

/// Basic Latin-to-Devanagari transliteration map
fn latin_to_devanagari_map() -> HashMap<&'static str, &'static str> {
    let mut map = HashMap::new();
    // Vowels
    map.insert("a", "\u{0905}"); map.insert("aa", "\u{0906}"); map.insert("i", "\u{0907}");
    map.insert("ee", "\u{0908}"); map.insert("u", "\u{0909}"); map.insert("oo", "\u{090A}");
    map.insert("e", "\u{090F}"); map.insert("ai", "\u{0910}"); map.insert("o", "\u{0913}");
    map.insert("au", "\u{0914}");
    // Consonants
    map.insert("ka", "\u{0915}"); map.insert("kha", "\u{0916}"); map.insert("ga", "\u{0917}");
    map.insert("gha", "\u{0918}"); map.insert("cha", "\u{091A}"); map.insert("chha", "\u{091B}");
    map.insert("ja", "\u{091C}"); map.insert("jha", "\u{091D}"); map.insert("ta", "\u{0924}");
    map.insert("tha", "\u{0925}"); map.insert("da", "\u{0926}"); map.insert("dha", "\u{0927}");
    map.insert("na", "\u{0928}"); map.insert("pa", "\u{092A}"); map.insert("pha", "\u{092B}");
    map.insert("ba", "\u{092C}"); map.insert("bha", "\u{092D}"); map.insert("ma", "\u{092E}");
    map.insert("ya", "\u{092F}"); map.insert("ra", "\u{0930}"); map.insert("la", "\u{0932}");
    map.insert("va", "\u{0935}"); map.insert("sha", "\u{0936}"); map.insert("sa", "\u{0938}");
    map.insert("ha", "\u{0939}");
    // Common words
    map.insert("namaste", "\u{0928}\u{092E}\u{0938}\u{094D}\u{0924}\u{0947}");
    map.insert("dhanyavaad", "\u{0927}\u{0928}\u{094D}\u{092F}\u{0935}\u{093E}\u{0926}");
    map
}

/// Transliterate text from Latin to Devanagari (basic implementation)
pub fn transliterate_to_devanagari(input: &str) -> String {
    let map = latin_to_devanagari_map();
    let lower = input.to_lowercase();
    let words: Vec<&str> = lower.split_whitespace().collect();

    words
        .iter()
        .map(|word| {
            map.get(word as &str)
                .map(|s| s.to_string())
                .unwrap_or_else(|| word.to_string())
        })
        .collect::<Vec<_>>()
        .join(" ")
}

/// Detect the script of a given text
pub fn detect_script(text: &str) -> Script {
    for ch in text.chars() {
        match ch as u32 {
            0x0900..=0x097F => return Script::Devanagari,
            0x0980..=0x09FF => return Script::Bengali,
            0x0B80..=0x0BFF => return Script::Tamil,
            0x0C00..=0x0C7F => return Script::Telugu,
            0x0C80..=0x0CFF => return Script::Kannada,
            0x0D00..=0x0D7F => return Script::Malayalam,
            0x0A80..=0x0AFF => return Script::Gujarati,
            0x0A00..=0x0A7F => return Script::Gurmukhi,
            0x0B00..=0x0B7F => return Script::Odia,
            _ => continue,
        }
    }
    Script::Latin
}

/// Get all supported scripts
pub fn supported_scripts() -> Vec<(&'static str, &'static str)> {
    vec![
        ("en", "Latin"), ("hi", "Devanagari"), ("bn", "Bengali"),
        ("ta", "Tamil"), ("te", "Telugu"), ("kn", "Kannada"),
        ("ml", "Malayalam"), ("gu", "Gujarati"), ("pa", "Gurmukhi"),
        ("or", "Odia"),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_devanagari() {
        assert_eq!(detect_script("नमस्ते"), Script::Devanagari);
    }

    #[test]
    fn test_detect_bengali() {
        assert_eq!(detect_script("বাংলা"), Script::Bengali);
    }

    #[test]
    fn test_detect_tamil() {
        assert_eq!(detect_script("தமிழ்"), Script::Tamil);
    }

    #[test]
    fn test_detect_latin() {
        assert_eq!(detect_script("Hello World"), Script::Latin);
    }

    #[test]
    fn test_transliterate_word() {
        let result = transliterate_to_devanagari("namaste");
        assert!(!result.is_empty());
        assert_ne!(result, "namaste"); // Should be converted
    }

    #[test]
    fn test_script_from_str() {
        assert_eq!(Script::from_str("hi"), Some(Script::Devanagari));
        assert_eq!(Script::from_str("tamil"), Some(Script::Tamil));
        assert_eq!(Script::from_str("en"), Some(Script::Latin));
        assert_eq!(Script::from_str("xyz"), None);
    }

    #[test]
    fn test_supported_scripts_count() {
        assert_eq!(supported_scripts().len(), 10);
    }
}
