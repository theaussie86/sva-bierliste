import { createTeam } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreateTeamPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 font-sans text-white">
        <div className="w-full max-w-md">
            <Link href="/dashboard" className="mb-6 flex items-center text-zinc-400 hover:text-white transition">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
            
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>
                
                <h1 className="mb-2 text-2xl font-bold">Create New Team</h1>
                <p className="mb-6 text-zinc-400 text-sm">Start a new group to track drinks and payments.</p>
                
                <form action={createTeam} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-zinc-300">Team Name</label>
                        <input 
                            id="name" 
                            name="name" 
                            type="text" 
                            required 
                            minLength={3}
                            placeholder="e.g. 1st Team, Old Boys..." 
                            className="rounded-lg border border-white/10 bg-black/20 p-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    
                    <button 
                         type="submit"
                        className="mt-2 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    >
                        Create Team
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
