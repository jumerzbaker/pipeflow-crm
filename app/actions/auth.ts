'use server'

import { redirect } from 'next/navigation'
import * as z from 'zod'

const LoginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }).trim(),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }).trim(),
})

const SignupSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }).trim(),
  email: z.string().email({ message: 'E-mail inválido.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres.' })
    .regex(/[a-zA-Z]/, { message: 'Senha deve conter pelo menos uma letra.' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número.' })
    .trim(),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }).trim(),
})

export type AuthFormState =
  | {
      errors?: Record<string, string[]>
      message?: string
    }
  | undefined

export async function login(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  redirect('/dashboard')
}

export async function signup(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  redirect('/onboarding')
}

const OnboardingSchema = z.object({
  workspaceName: z
    .string()
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres.' })
    .trim(),
})

export async function createWorkspace(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = OnboardingSchema.safeParse({
    workspaceName: formData.get('workspaceName'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  redirect('/dashboard')
}

export async function forgotPassword(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  return { message: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' }
}
