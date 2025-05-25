export default function Loading() {
  return (
    <div className='flex items-center justify-center h-32'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
      <span className='ml-2'>Carregando...</span>
    </div>
  )
}
