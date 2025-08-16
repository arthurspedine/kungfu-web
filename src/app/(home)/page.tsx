import { redirect } from 'next/navigation'

export default async function HomePage() {
  redirect('/training_centers')
}
