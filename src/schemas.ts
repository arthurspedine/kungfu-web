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
  additionalAddress: z.string().default(''),
  city: z.string().min(1, {
    message: 'A cidade é obrigatória.',
  }),
  state: z.string().min(1, {
    message: 'O estado é obrigatório.',
  }),
  zipCode: z.string().min(1, {
    message: 'O CEP é obrigatório.',
  }),
  openingDate: z
    .string()
    .refine(date => date !== null && date.trim() !== '', {
      message: 'A data de inauguração é obrigatória.',
    })
    .refine(
      date => {
        const [year, month, day] = date
          .split('-')
          .map(num => Number.parseInt(num, 10))

        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
          return false
        }
        const receivedDate = new Date(year, month - 1, day)

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const todayDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        )

        return receivedDate < todayDate
      },
      { message: 'A data de inauguração deve ser anterior ao dia atual.' }
    ),
})

export const editTrainingCenterSchema = addTrainingCenterSchema.extend({
  closingDate: z
    .string()
    .refine(
      val => {
        const date = new Date(val)
        return !Number.isNaN(date.getTime())
      },
      { message: 'A data de fechamento precisa ser uma data válida.' }
    )
    .optional()
    .nullable(),
})

export type AddTrainingCenterType = z.infer<typeof addTrainingCenterSchema>
export type EditTrainingCenterType = z.infer<typeof editTrainingCenterSchema>

export const addStudentSchema = z.object({
  student: z.object({
    name: z.string().min(2, { message: 'Nome completo é obrigatório.' }),
    birthDate: z.string().refine(
      date => {
        const parsedDate = new Date(date)
        const threeYearsAgo = new Date()
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)
        return parsedDate <= threeYearsAgo
      },
      { message: 'Data de nascimento inválida' }
    ),
    sex: z.enum(['M', 'F'], {
      errorMap: () => ({ message: 'O sexo é obrigatório.' }),
    }),
  }),
  belts: z
    .array(
      z.object({
        type: z.string().min(1, { message: 'Selecione a faixa' }),
        acquisitionDate: z
          .string()
          .min(1, { message: 'Data da faixa é obrigatória' }),
      })
    )
    .min(1, { message: 'Adicione pelo menos uma faixa' }),
})

export type AddStudentType = z.infer<typeof addStudentSchema>
