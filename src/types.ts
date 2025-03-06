import type { JSX } from 'react'

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
