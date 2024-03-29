import '../styles/globals.css'
import GuestLayout from '../layouts/GuestLayout'
import initiateFirebaseApp from '../assets/firebaseApp'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next/types'
import { AuthProvider } from '../context'
import { ChakraProvider } from '@chakra-ui/react'

export type NextPageWithLayout = NextPage & {
  layout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  initiateFirebaseApp()
  const getLayout =
    Component.layout ??
    ((page) => {
      return <GuestLayout>{page}</GuestLayout>
    })

  return getLayout(
    <ChakraProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
