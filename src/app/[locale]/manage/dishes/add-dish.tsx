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
import { PlusCircle, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils'
import {
  CreateDishBody,
  CreateDishBodyType
} from '@/schemaValidations/dish.schema'
import { DishStatus, DishStatusValues } from '@/constants/type'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAddDishMutation } from '@/queries/useDish'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { toast } from '@/components/ui/use-toast'
import revalidateApiRequest from '@/apiRequests/revalidate'

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const addDishMutation = useAddDishMutation()
  const uploadMediaMutation = useUploadMediaMutation()
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable
    }
  })

  const image = form.watch('image')
  const name = form.watch('name')

  const previewAvatarFromFile = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    return image
  }, [file, image])

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: CreateDishBodyType) => {
    if (addDishMutation.isPending) return
    try {
      let body = values
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult =
          await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = {
          ...values,
          image: imageUrl
        }
      }

      const result = await addDishMutation.mutateAsync(body)
      await revalidateApiRequest('dishes')

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
        <Button size='sm' className='h-8 gap-2 rounded-lg shadow-sm'>
          <PlusCircle className='h-4 w-4' />
          Thêm món ăn
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[720px] p-0 overflow-hidden rounded-2xl'>
        <DialogHeader className='px-6 py-4 border-b bg-muted/40'>
          <DialogTitle className='text-lg font-semibold'>
            Thêm món ăn mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            id='add-dish-form'
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={reset}
            className='px-6 py-6 space-y-6'
          >
            {/* IMAGE */}
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-6'>
                    <Avatar className='w-28 h-28 rounded-xl border shadow-sm'>
                      <AvatarImage src={previewAvatarFromFile} />
                      <AvatarFallback className='rounded-xl text-sm'>
                        {name || 'Ảnh món ăn'}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col gap-3'>
                      <input
                        type='file'
                        accept='image/*'
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange(
                              'http://localhost:3000/' + file.name
                            )
                          }
                        }}
                        className='hidden'
                      />

                      <Button
                        type='button'
                        variant='outline'
                        className='gap-2'
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4' />
                        Tải ảnh lên
                      </Button>

                      <p className='text-xs text-muted-foreground'>
                        JPG, PNG dưới 5MB
                      </p>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* NAME */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <Label>Tên món ăn</Label>
                  <FormControl>
                    <Input
                      placeholder='Ví dụ: Cơm gà xối mỡ'
                      className='h-11'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PRICE */}
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <Label>Giá (VNĐ)</Label>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Nhập giá món ăn'
                      className='h-11'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <Label>Mô tả</Label>
                  <FormControl>
                    <Textarea
                      placeholder='Mô tả chi tiết về món ăn...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <Label>Trạng thái</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='h-11'>
                        <SelectValue placeholder='Chọn trạng thái' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DishStatusValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getVietnameseDishStatus(status)}
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

        <DialogFooter className='px-6 py-4 border-t bg-muted/40'>
          <Button
            type='submit'
            form='add-dish-form'
            className='w-full h-11 text-base font-medium'
          >
            Thêm món ăn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}