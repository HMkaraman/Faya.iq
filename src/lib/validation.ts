type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
};

type SchemaDefinition = Record<string, ValidationRule>;

export type ValidationErrors = Record<string, string>;

export function validate(data: Record<string, unknown>, schema: SchemaDefinition): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required) {
      if (value == null || value === "") {
        errors[field] = `${field} is required`;
        continue;
      }
      // Check bilingual objects
      if (typeof value === "object" && value !== null && "en" in value && "ar" in value) {
        const bil = value as { en: string; ar: string };
        if (!bil.en || !bil.ar) {
          errors[field] = `${field} is required in both languages`;
          continue;
        }
      }
    }

    if (rules.minLength && typeof value === "string" && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      continue;
    }

    if (rules.maxLength && typeof value === "string" && value.length > rules.maxLength) {
      errors[field] = `${field} must be at most ${rules.maxLength} characters`;
      continue;
    }

    if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
      continue;
    }

    if (rules.custom) {
      const err = rules.custom(value);
      if (err) {
        errors[field] = err;
        continue;
      }
    }
  }

  return errors;
}

// Schema definitions per entity
export const serviceSchema: SchemaDefinition = {
  name: { required: true },
  categorySlug: { required: true },
  slug: { required: true, pattern: /^[a-z0-9-]+$/ },
};

export const blogSchema: SchemaDefinition = {
  title: { required: true },
  slug: { required: true, pattern: /^[a-z0-9-]+$/ },
};

export const gallerySchema: SchemaDefinition = {
  title: { required: true },
  category: { required: true },
};

export const offerSchema: SchemaDefinition = {
  title: { required: true },
};

export const branchSchema: SchemaDefinition = {
  name: { required: true },
  slug: { required: true, pattern: /^[a-z0-9-]+$/ },
  phone: { required: true },
};

export const teamSchema: SchemaDefinition = {
  name: { required: true },
  title: { required: true },
};

export const testimonialSchema: SchemaDefinition = {
  name: { required: true },
  text: { required: true },
};

export const userSchema: SchemaDefinition = {
  username: { required: true, minLength: 3 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  name: { required: true },
};
