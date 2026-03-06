'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  UpdateDishBody,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'
import { DishStatus, DishStatusValues } from '@/constants/type'
import { Textarea } from '@/components/ui/textarea'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { useGetDishQuery, useUpdateDishMutation } from '@/queries/useDish'
import { toast } from '@/components/ui/use-toast'
import revalidateApiRequest from '@/apiRequests/revalidate'

export default function EditDish({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadMediaMutation = useUploadMediaMutation()
  const updateDishMutation = useUpdateDishMutation()
  const { data } = useGetDishQuery({ enabled: Boolean(id), id: id as number })

  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
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

  useEffect(() => {
    if (data) {
      const { name, image, description, price, status } = data.payload.data
      form.reset({
        name,
        image: image ?? undefined,
        description,
        price,
        status
      })
    }
  }, [data, form])

  const onSubmit = async (values: UpdateDishBodyType) => {
    if (updateDishMutation.isPending) return
    try {
      let body: UpdateDishBodyType & { id: number } = {
        id: id as number,
        ...values
      }

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadImageResult =
          await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = uploadImageResult.payload.data
        body = {
          ...body,
          image: imageUrl
        }
      }

      const result = await updateDishMutation.mutateAsync(body)
      await revalidateApiRequest('dishes')

      toast({
        description: result.payload.message
      })

      reset()
      onSubmitSuccess && onSubmitSuccess()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  const reset = () => {
    setId(undefined)
    setFile(null)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) reset()
      }}
    >
      <DialogContent className='sm:max-w-[720px] p-0 overflow-hidden rounded-2xl'>
        <DialogHeader className='px-6 py-4 border-b bg-muted/40'>
          <DialogTitle className='text-lg font-semibold'>
            Cập nhật món ăn
          </DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            Các trường bắt buộc: Tên, Ảnh
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            id='edit-dish-form'
            onSubmit={form.handleSubmit(onSubmit)}
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
                        Tải ảnh mới
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
                      placeholder='Nhập tên món ăn'
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
                      placeholder='Nhập giá'
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
                      placeholder='Mô tả chi tiết món ăn...'
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
                    value={field.value}
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
            form='edit-dish-form'
            className='w-full h-11 text-base font-medium'
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}