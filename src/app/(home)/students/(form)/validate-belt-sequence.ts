import type { RequestBeltType } from '@/types'

export function validateBeltSequence(
  belts: { type: string; achievedDate: string }[],
  beltTypesList: RequestBeltType[]
): { isValid: boolean; message?: string } {
  const validBeltOrder = beltTypesList.map(beltObj => Object.keys(beltObj)[0])

  const sortedBelts = [...belts].sort((a, b) => {
    return (
      new Date(a.achievedDate).getTime() - new Date(b.achievedDate).getTime()
    )
  })

  for (let i = 0; i < sortedBelts.length; i++) {
    const currentBeltIndex = validBeltOrder.indexOf(sortedBelts[i].type)

    if (i > 0) {
      const prevBeltIndex = validBeltOrder.indexOf(sortedBelts[i - 1].type)
      if (currentBeltIndex <= prevBeltIndex) {
        const currentBeltName = getBeltName(sortedBelts[i].type, beltTypesList)
        const prevBeltName = getBeltName(sortedBelts[i - 1].type, beltTypesList)

        return {
          isValid: false,
          message: `A faixa ${currentBeltName} (${formatDate(sortedBelts[i].achievedDate)}) deve ter a data de início anterior a faixa ${prevBeltName} (${formatDate(sortedBelts[i - 1].achievedDate)}).`,
        }
      }
    }
  }

  return { isValid: true }
}

function getBeltName(
  beltType: string,
  beltTypesList: { [key: string]: string }[]
): string {
  const beltObj = beltTypesList.find(obj => Object.keys(obj)[0] === beltType)
  return beltObj ? Object.values(beltObj)[0] : beltType
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}
