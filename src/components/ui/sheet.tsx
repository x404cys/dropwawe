'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

// ======= Wrappers =======
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />;
}

// ======= Overlay =======
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-50',
        className
      )}
      {...props}
    />
  );
}

// ======= Content =======
function SheetContent({
  className,
  children,
  side = 'bottom',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col gap-4 rounded-t-2xl bg-white/95 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-in-out sm:rounded-xl',
          side === 'bottom' &&
            'inset-x-0 bottom-0 max-h-[90vh] translate-y-full data-[state=open]:translate-y-0 sm:max-h-[80vh]',
          side === 'top' &&
            'inset-x-0 top-0 max-h-[90vh] data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0',
          side === 'right' && 'inset-y-0 right-0 w-3/4 border-l sm:max-w-sm',
          side === 'left' && 'inset-y-0 left-0 w-3/4 border-r sm:max-w-sm',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 rounded-full p-1 transition-opacity hover:bg-gray-200">
          <XIcon className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

// ======= Header =======
function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 border-b border-gray-200 p-4', className)}
      {...props}
    />
  );
}

// ======= Footer =======
function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('mt-auto flex flex-col gap-2 border-t border-gray-200 p-4', className)}
      {...props}
    />
  );
}

// ======= Title =======
function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      className={cn('text-lg font-semibold text-gray-900', className)}
      {...props}
    />
  );
}

// ======= Description =======
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description className={cn('text-sm text-gray-500', className)} {...props} />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
