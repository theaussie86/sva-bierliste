import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch teams for sidebar
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select(`
      team:teams (
        id,
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id)

  const teams = teamMembers?.map((tm: any) => ({
    id: tm.team.id,
    name: tm.team.name,
    href: `/teams/${tm.team.id}`,
    initial: tm.team.name.charAt(0).toUpperCase(),
    current: false, // We can handle active state in client component
  })) || []

  return (
    <DashboardShell user={{ email: user.email }} teams={teams}>
      {children}
    </DashboardShell>
  )
}
