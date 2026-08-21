import { z } from 'zod';

const titleField = z
  .string()
  .min(1, 'タイトルを入力してください')
  .max(50, 'タイトルは50文字以内で入力してください')
  // min(1) だけでは空白のみを通すため trim 後の長さも見る
  .refine((v) => v.trim().length > 0, 'タイトルを入力してください');

const bodyField = z
  .string()
  .min(10, '本文は10文字以上で入力してください')
  .max(2000, '本文は2000文字以内で入力してください');

export const titleEditSchema = z.object({ title: titleField });
export const bodyEditSchema = z.object({ body: bodyField });
export const contentFormSchema = z.object({ title: titleField, body: bodyField });

export type TitleEditValues = z.infer<typeof titleEditSchema>;
export type BodyEditValues = z.infer<typeof bodyEditSchema>;
export type ContentFormValues = z.infer<typeof contentFormSchema>;
