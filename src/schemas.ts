import { z } from 'zod'
export const loginDataSchema = z.object({
  email: z
    .string()
    .email('Formato de email inválido.')
    .max(100, 'O email deve ter no máximo 100 caracteres.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
})

export type LoginDataInput = z.infer<typeof loginDataSchema>

export const addTrainingCenterSchema = z.object({
  teacherId: z
    .string()
    .uuid({
      message: 'O professor docente é obrigatório.',
    })
    .default(''),
  name: z.string().min(1, {
    message: 'O nome do núcleo é obrigatório.',
  }),
  street: z.string().min(1, {
    message: 'O endereço da rua é obrigatório.',
  }),
  number: z
    .union([
      z
        .string()
        .trim()
        .transform(val => {
          return val === '' ? undefined : Number(val)
        }),
      z.number().min(1, {
        message: 'O número do endereço deve ser maior que 0.',
      }),
      z.undefined(),
    ])
    .refine(val => val === undefined || val >= 1, {
      message: 'O número do endereço deve ser maior que 0.',
    }),
  city: z.string().min(1, {
    message: 'A cidade é obrigatória.',
  }),
  state: z.string().min(1, {
    message: 'O estado é obrigatório.',
  }),
  zipCode: z.string().min(1, {
    message: 'O código postal é obrigatório.',
  }),
  openingDate: z.string().refine(val => !Number.isNaN(Date.parse(val)), {
    message: 'Data de inauguração inválida.',
  }),
})

export type AddTrainingCenterType = z.infer<typeof addTrainingCenterSchema>
