import { cn } from '@/lib/utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export function Dialog(props: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Dialog {...props} />
}

export function DialogTrigger(props: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.DialogTrigger {...props} />
}

// export function DialogClose(props: DialogPrimitive.DialogCloseProps) {
//   return <DialogPrimitive.DialogClose {...props} />
// }
export const DialogClose = DialogPrimitive.Close

export function DialogPortal(props: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.DialogPortal {...props} />
}

export function DialogOverlay(props: DialogPrimitive.DialogOverlayProps) {
  return (
    <DialogPrimitive.DialogOverlay
      {...props}
      className={cn(
        'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'duration-300'
      )}
    />
  )
}

export function DialogContent(props: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.DialogContent
        {...props}
        className={cn(
          'fixed z-50 right-0 top-0 bottom-0 w-[500px] h-screen border-l border-input bg-secondary p-8',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full',
          'duration-300 ease-in-out'
        )}
      />
    </DialogPortal>
  )
}

export function DialogTitle(props: DialogPrimitive.DialogTitleProps) {
  return (
    <DialogPrimitive.DialogTitle {...props} className='text-lg font-semibold' />
  )
}

export function DialogDescription(
  props: DialogPrimitive.DialogDescriptionProps
) {
  return (
    <DialogPrimitive.DialogDescription
      {...props}
      className='text-muted-foreground text-sm leading-relaxed'
    />
  )
}
