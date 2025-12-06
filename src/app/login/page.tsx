import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sva-light p-4 font-sans text-sva-dark">
      <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-gray-200 bg-white p-8 shadow-lg">
        
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-sva-dark">
          Willkommen zurück
        </h2>
        
        <form className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">E-Mail</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="rounded-sm border border-gray-300 bg-white p-3 text-sva-dark placeholder-gray-400 outline-none focus:border-sva-green focus:ring-1 focus:ring-sva-green transition-all"
              placeholder="deine@email.de"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Passwort</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="rounded-sm border border-gray-300 bg-white p-3 text-sva-dark placeholder-gray-400 outline-none focus:border-sva-green focus:ring-1 focus:ring-sva-green transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="mt-4 flex flex-col gap-3">
            <button 
              formAction={login} 
              className="group relative flex w-full justify-center rounded-sm bg-sva-green p-3 font-semibold text-white shadow-md transition-all hover:bg-green-800 active:scale-[0.98]"
            >
              Anmelden
            </button>
            <button 
              formAction={signup} 
              className="w-full rounded-sm border border-gray-300 bg-white p-3 text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              Registrieren
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
