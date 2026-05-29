interface FieldErrorProps {
  id: string
  errors?: string[]
}

export function FieldError({ id, errors }: FieldErrorProps) {
  if (!errors?.length) return null
  return (
    <ul id={id} className="space-y-0.5" role="alert">
      {errors.map((error) => (
        <li key={error} className="text-xs text-destructive">
          {error}
        </li>
      ))}
    </ul>
  )
}
