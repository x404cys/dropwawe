import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ManagementCard2Props {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: ReactNode;
  buttonVariant?: 'default' | 'outline' | 'ghost' | 'link';
  onClick?: () => void;
}

export default function ManagementCard2({
  title,
  description,
  buttonText,
  buttonIcon,
  buttonVariant = 'default',
  onClick,
}: ManagementCard2Props) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="space-y-2 p-5">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div>
          <Button
            variant={buttonVariant}
            className="cursor-pointer items-center gap-2"
            onClick={onClick}
          >
            {buttonText} {buttonIcon}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
