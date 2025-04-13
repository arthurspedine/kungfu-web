export function mapStudentSex(value: string): { label: string } {
  return { label: value === 'M' ? 'Masculino' : 'Feminino' }
}
