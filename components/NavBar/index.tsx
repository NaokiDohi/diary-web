import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames } from '../../assets/classOperation'
import auth from '../../assets/auth'
import { useRouter } from 'next/router'

const Logo = dynamic(() => import('./Logo'))
const NavLink = dynamic(() => import('./NavLink'))
const NotificationIcon = dynamic(() => import('../NotificationIcon'))
const LoggedInMenu = dynamic(() => import('./LoggedInMenu'))

type NavigationType = {
  name: string
  href: string
  current: boolean
}

export default function NavBar() {
  const guestRoutes = [
    { name: 'Events', href: '/', current: true },
    { name: 'Login', href: '/login', current: false },
    { name: 'Register', href: '/register', current: false },
  ]
  const authRoutes = [{ name: 'Events', href: '/', current: true }]

  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [navigation, setNavigation] = useState<NavigationType[]>(
    isLoggedIn ? authRoutes : guestRoutes
  )

  useEffect(() => {
    const authStatus = new auth()
    authStatus.checkAuthStatus(setIsLoggedIn)
  }, [])

  useEffect(() => {
    setNavigation(isLoggedIn ? authRoutes : guestRoutes)
  }, [isLoggedIn])

  useEffect(() => {
    let navItem = navigation.map((item) => ({
      name: item.name,
      href: item.href,
      current: item.href == router.route,
    }))
    setNavigation(navItem)
  }, [router.route])

  return (
    <Disclosure as='nav' className='bg-gray-800'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='relative flex h-16 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex flex-shrink-0 items-center'>
                  <Logo />
                </div>
                <div className='hidden sm:ml-6 sm:block'>
                  <div className='flex space-x-4'>
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        href={item.href}
                        name={item.name}
                        current={item.current}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {isLoggedIn && (
                <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
                  <NotificationIcon />
                  {/* Profile dropdown */}
                  <LoggedInMenu />
                </div>
              )}
            </div>
          </div>
          <Disclosure.Panel className='sm:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='div'
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
