'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  TrophyIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { signout } from '@/app/login/actions'

const navigation = [
  { name: 'Übersicht', href: '/dashboard', icon: HomeIcon },
  // { name: 'Mannschaften', href: '/dashboard/teams', icon: UsersIcon }, // Currently Dashboard IS teams
  // Add placeholder links for now based on context (Drinks PWA)
  // { name: 'Getränkeliste', href: '/drinks', icon: ClipboardDocumentListIcon },
  // { name: 'Finanzen', href: '/finance', icon: CreditCardIcon },
]

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

interface DashboardShellProps {
  children: React.ReactNode
  user: {
    email?: string
  }
  teams: {
    id: string
    name: string
    href: string
    initial: string
  }[]
}

export default function DashboardShell({ children, user, teams }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component for Mobile */}
              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-sva-dark px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center gap-2">
                  <div className="relative h-8 w-8">
                     <Image
                        src="/logo.png"
                        alt="SV Amendingen Logo"
                        fill
                        className="object-contain"
                     />
                  </div>
                  <span className="font-bold text-white">SV Amendingen</span>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                           const isActive = pathname === item.href
                           return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? 'bg-sva-green text-white'
                                  : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive
                                    ? 'text-white'
                                    : 'text-gray-400 group-hover:text-white',
                                  'size-6 shrink-0',
                                )}
                              />
                              {item.name}
                            </Link>
                          </li>
                        )})}
                      </ul>
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-gray-400">Deine Teams</div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <Link
                              href={team.href}
                              className={classNames(
                                pathname === team.href
                                  ? 'bg-sva-green text-white'
                                  : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                              )}
                            >
                              <span
                                className={classNames(
                                  pathname === team.href
                                    ? 'border-white text-white'
                                    : 'border-gray-200 text-gray-400 group-hover:border-white group-hover:text-white',
                                  'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white/5 text-[0.625rem] font-medium',
                                )}
                              >
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white bg-white/5 rounded-md">
                                <span className="sr-only">Your profile</span>
                                <span className="truncate">{user.email}</span>
                             </div>
                             <form action={signout}>
                                <button type="submit" className="w-full rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20">
                                    Ausloggen
                                </button>
                             </form>
                        </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sva-dark px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
               <div className="relative h-10 w-10">
                 <Image
                    src="/logo.png"
                    alt="SV Amendingen Logo"
                    fill
                    className="object-contain"
                 />
               </div>
               <span className="font-bold text-xl text-white">SV Amendingen</span>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                       const isActive = pathname === item.href
                       return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? 'bg-sva-green text-white'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive
                                ? 'text-white'
                                : 'text-gray-400 group-hover:text-white',
                              'size-6 shrink-0',
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    )})}
                  </ul>
                </li>
                <li>
                  <div className="text-xs/6 font-semibold text-gray-400">Deine Teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <Link
                          href={team.href}
                          className={classNames(
                            pathname === team.href
                              ? 'bg-sva-green text-white'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          )}
                        >
                          <span
                            className={classNames(
                              pathname === team.href
                                ? 'border-white text-white'
                                : 'border-gray-200 text-gray-400 group-hover:border-white group-hover:text-white',
                              'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white/5 text-[0.625rem] font-medium',
                            )}
                          >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                
                <li className="-mx-6 mt-auto px-6">
                    <div className="flex items-center justify-between gap-x-4 py-3 text-sm/6 font-semibold text-white border-t border-white/10">
                        <div className='flex items-center gap-2 overflow-hidden'>
                             {/* Initials avatar */}
                             <div className="h-8 w-8 rounded-full bg-sva-green flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {user.email?.charAt(0).toUpperCase()}
                             </div>
                             <span className="truncate" title={user.email}>
                                {user.email}
                             </span>
                        </div>
                        <form action={signout}>
                             <button type="submit" title="Ausloggen" className="text-gray-400 hover:text-red-600 transition-colors">
                                <span className="sr-only">Ausloggen</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 2.062-5M12 12h9" />
</svg>

                             </button>
                        </form>
                    </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Top header for mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-sva-dark px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-white hover:text-gray-300 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-white">Dashboard</div>
          <div className="h-8 w-8 rounded-full bg-sva-green flex items-center justify-center text-white text-xs font-bold">
               {user.email?.charAt(0).toUpperCase()}
          </div>
        </div>

        <main className="lg:pl-72">
          <div className="px-4 py-10 sm:px-6 lg:px-8">
              {children}
          </div>
        </main>
      </div>
    </>
  )
}
