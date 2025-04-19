'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { proccessStudentBelts } from '@/helper/belts'
import { getStudentDetails } from '@/http/students'
import type { ProcessedStudentDetails, StudentDetails } from '@/types'
import { BookUser, EllipsisVertical, Pen, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function EditStudentDialog({ studentId }: { studentId: string }) {
  const editStudentPath = `/students/edit/${studentId}`
  const [student, setStudent] = useState<ProcessedStudentDetails>(
    {} as ProcessedStudentDetails
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)

  async function fetchStudentDetails() {
    setIsLoading(true)
    if (studentId) {
      const data: StudentDetails = await getStudentDetails(studentId)
      setStudent(proccessStudentBelts(data))
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='text-right'>
            <Button variant={'ghost'}>
              <EllipsisVertical />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-6'>
          <DialogTrigger className='w-full'>
            <DropdownMenuItem onClick={fetchStudentDetails}>
              Detalhes
              <DropdownMenuShortcut>
                <BookUser size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem asChild>
            <Link href={editStudentPath}>
              Editar
              <DropdownMenuShortcut>
                <Pen size={16} />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <div className='flex flex-col gap-6 h-full justify-end'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <DialogTitle>Detalhes do Aluno</DialogTitle>
              <DialogClose>
                <X className='size-5 text-zinc-600' />
              </DialogClose>
            </div>

            <DialogDescription>
              Detalhes do aluno e tabela com o histórico de faixas.
            </DialogDescription>
          </div>

          <div className='text-sm flex flex-wrap gap-4 text-black'>
            {isLoading ? (
              <>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Nome Completo</p>
                  <Skeleton className='h-5 w-full mt-0' />
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Data de Nascimento</p>
                  <Skeleton className='h-5 w-full' />
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Sexo</p>
                  <Skeleton className='h-5 w-full' />
                </div>
              </>
            ) : (
              <>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Nome Completo</p>
                  <span className='font-medium'>{student.student.name}</span>
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Data de Nascimento</p>
                  <span className='font-medium'>
                    {student.student.birthDate}
                  </span>
                </div>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>Sexo</p>
                  <span className='font-medium'>
                    {student.student.sex === 'M' ? 'Masculino' : 'Feminino'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className='flex-1 flex flex-col justify-between'>
            {/* BELT HISTORY */}
            <div>
              {!isLoading && (
                <>
                  <h3 className='font-semibold'>Histórico de faixas</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Faixa</TableHead>
                        <TableHead>Data de início</TableHead>
                        <TableHead className='text-right'>Duração</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.belts.map(belt => (
                        <TableRow key={belt.name}>
                          <TableCell>{belt.name}</TableCell>
                          <TableCell>{belt.achievedDate}</TableCell>
                          <TableCell className='text-right'>
                            {belt.beltDuration}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className='flex items-center gap-3'>
              <Button className='flex-1' variant='secondary' asChild>
                <Link href={editStudentPath}>Editar</Link>
              </Button>
              <DialogClose asChild>
                <Button type='button' className='flex-1'>
                  Fechar
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
