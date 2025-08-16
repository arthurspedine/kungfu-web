import { getUserInfo } from '@/http/get-user-info'
import { getTrainingCenterDetails } from '@/http/training-centers'
import { redirect } from 'next/navigation'
import { TrainingCenterDetailsContent } from './_components/training-center-details-content'

interface TrainingCenterDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TrainingCenterDetailsPage({
  params,
}: TrainingCenterDetailsPageProps) {
  const { id } = await params

  try {
    const [data, userInfo] = await Promise.all([
      getTrainingCenterDetails(id),
      getUserInfo(),
    ])
    return <TrainingCenterDetailsContent data={data} userInfo={userInfo} />
  } catch {
    redirect('/training_centers')
  }
}
