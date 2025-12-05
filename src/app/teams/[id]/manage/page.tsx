import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wallet } from 'lucide-react'
import { recordPayment } from '@/app/teams/actions'

export default async function ManagerPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const teamId = (await params).id // Async access

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Verify Manager Role
  const { data: memberData, error } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (error || !memberData || !['manager', 'admin'].includes(memberData.role)) {
      redirect(`/teams/${teamId}`)
  }

  // 2. Fetch Members & Transactions
  const { data: members } = await supabase
    .from('team_members')
    .select(`
        user_id,
        role,
        profile:profiles(full_name, email)
    `)
    .eq('team_id', teamId)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('user_id, type, payment_amount, product_price:product_prices(price)')
    .eq('team_id', teamId)

  // 3. Calculate Balances
  const memberBalances = (members || []).map((m: any) => {
      const userTx = (transactions || []).filter((t: any) => t.user_id === m.user_id)
      const balance = userTx.reduce((acc: number, t: any) => {
          if (t.type === 'purchase') {
              return acc - (t.product_price?.price || 0)
          } else {
              return acc + (t.payment_amount || 0)
          }
      }, 0)
      return {
          userId: m.user_id,
          name: m.profile?.full_name || m.profile?.email || 'Unknown',
          role: m.role,
          balance
      }
  })

  const formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

  return (
    <div className="min-h-screen bg-zinc-950 p-4 font-sans text-white">
        <header className="mb-8 flex items-center gap-4">
             <Link href={`/teams/${teamId}`} className="rounded-full bg-white/5 p-2 transition hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Manage Team</h1>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold">Member Balances</h2>
            </div>
            <div className="divide-y divide-white/5">
                {memberBalances.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition">
                        <div>
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-xs text-zinc-500 capitalize">{member.role}</p>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className={`font-mono font-bold ${member.balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {formatter.format(member.balance)}
                            </span>
                            
                            {/* Simple Payment Form for Demo - Needs Client Component for interactivity ideally */}
                            {/* We'll use a fixed amount buttons or single button to 'Settle' (pay full debt) */}
                             {member.balance < 0 && (
                                 <form action={async () => {
                                     'use server'
                                     await recordPayment(teamId, member.userId, Math.abs(member.balance))
                                 }}>
                                    <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500">
                                        Settle <Wallet className="inline ml-1 h-3 w-3" />
                                    </button>
                                 </form>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
