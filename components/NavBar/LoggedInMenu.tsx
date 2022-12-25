import { Fragment, useState, useEffect, useContext } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getAuth, signOut } from 'firebase/auth'
import { AuthContext } from '../../assets/auth'
import { classNames } from '../../assets/classOperation'
import type { User } from 'firebase/auth'

const Avatar = dynamic(() => import('../Avatar'))

const LoginNavLink = ({
  href,
  name,
  className,
  children,
  isLogout,
}: {
  href: string
  name: string
  className: string
  children: React.ReactNode
  isLogout: boolean
}) => {
  const router = useRouter()
  const logout = () => {
    if (isLogout) {
      const auth = getAuth()
      signOut(auth)
        .then(() => {
          router.reload()
        })
        .catch((error) => {
          console.log('error', error)
        })
    }
  }

  return (
    <>
      {!isLogout && (
        <Link href={href}>
          <a className={className} onClick={logout}>
            {children}
          </a>
        </Link>
      )}
      {isLogout && (
        <button className={`z-[99999] ${className}`} onClick={logout}>
          {children}
        </button>
      )}
    </>
  )
}

const navList = [
  // { href: '/dashboard', name: 'Your Profile', isLogout: false },
  // { href: '/dashboard/createevent', name: 'Create Events', isLogout: false },
  { href: '/account', name: 'Account', isLogout: false },
  { href: '#', name: 'Logout', isLogout: true },
]

const LoggedInMenu = () => {
  const loggedInUser = useContext<User | null>(AuthContext)
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  )
  useEffect(() => {
    if (loggedInUser?.photoURL) setAvatarUrl(loggedInUser.photoURL)
  }, [loggedInUser])

  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <Menu.Button className='flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
          <span className='sr-only'>Open user menu</span>
          <Avatar url={avatarUrl} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {navList.map((item) => {
            return (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <LoginNavLink
                    href={item.href}
                    name={item.name}
                    isLogout={item.isLogout}
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    {item.name}
                  </LoginNavLink>
                )}
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default LoggedInMenu
