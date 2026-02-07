use serde::{Deserialize, Serialize};

/// Supported number formatting systems
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum NumberSystem {
    /// Western: 1,000,000
    Western,
    /// Indian: 10,00,000 (lakhs and crores)
    Indian,
}

/// Format a number in Indian numbering system (lakhs and crores)
/// 1234567 → "12,34,567"
pub fn format_indian_number(num: f64) -> String {
    let is_negative = num < 0.0;
    let abs_num = num.abs();
    let integer_part = abs_num as u64;
    let decimal_part = abs_num - integer_part as f64;

    let formatted = format_indian_integer(integer_part);

    let result = if decimal_part > 0.001 {
        let dec_str = format!("{:.2}", decimal_part);
        format!("{}.{}", formatted, &dec_str[2..])
    } else {
        formatted
    };

    if is_negative {
        format!("-{}", result)
    } else {
        result
    }
}

fn format_indian_integer(num: u64) -> String {
    if num < 1000 {
        return num.to_string();
    }

    let s = num.to_string();
    let len = s.len();

    // Last 3 digits
    let last_three = &s[len - 3..];
    let rest = &s[..len - 3];

    // Group remaining digits in pairs (from right)
    let mut groups = Vec::new();
    let rest_chars: Vec<char> = rest.chars().collect();
    let mut i = rest_chars.len();

    while i > 0 {
        let start = if i >= 2 { i - 2 } else { 0 };
        let group: String = rest_chars[start..i].iter().collect();
        groups.push(group);
        i = start;
    }

    groups.reverse();
    let prefix = groups.join(",");

    format!("{},{}", prefix, last_three)
}

/// Format currency in INR with Indian number system
/// 1234567.50 → "₹12,34,567.50"
pub fn format_inr(amount: f64) -> String {
    let formatted = format_indian_number(amount.abs());
    let decimal_part = amount.abs() - (amount.abs() as u64) as f64;

    let with_decimal = if decimal_part > 0.001 {
        formatted
    } else {
        format!("{}.00", formatted)
    };

    if amount < 0.0 {
        format!("-\u{20B9}{}", with_decimal)
    } else {
        format!("\u{20B9}{}", with_decimal)
    }
}

/// Format large INR amounts in human-readable form
/// 1500000 → "₹15 Lakh"
/// 25000000 → "₹2.5 Crore"
pub fn format_inr_short(amount: f64) -> String {
    let abs = amount.abs();
    let prefix = if amount < 0.0 { "-" } else { "" };

    if abs >= 1_00_00_000.0 {
        // Crores
        let crores = abs / 1_00_00_000.0;
        if crores == crores.floor() {
            format!("{}\u{20B9}{} Crore", prefix, crores as u64)
        } else {
            format!("{}\u{20B9}{:.1} Crore", prefix, crores)
        }
    } else if abs >= 1_00_000.0 {
        // Lakhs
        let lakhs = abs / 1_00_000.0;
        if lakhs == lakhs.floor() {
            format!("{}\u{20B9}{} Lakh", prefix, lakhs as u64)
        } else {
            format!("{}\u{20B9}{:.1} Lakh", prefix, lakhs)
        }
    } else if abs >= 1_000.0 {
        // Thousands
        let thousands = abs / 1_000.0;
        if thousands == thousands.floor() {
            format!("{}\u{20B9}{}K", prefix, thousands as u64)
        } else {
            format!("{}\u{20B9}{:.1}K", prefix, thousands)
        }
    } else {
        format!("{}\u{20B9}{}", prefix, abs as u64)
    }
}

/// Format a date in Indian style: DD/MM/YYYY
pub fn format_date_indian(year: i32, month: u32, day: u32) -> String {
    format!("{:02}/{:02}/{:04}", day, month, year)
}

/// Format time in 12-hour Indian style
pub fn format_time_12h(hour: u32, minute: u32) -> String {
    let (h12, period) = if hour == 0 {
        (12, "AM")
    } else if hour < 12 {
        (hour, "AM")
    } else if hour == 12 {
        (12, "PM")
    } else {
        (hour - 12, "PM")
    };
    format!("{}:{:02} {}", h12, minute, period)
}

/// Format a phone number in Indian style: +91 XXXXX XXXXX
pub fn format_phone_indian(number: &str) -> String {
    let digits: String = number.chars().filter(|c| c.is_ascii_digit()).collect();

    match digits.len() {
        10 => format!("+91 {} {}", &digits[..5], &digits[5..]),
        11 if digits.starts_with('0') => {
            format!("+91 {} {}", &digits[1..6], &digits[6..])
        }
        12 if digits.starts_with("91") => {
            format!("+91 {} {}", &digits[2..7], &digits[7..])
        }
        _ => number.to_string(),
    }
}

/// Convert Western number words to Indian
/// "million" → "10 Lakh", "billion" → "100 Crore"
pub fn western_to_indian_words(value: f64, unit: &str) -> String {
    match unit.to_lowercase().as_str() {
        "million" => format_inr_short(value * 10_00_000.0),
        "billion" => format_inr_short(value * 1_00_00_00_000.0),
        "trillion" => format_inr_short(value * 1_00_00_00_00_00_000.0),
        _ => format!("{} {}", value, unit),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_indian_number_format() {
        assert_eq!(format_indian_number(1234.0), "1,234");
        assert_eq!(format_indian_number(12345.0), "12,345");
        assert_eq!(format_indian_number(123456.0), "1,23,456");
        assert_eq!(format_indian_number(1234567.0), "12,34,567");
        assert_eq!(format_indian_number(12345678.0), "1,23,45,678");
    }

    #[test]
    fn test_indian_number_small() {
        assert_eq!(format_indian_number(0.0), "0");
        assert_eq!(format_indian_number(999.0), "999");
        assert_eq!(format_indian_number(100.0), "100");
    }

    #[test]
    fn test_inr_format() {
        assert_eq!(format_inr(1234567.0), "\u{20B9}12,34,567.00");
        assert_eq!(format_inr(999.0), "\u{20B9}999.00");
    }

    #[test]
    fn test_inr_short() {
        assert_eq!(format_inr_short(1500000.0), "\u{20B9}15 Lakh");
        assert_eq!(format_inr_short(25000000.0), "\u{20B9}2.5 Crore");
        assert_eq!(format_inr_short(5000.0), "\u{20B9}5K");
        assert_eq!(format_inr_short(500.0), "\u{20B9}500");
    }

    #[test]
    fn test_date_format() {
        assert_eq!(format_date_indian(2026, 2, 7), "07/02/2026");
        assert_eq!(format_date_indian(2026, 12, 25), "25/12/2026");
    }

    #[test]
    fn test_time_format() {
        assert_eq!(format_time_12h(0, 0), "12:00 AM");
        assert_eq!(format_time_12h(13, 30), "1:30 PM");
        assert_eq!(format_time_12h(12, 0), "12:00 PM");
        assert_eq!(format_time_12h(9, 5), "9:05 AM");
    }

    #[test]
    fn test_phone_format() {
        assert_eq!(format_phone_indian("9876543210"), "+91 98765 43210");
        assert_eq!(format_phone_indian("09876543210"), "+91 98765 43210");
        assert_eq!(format_phone_indian("919876543210"), "+91 98765 43210");
    }

    #[test]
    fn test_negative_numbers() {
        assert_eq!(format_indian_number(-1234567.0), "-12,34,567");
        assert_eq!(format_inr(-500.0), "-\u{20B9}500.00");
    }

    #[test]
    fn test_western_to_indian() {
        let result = western_to_indian_words(1.5, "million");
        assert!(result.contains("Lakh"));
    }
}
