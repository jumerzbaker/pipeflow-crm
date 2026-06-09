'use server'

import { redirect } from 'next/navigation'
import * as z from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'

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

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error || !data.session) {
    if (error?.message.toLowerCase().includes('email not confirmed')) {
      return { errors: { email: ['Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'] } }
    }
    return { errors: { email: ['E-mail ou senha incorretos.'] } }
  }

  // Allow redirect to invite pages or other safe internal paths
  const next = formData.get('next')?.toString() ?? ''
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
  redirect(safeNext)
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

  const next = formData.get('next')?.toString() ?? ''
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/onboarding'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { name: result.data.name, full_name: result.data.name },
      emailRedirectTo: `${appUrl}/api/auth/callback?next=${encodeURIComponent(safeNext)}`,
    },
  })

  if (error) {
    return { errors: { email: [error.message] } }
  }

  // Session is null when email confirmation is required
  if (!data.session) {
    redirect('/verify-email')
  }

  redirect(safeNext)
}

export async function forgotPassword(state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const supabase = await getSupabaseServerClient()
  await supabase.auth.resetPasswordForEmail(result.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/reset-password`,
  })

  return { message: 'Se esse e-mail estiver cadastrado, você receberá as instruções em breve.' }
}

export async function logout(): Promise<void> {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ── Profile update actions ────────────────────────────────────────────────────

const UpdateNameSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }).trim(),
})

const UpdateEmailSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }).trim(),
})

const UpdatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres.' })
    .regex(/[a-zA-Z]/, { message: 'Senha deve conter pelo menos uma letra.' })
    .regex(/[0-9]/, { message: 'Senha deve conter pelo menos um número.' })
    .trim(),
})

export type ProfileActionResult = { error?: string; message?: string }

export async function updateProfile(data: { name: string }): Promise<ProfileActionResult> {
  const parsed = UpdateNameSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({
    data: { full_name: parsed.data.name },
  })

  if (error) return { error: 'Erro ao atualizar nome. Tente novamente.' }
  return {}
}

export async function updateEmail(data: { email: string }): Promise<ProfileActionResult> {
  const parsed = UpdateEmailSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ email: parsed.data.email })

  if (error) return { error: 'Erro ao solicitar troca de e-mail. Tente novamente.' }
  return { message: `E-mail de confirmação enviado para ${parsed.data.email}. Confirme para efetivar a troca.` }
}

export async function updatePassword(data: { password: string }): Promise<ProfileActionResult> {
  const parsed = UpdatePasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) return { error: 'Erro ao alterar senha. Tente novamente.' }
  return { message: 'Senha alterada com sucesso.' }
}
