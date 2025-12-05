'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createTestTeam() {
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('teams')
    .insert({
      name: 'Verification Team',
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/verify-db')
  return { success: true, data }
}
