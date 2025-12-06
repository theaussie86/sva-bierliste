import { createTeam } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function CreateTeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // No global admin check needed. 


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sva-light p-4 font-sans text-sva-dark">
        <div className="w-full max-w-md">
            <Link href="/dashboard" className="mb-6 flex items-center text-gray-500 hover:text-sva-green transition">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück zum Dashboard
            </Link>
            
            <div className="relative overflow-hidden rounded-sm border border-gray-200 bg-white p-8 shadow-lg">
                
                <h1 className="mb-2 text-2xl font-bold">Neues Team erstellen</h1>
                <p className="mb-6 text-gray-600 text-sm">Erstelle eine neue Gruppe, um Getränke und Zahlungen zu verwalten.</p>
                
                <form action={createTeam} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Team Name</label>
                        <input 
                            id="name" 
                            name="name" 
                            type="text" 
                            required 
                            minLength={3}
                            placeholder="z.B. 1. Mannschaft, Alte Herren..." 
                            className="rounded-sm border border-gray-300 bg-white p-3 text-sva-dark placeholder-gray-400 outline-none focus:border-sva-green focus:ring-1 focus:ring-sva-green transition-all"
                        />
                    </div>
                    
                    <button 
                         type="submit"
                        className="mt-2 w-full rounded-sm bg-sva-green p-3 font-semibold text-white transition hover:bg-green-800 shadow-md active:scale-[0.98]"
                    >
                        Team erstellen
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}
