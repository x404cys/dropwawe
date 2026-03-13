'use client';
// src/components/template-editor/ui/ColorPicker.tsx
// Native color input wrapped in a styled card with label + hex display.

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 bg-muted/20 rounded-xl p-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent"
      />
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[9px] font-mono text-foreground" dir="ltr">
          {value}
        </p>
      </div>
    </div>
  );
}
