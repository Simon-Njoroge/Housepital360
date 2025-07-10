import { useForm } from '@tanstack/react-form'
import { z, ZodObject } from 'zod'
import type { ZodTypeAny } from 'zod'

type FieldType = 'text' | 'email' | 'password' | 'checkbox' | 'select'

export type FieldConfig<T> = {
  name: keyof T & string
  label: string
  type: FieldType
  placeholder?: string
  inputClassName?: string
  buttonClassName?: string
  fieldClassName?: string
  options?: { label: string; value: string }[] // For select type
}

type DeepValue<T, K extends keyof T> = T[K]

type GenericFormProps<T extends ZodObject<any>> = {
  schema: T
  fields: FieldConfig<z.infer<T>>[]
  onSubmit: (data: z.infer<T>) => void
  initialValues?: Partial<z.infer<T>>
  submitButtonText?: string
  className?: string
  fieldClassName?: string
  inputClassName?: string
  buttonClassName?: string
  isSubmitting?: boolean
  isSubmittingText?: string
}

const validateField = <T,>(value: T, schema: ZodTypeAny) => {
  const result = schema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

export function GenericForm<T extends ZodObject<any>>({
  schema,
  fields,
  onSubmit,
  initialValues,
  className,
  fieldClassName,
  inputClassName,
  buttonClassName,
  submitButtonText,
  isSubmitting,
  isSubmittingText,
}: GenericFormProps<T>) {
  const defaultValues = Object.fromEntries(
    Object.keys(schema.shape).map((key) => [key, '']),
  )

  const form = useForm({
    defaultValues: { ...defaultValues, ...initialValues } as z.infer<T>,
    onSubmit: async ({ value }) => {
      const result = schema.safeParse(value)
      if (!result.success) {
        console.error('Validation error:', result.error.issues)
        return
      }

      await new Promise((r) => setTimeout(r, 2000))
      onSubmit(result.data)
      form.reset()
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className={className || 'space-y-4'}
    >
      {fields.map((field) => (
        <form.Field
          key={field.name}
          name={field.name}
          validators={{
            onChange: ({ value }) =>
              validateField(value, schema.shape[field.name]),
            onBlur: ({ value }) =>
              validateField(value, schema.shape[field.name]),
          }}
        >
          {(f) => (
            <div>
              <label
                className={
                  fieldClassName ||
                  'block text-sm font-medium text-gray-700 mb-1'
                }
              >
                {field.label}
              </label>

              {field.type === 'checkbox' ? (
                <label className={inputClassName || 'flex items-start'}>
                  <input
                    type="checkbox"
                    checked={Boolean(f.state.value)}
                    onBlur={f.handleBlur}
                    onChange={(e) =>
                      f.handleChange(
                        e.target.checked as DeepValue<
                          z.infer<T>,
                          typeof field.name
                        >,
                      )
                    }
                    className="mr-2 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    {field.placeholder}
                  </span>
                </label>
              ) : field.type === 'select' ? (
                <select
                  value={
                    f.state.value !== undefined && f.state.value !== null
                      ? String(f.state.value)
                      : ''
                  }
                  onBlur={f.handleBlur}
                  onChange={(e) =>
                    f.handleChange(
                      e.target.value as DeepValue<
                        z.infer<T>,
                        typeof field.name
                      >,
                    )
                  }
                  className={
                    inputClassName ||
                    `w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      f.state.meta.errors.length > 0
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-zinc-700'
                    }`
                  }
                >
                  <option value="">-- Select --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={String(f.state.value ?? '')}
                  onBlur={f.handleBlur}
                  onChange={(e) =>
                    f.handleChange(
                      e.target.value as DeepValue<
                        z.infer<T>,
                        typeof field.name
                      >,
                    )
                  }
                  className={
                    inputClassName ||
                    `w-full px-3 py-2 border rounded-md ${
                      f.state.meta.errors.length > 0
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`
                  }
                  placeholder={field.placeholder}
                />
              )}

              {f.state.meta.errors.length > 0 && (
                <p className="mt-1 text-sm text-red-600">
                  {String(f.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      ))}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className={
              buttonClassName ||
              `w-full py-2 px-4 rounded-md ${
                canSubmit
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`
            }
          >
            {isSubmitting ? isSubmittingText : submitButtonText || 'Submit'}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}

export default GenericForm
