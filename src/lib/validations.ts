import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const money = z.coerce.number().int().min(0).max(100_000_000);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().trim().min(2, "Company name is required")
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Customer name is required"),
  email: optionalText.pipe(z.string().email().optional()),
  phone: optionalText,
  companyName: optionalText,
  status: z.enum(["ACTIVE", "PROSPECT", "INACTIVE"]),
  source: optionalText,
  lifetimeValue: money
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Lead name is required"),
  email: optionalText.pipe(z.string().email().optional()),
  phone: optionalText,
  companyName: optionalText,
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"]),
  source: optionalText,
  value: money,
  expectedClose: optionalText
});

export const taskSchema = z.object({
  title: z.string().trim().min(2, "Task title is required"),
  description: optionalText,
  dueDate: optionalText,
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  relation: optionalText
});

export const noteSchema = z.object({
  body: z.string().trim().min(2, "Note cannot be empty")
});

export const settingsSchema = z.object({
  name: z.string().trim().min(2),
  companyName: z.string().trim().min(2)
});

export function parseForm<T extends z.ZodTypeAny>(schema: T, formData: FormData) {
  return schema.parse(Object.fromEntries(formData.entries())) as z.infer<T>;
}
