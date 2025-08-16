'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/helper/formatDate'
import { mapStudentSex } from '@/helper/studentSex'
import type { TrainingCenterDetailsResponse, UserInfo } from '@/types'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EditTrainingCenterStandalone } from '../../_components/edit-training-center'

interface TrainingCenterDetailsContentProps {
  data: TrainingCenterDetailsResponse
  userInfo: UserInfo
}

export function TrainingCenterDetailsContent({
  data,
  userInfo,
}: TrainingCenterDetailsContentProps) {
  const router = useRouter()
  const { trainingCenter, students } = data
  const hasPermission =
    userInfo.role === 'ADMIN' ||
    userInfo.role === 'MASTER' ||
    userInfo.id === trainingCenter.teacher.id

  const formatAddress = () => {
    const { street, number, additionalAddress, city, state, zipCode } =
      trainingCenter
    const baseAddress = `${street}, ${number}`
    const fullAddress = additionalAddress
      ? `${baseAddress}, ${additionalAddress}`
      : baseAddress
    return `${fullAddress} - ${city}/${state} - CEP: ${zipCode.replace(/(\d{5})(\d{3})/, '$1-$2')}`
  }

  const getStatusBadge = () => {
    if (trainingCenter.closingDate) {
      return <Badge variant='destructive'>Fechado</Badge>
    }
    return (
      <Badge variant='default' className='bg-green-500 hover:bg-green-600'>
        Ativo
      </Badge>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.back()}
          className='shrink-0'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div className='flex-1 min-w-0'>
          <h1 className='text-2xl font-bold text-gray-900 truncate'>
            {trainingCenter.name}
          </h1>
          <div className='flex items-center gap-2 mt-1'>
            {getStatusBadge()}
            <Badge variant='outline'>
              <Users className='h-3 w-3 mr-1' />
              {trainingCenter.studentsNumber} aluno(s)
            </Badge>
          </div>
        </div>
        {hasPermission && (
          <div className='shrink-0'>
            <EditTrainingCenterStandalone
              trainingCenterId={trainingCenter.id}
              onSuccess={() => window.location.reload()}
            />
          </div>
        )}
      </div>

      {/* Training Center Info */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              Informações do Núcleo
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <h3 className='font-medium text-sm text-muted-foreground'>
                Endereço
              </h3>
              <p className='text-sm'>{formatAddress()}</p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='font-medium text-sm text-muted-foreground'>
                  Data de Inauguração
                </h3>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span className='text-sm'>
                    {formatDate(trainingCenter.openingDate)}
                  </span>
                </div>
              </div>

              {trainingCenter.closingDate && (
                <div>
                  <h3 className='font-medium text-sm text-muted-foreground'>
                    Data de Fechamento
                  </h3>
                  <div className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3' />
                    <span className='text-sm'>
                      {formatDate(trainingCenter.closingDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsável</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <h3 className='font-medium'>{trainingCenter.teacher.name}</h3>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='outline'>
                  {trainingCenter.teacher.currentBelt}
                </Badge>
                <Badge variant='outline'>{trainingCenter.teacher.sex}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-6'>
          <CardTitle>Alunos do Núcleo ({students.length})</CardTitle>
          {hasPermission && (
            <Link href='/students/add'>
              <Button size='sm'>Adicionar Aluno</Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <Users className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>Nenhum aluno cadastrado neste núcleo</p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>Data de Nascimento</TableHead>
                    <TableHead>Faixa Atual</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.studentId}>
                      <TableCell className='font-medium'>
                        {student.student.name}
                      </TableCell>
                      <TableCell>
                        {mapStudentSex(student.student.sex).label}
                      </TableCell>
                      <TableCell>
                        {formatDate(student.student.birthDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{student.currentBelt}</Badge>
                      </TableCell>
                      <TableCell>
                        {hasPermission && (
                          <Link href={`/students/edit/${student.studentId}`}>
                            <Button variant='ghost' size='sm'>
                              Editar
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function TrainingCenterDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='flex items-center gap-4'>
        <Skeleton className='h-10 w-10' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-8 w-64' />
          <div className='flex gap-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-full' />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-24' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-24' />
          </CardHeader>
          <CardContent className='space-y-2'>
            <Skeleton className='h-5 w-48' />
            <div className='flex gap-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-5 w-16' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table Skeleton */}
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='h-9 w-28' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
