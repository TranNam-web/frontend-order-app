'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  PlusCircle, 
  Table2, 
  Users, 
  Hash, 
  Info 
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import {
  CreateTableBody,
  CreateTableBodyType
} from '@/schemaValidations/table.schema'
import { TableStatus, TableStatusValues } from '@/constants/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAddTableMutation } from '@/queries/useTable'
import { toast } from '@/components/ui/use-toast'

export default function AddTable() {
  const [open, setOpen] = useState(false)
  const addTableMutation = useAddTableMutation()

  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden
    }
  })

  const reset = () => {
    form.reset()
  }

  const onSubmit = async (values: CreateTableBodyType) => {
    if (addTableMutation.isPending) return
    try {
      const result = await addTableMutation.mutateAsync(values)
      toast({
        description: result.payload.message
      })
      reset()
      setOpen(false)
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset()
        setOpen(value)
      }}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='h-9 gap-2 rounded-xl shadow-sm'
        >
          <PlusCircle className='h-4 w-4' />
          Thêm bàn
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[650px] rounded-2xl p-6 max-h-screen overflow-auto'>
        <DialogHeader className='space-y-3'>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            <Table2 className='h-5 w-5 text-primary' />
            Thêm bàn mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            id='add-table-form'
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={reset}
            className='grid gap-6'
          >
            {/* Table Number */}
            <FormField
              control={form.control}
              name='number'
              render={({ field }) => (
                <FormItem>
                  <Label className='flex items-center gap-2'>
                    <Hash className='h-4 w-4 text-muted-foreground' />
                    Số hiệu bàn
                  </Label>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập số hiệu bàn...'
                      className='rounded-xl'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity */}
            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <Label className='flex items-center gap-2'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    Sức chứa
                  </Label>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập số lượng khách...'
                      className='rounded-xl'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <Label className='flex items-center gap-2'>
                    <Info className='h-4 w-4 text-muted-foreground' />
                    Trạng thái
                  </Label>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='rounded-xl'>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {TableStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getVietnameseTableStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className='pt-4'>
          <Button
            type='submit'
            form='add-table-form'
            className='rounded-xl gap-2'
          >
            <PlusCircle className='h-4 w-4' />
            Thêm bàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}