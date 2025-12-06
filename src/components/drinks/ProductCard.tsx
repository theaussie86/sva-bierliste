'use client'

import { useFormStatus } from 'react-dom'
import { purchaseDrink } from '@/app/(sidebar)/teams/actions'

interface ProductCardProps {
    id: string
    name: string
    price: number
    priceId: string
    teamId: string
    formatter: Intl.NumberFormat
}

export function ProductCard({ id, name, price, priceId, teamId, formatter }: ProductCardProps) {
    const purchaseWithId = purchaseDrink.bind(null, priceId, teamId)

    return (
        <form action={purchaseWithId}>
            <SubmitButton name={name} price={price} formatter={formatter} />
        </form>
    )
}

function SubmitButton({ name, price, formatter }: { name: string, price: number, formatter: Intl.NumberFormat }) {
    const { pending } = useFormStatus()
    
    return (
        <button 
            disabled={pending}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="mb-3 h-32 w-full rounded-xl bg-zinc-900/50 object-cover flex items-center justify-center text-4xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                {pending ? (
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                ) : '🍺'}
            </div>
            <h3 className="font-semibold text-white">{name}</h3>
            <p className="text-blue-400 font-bold font-mono">{formatter.format(price)}</p>
        </button>
    )
}
