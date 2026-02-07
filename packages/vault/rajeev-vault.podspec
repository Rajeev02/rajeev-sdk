Pod::Spec.new do |s|
  s.name         = "RajeevVault"
  s.version      = "0.1.0"
  s.summary      = "Universal secure storage for React Native — Rust-powered AES-256-GCM encryption"
  s.homepage     = "https://github.com/Rajeev02/rajeev-sdk"
  s.license      = { :type => "MIT", :file => "../../LICENSE" }
  s.author       = { "Rajeev Joshi" => "rajeev02@github.com" }
  s.source       = { :git => "https://github.com/Rajeev02/rajeev-sdk.git", :tag => s.version }

  s.ios.deployment_target = "16.0"
  s.watchos.deployment_target = "9.0"

  s.source_files = "ios/RajeevVault/**/*.{h,m,swift}"

  # Pre-built Rust static library
  s.vendored_libraries = "rust-core/target/universal/release/librajeev_vault_core.a"

  # UniFFI generated Swift bindings
  s.preserve_paths = "rust-core/target/uniffi/**/*"

  s.dependency "React-Core"

  s.swift_version = "6.0"
end
