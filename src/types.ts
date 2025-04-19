import type { JSX } from 'react'
import type { beltMap } from './helper/belts'

export type NavigationProp = {
  id: number
  path: string
  label: string
  icon: JSX.Element
}

export type ViaCEPType = {
  cep: string
  logradouro: string
  localidade: string
  uf: string
  erro?: string
}

export type ErrorResponse = {
  success: false
  message: string
  code?: string
}

export type SuccessResponse = {
  success: true
  // biome-ignore lint/suspicious/noExplicitAny: receive any body
  data?: any
}

export type ActionResponse = ErrorResponse | SuccessResponse

export type StudentInfo = {
  id: string
  name: string
  birthDate: string
  age: number
  sex: string
  currentBelt: string
  beltAgeMonths: number
}

export type RequestBeltType = {
  [key: string]: string
}

export type TrainingCenterSimpleInfo = {
  id: string
  name: string
  teacherName: string
}

export type BeltMapType = typeof beltMap
export type BeltKey = keyof BeltMapType

export type BeltInput = {
  name: string
  achievedDate: string
}

export type BeltOutput = {
  name: string
  achievedDate: string
  beltDuration: string | null
}

export type StudentDetails = {
  id: string
  student: {
    name: string
    birthDate: string
    sex: string
  }
  belts: BeltInput[]
  trainingCenterId: string
}

export type ProcessedStudentDetails = {
  id: string
  student: {
    name: string
    birthDate: string
    sex: string
  }
  belts: BeltOutput[]
}
