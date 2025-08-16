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
  trainingCenter: TrainingCenterSimpleInfo
}

export type ProcessedStudentDetails = {
  id: string
  student: {
    name: string
    birthDate: string
    sex: string
  }
  belts: BeltOutput[]
  trainingCenter: TrainingCenterSimpleInfo
}

export type TrainingCenterDetailsResponse = {
  trainingCenter: {
    id: string
    teacher: {
      id: string
      name: string
      currentBelt: string
      sex: string
    }
    studentsNumber: number
    name: string
    street: string
    number: number
    additionalAddress: string | null
    city: string
    state: string
    zipCode: string
    openingDate: string
    closingDate: string | null
  }
  students: {
    studentId: string
    student: {
      name: string
      birthDate: string
      sex: string
    }
    currentBelt: string
  }[]
}

export type UserRole = 'TEACHER' | 'MASTER' | 'ADMIN'

export type UserInfo = {
  id: string
  name: string
  email: string
  role: UserRole
}
