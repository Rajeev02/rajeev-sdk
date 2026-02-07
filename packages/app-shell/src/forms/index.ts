/**
 * @rajeev02/app-shell — Form Engine + KYC
 * Dynamic forms, multi-step wizard, validation, Indian ID verification
 */

export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "password"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "date"
  | "file"
  | "image"
  | "aadhaar"
  | "pan"
  | "ifsc"
  | "pincode"
  | "vpa"
  | "textarea"
  | "otp";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule[];
  options?: { label: string; value: string }[];
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  dependsOn?: { fieldId: string; value: unknown };
  helpText?: string;
  masked?: boolean;
}

export interface ValidationRule {
  type:
    | "required"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "email"
    | "phone"
    | "aadhaar"
    | "pan"
    | "ifsc"
    | "pincode"
    | "custom";
  value?: unknown;
  message: string;
  validator?: (value: unknown) => boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}
export interface FormConfig {
  id: string;
  title: string;
  steps: FormStep[];
  onSubmit?: (
    data: Record<string, unknown>,
  ) => Promise<{ success: boolean; error?: string }>;
}

export interface FormState {
  currentStep: number;
  totalSteps: number;
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export class FormEngine {
  private config: FormConfig;
  private state: FormState;

  constructor(config: FormConfig) {
    this.config = config;
    this.state = {
      currentStep: 0,
      totalSteps: config.steps.length,
      values: {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
    };
    for (const step of config.steps)
      for (const f of step.fields)
        if (f.defaultValue !== undefined)
          this.state.values[f.id] = f.defaultValue;
  }

  setValue(fieldId: string, value: unknown): void {
    this.state.values[fieldId] = value;
    this.state.touched[fieldId] = true;
    this.state.isDirty = true;
    this.validateField(fieldId);
  }
  getValue(fieldId: string): unknown {
    return this.state.values[fieldId];
  }
  getValues(): Record<string, unknown> {
    return { ...this.state.values };
  }

  validateField(fieldId: string): string | null {
    const field = this.config.steps
      .flatMap((s) => s.fields)
      .find((f) => f.id === fieldId);
    if (!field) return null;
    const value = this.state.values[fieldId];
    const str = String(value ?? "");

    for (const rule of field.validation ?? []) {
      let error: string | null = null;
      switch (rule.type) {
        case "required":
          error = !value || str.trim() === "" ? rule.message : null;
          break;
        case "minLength":
          error = str.length < (rule.value as number) ? rule.message : null;
          break;
        case "maxLength":
          error = str.length > (rule.value as number) ? rule.message : null;
          break;
        case "pattern":
          error = !new RegExp(rule.value as string).test(str)
            ? rule.message
            : null;
          break;
        case "email":
          error = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) ? rule.message : null;
          break;
        case "phone":
          error = !/^[6-9]\d{9}$/.test(
            str.replace(/\D/g, "").replace(/^91/, ""),
          )
            ? rule.message
            : null;
          break;
        case "aadhaar":
          error = !/^[2-9]\d{11}$/.test(str.replace(/\s/g, ""))
            ? rule.message
            : null;
          break;
        case "pan":
          error = !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(str.toUpperCase())
            ? rule.message
            : null;
          break;
        case "ifsc":
          error = !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(str.toUpperCase())
            ? rule.message
            : null;
          break;
        case "pincode":
          error = !/^\d{6}$/.test(str) ? rule.message : null;
          break;
        case "custom":
          error =
            rule.validator && !rule.validator(value) ? rule.message : null;
          break;
      }
      if (error) {
        this.state.errors[fieldId] = error;
        return error;
      }
    }
    delete this.state.errors[fieldId];
    return null;
  }

  validateCurrentStep(): boolean {
    const step = this.config.steps[this.state.currentStep];
    let valid = true;
    for (const f of step.fields) {
      if (this.validateField(f.id)) valid = false;
    }
    return valid;
  }

  nextStep(): boolean {
    if (!this.validateCurrentStep()) return false;
    if (this.state.currentStep < this.state.totalSteps - 1) {
      this.state.currentStep++;
      return true;
    }
    return false;
  }
  prevStep(): boolean {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
      return true;
    }
    return false;
  }

  async submit(): Promise<{ success: boolean; error?: string }> {
    this.state.isSubmitting = true;
    try {
      if (this.config.onSubmit)
        return await this.config.onSubmit(this.state.values);
      return { success: true };
    } finally {
      this.state.isSubmitting = false;
    }
  }

  getState(): FormState {
    return { ...this.state };
  }
  getCurrentStep(): FormStep {
    return this.config.steps[this.state.currentStep];
  }
  reset(): void {
    this.state = {
      currentStep: 0,
      totalSteps: this.config.steps.length,
      values: {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isDirty: false,
    };
  }
}

/** Pre-built KYC form */
export function getKycFormConfig(): FormConfig {
  return {
    id: "kyc",
    title: "Complete KYC",
    steps: [
      {
        id: "personal",
        title: "Personal Details",
        fields: [
          {
            id: "fullName",
            type: "text",
            label: "Full Name (as per Aadhaar)",
            required: true,
            validation: [{ type: "required", message: "Name is required" }],
          },
          { id: "dob", type: "date", label: "Date of Birth", required: true },
          {
            id: "phone",
            type: "phone",
            label: "Mobile Number",
            required: true,
            validation: [
              { type: "phone", message: "Enter valid mobile number" },
            ],
          },
          {
            id: "email",
            type: "email",
            label: "Email",
            validation: [{ type: "email", message: "Enter valid email" }],
          },
        ],
      },
      {
        id: "identity",
        title: "Identity Verification",
        fields: [
          {
            id: "aadhaar",
            type: "aadhaar",
            label: "Aadhaar Number",
            required: true,
            masked: true,
            validation: [
              { type: "aadhaar", message: "Enter valid 12-digit Aadhaar" },
            ],
          },
          {
            id: "pan",
            type: "pan",
            label: "PAN Number",
            required: true,
            validation: [
              { type: "pan", message: "Enter valid PAN (e.g., ABCDE1234F)" },
            ],
          },
        ],
      },
      {
        id: "address",
        title: "Address",
        fields: [
          {
            id: "address1",
            type: "text",
            label: "Address Line 1",
            required: true,
          },
          { id: "city", type: "text", label: "City", required: true },
          {
            id: "state",
            type: "select",
            label: "State",
            required: true,
            options: [
              { label: "Maharashtra", value: "MH" },
              { label: "Karnataka", value: "KA" },
              { label: "Tamil Nadu", value: "TN" },
              { label: "Delhi", value: "DL" },
              { label: "West Bengal", value: "WB" },
              { label: "Uttar Pradesh", value: "UP" },
            ],
          },
          {
            id: "pincode",
            type: "pincode",
            label: "PIN Code",
            required: true,
            validation: [
              { type: "pincode", message: "Enter valid 6-digit PIN" },
            ],
          },
        ],
      },
      {
        id: "documents",
        title: "Upload Documents",
        fields: [
          {
            id: "aadhaarFront",
            type: "image",
            label: "Aadhaar Card (Front)",
            required: true,
            maxSizeBytes: 5242880,
            acceptedTypes: ["image/jpeg", "image/png"],
          },
          {
            id: "aadhaarBack",
            type: "image",
            label: "Aadhaar Card (Back)",
            required: true,
            maxSizeBytes: 5242880,
          },
          {
            id: "panPhoto",
            type: "image",
            label: "PAN Card Photo",
            required: true,
            maxSizeBytes: 5242880,
          },
          {
            id: "selfie",
            type: "image",
            label: "Live Selfie",
            required: true,
            maxSizeBytes: 5242880,
            helpText: "Take a clear selfie for face verification",
          },
        ],
      },
    ],
  };
}
