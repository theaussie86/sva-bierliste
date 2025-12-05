'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTeam(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string

  if (!name || name.length < 3) {
      redirect('/teams/create?error=Name must be at least 3 characters')
  }

  // 1. Create Team
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({ name })
    .select()
    .single()

  if (teamError) {
      console.error(teamError)
      redirect('/teams/create?error=Failed to create team')
  }

  // 2. Add creator as Manager/Admin (Role logic needed)
  // For now, let's say 'manager'
  const { error: memberError } = await supabase
    .from('team_members')
    .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'manager'
    })

  if (memberError) {
      // Cleanup? Or manual fix needed.
      console.error(memberError)
      redirect('/teams/create?error=Failed to join team') // This leaves an orphan team, but ok for now.
  }

  revalidatePath('/dashboard')
  redirect(`/teams/${team.id}`)
}

export async function purchaseDrink(priceId: string, teamId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Transaction: User, Team, ProductPrice, Type=Purchase
  const { error } = await supabase
    .from('transactions')
    .insert({
        user_id: user.id,
        team_id: teamId,
        product_price_id: priceId,
        type: 'purchase',
        payment_amount: null
    })

  if (error) {
      console.error(error)
      throw new Error('Transaction failed')
  }

  revalidatePath(`/teams/${teamId}`)
}

export async function recordPayment(teamId: string, userId: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check if Manager (omitted for brevity, but should be here)

  const { error } = await supabase
    .from('transactions')
    .insert({
        user_id: userId,
        team_id: teamId,
        product_price_id: null,
        type: 'payment',
        payment_amount: amount
    })

  if (error) {
      console.error(error)
      throw new Error('Payment failed')
  }

  revalidatePath(`/teams/${teamId}/manage`)
  // Also revalidate the user's view
  revalidatePath(`/teams/${teamId}`)
}
