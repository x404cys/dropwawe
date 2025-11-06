interface InfoAlertProps {
  message: string
  submessage?: string
  variant?: "info" | "warning"
}

export function InfoAlert({ message, submessage, variant = "info" }: InfoAlertProps) {
  const isWarning = variant === "warning"

  return (
    <div
      className={`flex items-center rounded-lg border p-4 text-sm ${
        isWarning
          ? "border-green-600 border-s-4 bg-green-50 text-green-600"
          : "border-gray-300 bg-gray-50 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
      role="alert"
    >
      <svg
        className="me-3 inline h-4 w-4 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div>
        <span className={`text-sm font-medium ${isWarning ? "text-green-600" : ""}`}>
          {message}
          {submessage && (
            <>
              <br />
              <span className="text-xs text-gray-400">{submessage}</span>
            </>
          )}
        </span>
      </div>
    </div>
  )
}
