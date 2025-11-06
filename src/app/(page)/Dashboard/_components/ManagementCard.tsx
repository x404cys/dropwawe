import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ManagementCardProps {
  title: string;
  description: string;
  button1Text: string;
  button1Icon?: ReactNode;
  button1Variant?: 'default' | 'outline' | 'ghost' | 'link';
  onButton1Click?: () => void;

  button2Text: string;
  button2Icon?: ReactNode;
  button2Variant?: 'default' | 'outline' | 'ghost' | 'link';
  onButton2Click?: () => void;
}

export default function ManagementCard({
  title,
  description,
  button1Text,
  button1Icon,
  button1Variant = 'default',
  onButton1Click,

  button2Text,
  button2Icon,
  button2Variant = 'default',
  onButton2Click,
}: ManagementCardProps) {
  return (
    <div className="border rounded-lg border-gray-200 shadow-sm">
      <CardContent className="space-y-8 p-4">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex gap-2">
          <Button
            variant={button1Variant}
            className="cursor-pointer gap-2"
            onClick={onButton1Click}
          >
            {button1Text} {button1Icon}
          </Button>
          <Button
            variant={button2Variant}
            className="cursor-pointer gap-2"
            onClick={onButton2Click}
          >
            {button2Text} {button2Icon}
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
