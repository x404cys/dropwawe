import { Input } from '@/components/ui/input';

interface CustomInputProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function CustomInput({
  label,
  required,
  placeholder,
  type = 'text',
  icon,
  value,
  disabled,
  onChange,
}: CustomInputProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="rounded-md border-gray-300 pr-3 pl-10 focus:border-green-400 focus:ring-green-400"
        />
        {icon && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-700">{icon}</span>
        )}
      </div>
    </div>
  );
}
