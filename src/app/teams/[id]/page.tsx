import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { ProductCard } from '@/components/drinks/ProductCard'

// Types
interface Product {
    id: string
    name: string
    image_url: string | null
    price: number
    price_id: string
}

interface Transaction {
    id: string
    created_at: string
    type: 'purchase' | 'payment'
    amount: number
    product_name?: string
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const teamId = (await params).id // Next.js 15 params are async? Or wait, in 15 yes.

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Verify Membership & Fetch Team
  const { data: memberData, error: memberError } = await supabase
    .from('team_members')
    .select('role, team:teams(*)')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single()

  if (memberError || !memberData) {
      redirect('/dashboard') // Not a member
  }

  const team = memberData.team as any

  // 2. Fetch Active Products & Current Prices
  // This is complex. Product -> ProductPrices (latest).
  // Simplification: We need a query that gets products and their *latest* price.
  // For now, let's just fetch all products and their prices, and sort in JS.
  const { data: productsData } = await supabase
    .from('products')
    .select(`
        id, name, image_url,
        product_prices ( id, price, valid_from )
    `)
    .eq('team_id', teamId)
    .eq('active', true)

  const products: Product[] = (productsData || []).map((p: any) => {
      // Find latest price
      const latestPrice = p.product_prices.sort((a: any, b: any) => new Date(b.valid_from).getTime() - new Date(a.valid_from).getTime())[0]
      return {
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          price: latestPrice ? latestPrice.price : 0,
          price_id: latestPrice ? latestPrice.id : null
      }
  }).filter(p => p.price_id) // Only products with prices

  // 3. Calculate Balance & Fetch History
  const { data: transactionsData } = await supabase
    .from('transactions')
    .select(`
        id, created_at, type, payment_amount,
        product_price:product_prices ( price, product:products ( name ) )
    `)
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const transactions: Transaction[] = (transactionsData || []).map((t: any) => {
      let amount = 0
      let product_name = undefined
      if (t.type === 'purchase') {
          amount = -(t.product_price?.price || 0)
          product_name = t.product_price?.product?.name
      } else {
          amount = t.payment_amount || 0
      }
      return {
          id: t.id,
          created_at: t.created_at,
          type: t.type,
          amount,
          product_name
      }
  })

  // Balance = Sum of amounts
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0)
  
  const formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

  return (
    <div className="min-h-screen bg-zinc-950 p-4 pb-24 md:p-8 font-sans text-white">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
             <Link href="/dashboard" className="text-zinc-400 hover:text-white transition">
                <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">{team.name}</h1>
            <div className={`px-4 py-2 rounded-full font-mono font-bold ${balance < 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {formatter.format(balance)}
            </div>
        </header>

        {/* Drink Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {products.map(product => (
                 <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    priceId={product.price_id}
                    teamId={teamId}
                    formatter={formatter}
                 />
            ))}
            {/* Admin Add Product Link */}
            {['manager', 'admin'].includes(memberData.role) && (
                <Link href={`/teams/${teamId}/manage`} className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-transparent p-4 transition hover:bg-white/5">
                    <Plus className="mb-2 h-8 w-8 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-500">Team verwalten</span>
                </Link>
            )}
        </div>

        {/* Recent History */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-semibold">Letzte Aktivitäten</h3>
            <div className="space-y-4">
                {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                        <div>
                            <p className="font-medium">{t.type === 'purchase' ? t.product_name : 'Einzahlung'}</p>
                            <p className="text-xs text-zinc-500">{new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString()}</p>
                        </div>
                        <span className={`font-mono font-medium ${t.type === 'purchase' ? 'text-red-400' : 'text-green-400'}`}>
                            {t.type === 'purchase' ? '-' : '+'}{formatter.format(Math.abs(t.amount))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}
