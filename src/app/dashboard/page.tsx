import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus } from 'lucide-react'
import { signout } from '@/app/login/actions'

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

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">My Teams</h1>
        <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm hidden md:inline">{user.email}</span>
            <form action={signout}>
              <button className="rounded-full bg-white/5 p-2 transition hover:bg-white/10 hover:text-red-400">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
        </div>
      </header>

      <main>
        {teams.length === 0 ? (
           <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-20 text-center backdrop-blur-sm">
             <div className="mb-4 rounded-full bg-blue-500/20 p-4">
               <Plus className="h-8 w-8 text-blue-400" />
             </div>
             <h3 className="mb-2 text-xl font-semibold text-white">No teams yet</h3>
             <p className="mb-6 text-zinc-400 max-w-sm">Join an existing team or create a new one to start tracking drinks.</p>
             <Link
               href="/teams/create"
               className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-500 shadow-lg shadow-blue-500/20"
             >
               Create New Team
             </Link>
           </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {/* Team Cards */}
             {teams.map((team) => (
               <Link 
                 key={team.id} 
                 href={`/teams/${team.id}`}
                 className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10 hover:border-white/20"
               >
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                     {team.name[0].toUpperCase()}
                   </div>
                   <div>
                     <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{team.name}</h3>
                     <span className="text-sm text-zinc-400 capitalize">{team.role}</span>
                   </div>
                 </div>
               </Link>
             ))}
              <Link
               href="/teams/create"
               className="flex h-full min-h-[100px] flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-transparent p-6 transition hover:border-blue-500/50 hover:bg-blue-500/10 group"
             >
               <Plus className="mb-2 h-6 w-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
               <span className="text-sm font-medium text-zinc-500 group-hover:text-blue-400 transition-colors">Create Team</span>
             </Link>
          </div>
        )}
      </main>
    </div>
  )
}
