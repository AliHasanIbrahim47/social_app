import { z } from "zod";
import { zfd } from "zod-form-data";

const locationSchema = z.object({
  displayName: z.string(),
  lat: z.number(),
  lon: z.number(),
});

export type LocationData = z.infer<typeof locationSchema>;

export const experienceValidationSchema = zfd.formData({
  id: zfd.numeric().optional(),
  title: zfd.text().refine(val => val.length >= 1, {
    message: "Title is required",
  }),
  content: zfd.text().refine(val => val.length >= 1, {
    message: "Content is required",
  }),
  scheduledAt: zfd.text().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  url: zfd
    .text()
    .refine(val => val === "" || z.string().url().safeParse(val).success, {
      message: "Invalid link",
    })
    .transform(val => (val === "" ? null : val)),
  image: zfd.file().optional(),
  location: zfd.text().optional(),
});

export const experienceFiltersSchema = z.object({
  q: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  tags: z.array(z.number()).optional(),
});

export type ExperienceFilterParams = z.infer<typeof experienceFiltersSchema>;
