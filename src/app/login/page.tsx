import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 font-sans text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl"></div>
        
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Willkommen zurück
        </h2>
        
        <form className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-400">E-Mail</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="rounded-lg border border-white/10 bg-black/20 p-3 text-white placeholder-zinc-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder="deine@email.de"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-400">Passwort</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="rounded-lg border border-white/10 bg-black/20 p-3 text-white placeholder-zinc-500 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <button 
              formAction={login} 
              className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 p-3 font-semibold text-white shadow-lg transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/25 active:scale-[0.98]"
            >
              Anmelden
            </button>
            <button 
              formAction={signup} 
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-zinc-300 transition-all hover:bg-white/10 active:scale-[0.98]"
            >
              Registrieren
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
