import type { BeltKey, BeltOutput, StudentDetails } from '@/types'
import { formatDate } from './formatDate'

export const beltMap = {
  begginer: { label: 'Iniciante', color: '#ffffff', textColor: '#000000' },
  white: { label: 'Branca', color: '#ffffff', textColor: '#000000' },
  blue: { label: 'Azul', color: '#1e88e5', textColor: '#ffffff' },
  blue_grade: { label: 'Azul-Grau', color: '#0d47a1', textColor: '#ffffff' },
  yellow: { label: 'Amarela', color: '#fdd835', textColor: '#000000' },
  yellow_grade: {
    label: 'Amarela-Grau',
    color: '#f9a825',
    textColor: '#000000',
  },
  orange: { label: 'Laranja', color: '#ff9800', textColor: '#000000' },
  orange_grade: {
    label: 'Laranja-Grau',
    color: '#e65100',
    textColor: '#ffffff',
  },
  green: { label: 'Verde', color: '#43a047', textColor: '#ffffff' },
  green_grade: { label: 'Verde-Grau', color: '#1b5e20', textColor: '#ffffff' },
  brown: { label: 'Marrom', color: '#795548', textColor: '#ffffff' },
  brown_grade: { label: 'Marrom-Grau', color: '#4e342e', textColor: '#ffffff' },
  black: { label: 'Preta', color: '#000000', textColor: '#ffffff' },
  black_1_grade: {
    label: 'Preta 1° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_2_grade: {
    label: 'Preta 2° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_3_grade: {
    label: 'Preta 3° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_4_grade: {
    label: 'Preta 4° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_5_grade: {
    label: 'Preta 5° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_6_grade: {
    label: 'Preta 6° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_7_grade: {
    label: 'Preta 7° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_8_grade: {
    label: 'Preta 8° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
  black_9_grade: {
    label: 'Preta 9° Grau',
    color: '#000000',
    textColor: '#ffffff',
  },
} as const

export function mapBeltKeyToValue(key: string) {
  const mappedKey: keyof typeof beltMap = key
    .toLowerCase()
    .replace(/(\d)([A-Z])/g, '$1$2'.toLowerCase()) as keyof typeof beltMap
  return beltMap[mappedKey]
}

export function mapBeltValueToKey(
  value: string
): keyof typeof beltMap | undefined {
  for (const [key, v] of Object.entries(beltMap)) {
    if (v.label === value) {
      return key as keyof typeof beltMap
    }
  }
  return undefined
}

export function calculateBeltDuration(value: number): string {
  const years = Math.floor(value / 12)
  const months = value % 12

  const yearsPlural = years === 1 ? 'ano' : 'anos'
  const monthsPlural = months === 1 ? 'mês' : 'meses'
  let finalMessage = ''

  if (years > 0) {
    // "mês" se for 1, "meses" se for maior que 1

    finalMessage =
      months > 0
        ? `${years} ${yearsPlural} e ${months} ${monthsPlural}`
        : `${years} ${yearsPlural}`
  } else {
    finalMessage = `${months} ${monthsPlural}`
  }
  return finalMessage
}

export function processStudentBelts(data: StudentDetails) {
  const { belts } = data

  const sortedBelts = [...belts].sort((a, b) => {
    return (
      new Date(a.achievedDate).getTime() - new Date(b.achievedDate).getTime()
    )
  })

  const validBeltOrder = Object.keys(beltMap) as BeltKey[]

  const mappedBelts = sortedBelts.map((belt, index) => {
    const beltKey = belt.name.toLowerCase()

    const nextBelt = sortedBelts[index + 1]

    let durationMonths: number | null = null

    if (nextBelt) {
      const startDate = new Date(belt.achievedDate)
      const finishDate = new Date(nextBelt.achievedDate)

      const monthsDiff =
        (finishDate.getFullYear() - startDate.getFullYear()) * 12 +
        (finishDate.getMonth() - startDate.getMonth())

      durationMonths = monthsDiff
    } else {
      const startDate = new Date(belt.achievedDate)
      const today = new Date()

      const monthsDiff =
        (today.getFullYear() - startDate.getFullYear()) * 12 +
        (today.getMonth() - startDate.getMonth())

      durationMonths = monthsDiff
    }

    let isValid = true

    if (index > 0) {
      const prevBelt = sortedBelts[index - 1]
      const prevBeltKey = prevBelt.name.toLowerCase()

      const currentBeltIndex = validBeltOrder.findIndex(
        key => key.toLowerCase() === beltKey
      )
      const prevBeltIndex = validBeltOrder.findIndex(
        key => key.toLowerCase() === prevBeltKey
      )

      if (
        currentBeltIndex !== -1 &&
        prevBeltIndex !== -1 &&
        currentBeltIndex <= prevBeltIndex
      ) {
        isValid = false
      }
    }

    let beltDuration: string | null = null

    if (durationMonths !== null) {
      beltDuration = calculateBeltDuration(durationMonths)
      if (!isValid) {
        beltDuration += ' (sequência inválida)'
      }
    }

    const formattedAchievedDate = formatDate(belt.achievedDate)

    return {
      name: belt.name,
      achievedDate: formattedAchievedDate,
      beltDuration,
    } as BeltOutput
  })

  return {
    ...data,
    belts: mappedBelts,
  }
}
