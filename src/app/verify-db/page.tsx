import { createClient } from '@/utils/supabase/server'
import { createTestTeam } from './actions'

export default async function VerifyDbPage() {
  const supabase = await createClient()
  const { data: teams, error } = await supabase.from('teams').select('*')

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Database Verification</h1>

      <div className="p-4 border rounded bg-zinc-900 border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Read Test (Server Client)</h2>
        {error ? (
           <div className="text-red-500">
             <p className="font-bold">Error connecting:</p>
             <pre>{JSON.stringify(error, null, 2)}</pre>
           </div>
        ) : (
          <div>
            <p className="text-green-500 font-bold mb-2">✅ Connection Successful</p>
            <p className="text-zinc-400 mb-2">Teams found: {teams?.length}</p>
            <ul className="list-disc list-inside space-y-1">
              {teams?.map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 border rounded bg-zinc-900 border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Write Test (Admin Client)</h2>
        <p className="mb-4 text-zinc-400">
          Click the button below to create a test team using the Secret Key.
        </p>
        <form action={createTestTeam}>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-medium"
          >
            Create 'Verification Team'
          </button>
        </form>
      </div>
    </div>
  )
}
