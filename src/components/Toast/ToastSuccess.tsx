import { toast } from 'sonner';
import { Check } from 'lucide-react';

export const showSuccessToast = (title: string, description?: string) => {
  const duration = 4000;

  toast.custom(
    (id) => (
      <div className="relative w-[320px] overflow-hidden rounded-xl border border-emerald-500/20 bg-white p-4 shadow-lg dark:bg-neutral-900">

        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <Check size={18} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {title}
            </p>

            {description && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>

          <button
            onClick={() => toast.dismiss(id)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* progress */}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-emerald-500/20">
          <div
            className="h-full bg-emerald-500"
            style={{
              width: '100%',
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    ),
    { duration }
  );
};