import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'


interface Team {
    id: string
    name: string
    avatar_url: string | null
}

interface TeamMember {
    role: 'member' | 'manager' | 'admin'
    team: Team
}

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch teams
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select(`
      role,
      team:teams (
        id,
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id)

  const teams = (teamMembers as unknown as TeamMember[])?.map((tm) => ({
    role: tm.role,
    ...tm.team,
  })) || []

  // Check if user is system admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isSystemAdmin = profile?.is_admin ?? false

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sva-dark tracking-tight">Meine Teams</h1>
      </header>

      <main>
        {teams.length === 0 ? (
           <div className="flex flex-col items-center justify-center rounded-sm border border-gray-200 bg-white py-20 text-center shadow-lg">
             <div className="mb-4 rounded-full bg-sva-green/10 p-4">
               <Plus className="h-8 w-8 text-sva-green" />
             </div>
             <h3 className="mb-2 text-xl font-semibold text-sva-dark">Noch keine Teams</h3>
             <p className="mb-6 text-gray-500 max-w-sm">Tritt einem Team bei{isSystemAdmin ? ' oder erstelle ein neues' : ''}, um anzufangen.</p>
             {isSystemAdmin && (
              <Link
                href="/teams/create"
                className="rounded-sm bg-sva-green px-6 py-2.5 font-medium text-white transition hover:bg-green-800 shadow-md"
              >
                Neues Team erstellen
              </Link>
             )}
           </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {/* Team Cards */}
             {teams.map((team) => (
               <Link 
                 key={team.id} 
                 href={`/teams/${team.id}`}
                 className="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-6 transition hover:shadow-md hover:border-sva-green"
               >
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-sm bg-sva-green/10 flex items-center justify-center text-lg font-bold text-sva-green">
                     {team.name[0].toUpperCase()}
                   </div>
                   <div>
                     <h3 className="font-semibold text-sva-dark group-hover:text-sva-green transition-colors">{team.name}</h3>
                     <span className="text-sm text-gray-500 capitalize">{team.role}</span>
                   </div>
                 </div>
               </Link>
             ))}
              {isSystemAdmin && (
               <Link
                href="/teams/create"
                className="flex h-full min-h-[100px] flex-col items-center justify-center rounded-sm border border-dashed border-gray-300 bg-transparent p-6 transition hover:border-sva-green hover:bg-sva-green/5 group"
               >
                <Plus className="mb-2 h-6 w-6 text-gray-400 group-hover:text-sva-green transition-colors" />
                <span className="text-sm font-medium text-gray-500 group-hover:text-sva-green transition-colors">Team erstellen</span>
               </Link>
              )}
          </div>
        )}
      </main>
    </>
  )
}
