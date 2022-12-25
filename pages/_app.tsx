import '../styles/globals.css'
import { useState, useEffect } from 'react'
import nookies from 'nookies'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import GuestLayout from '../layouts/GuestLayout'
import initiateFirebaseApp from '../assets/firebaseApp'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next/types'
import type { User } from 'firebase/auth'
import { AuthContext } from '../assets/auth'

export type NextPageWithLayout = NextPage & {
  layout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  initiateFirebaseApp()
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    onAuthStateChanged(getAuth(), (loggedInUser) => {
      if (loggedInUser) {
        loggedInUser
          .getIdToken()
          .then((token) => nookies.set(undefined, 'token', token, {}))
        setUser(loggedInUser)
      }
    })
  }, [])
  const getLayout =
    Component.layout ??
    ((page) => {
      return <GuestLayout>{page}</GuestLayout>
    })

  return (
    <AuthContext.Provider value={user}>
      {getLayout(<Component {...pageProps} />)}
    </AuthContext.Provider>
  )
}

export default MyApp
