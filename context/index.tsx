import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import axios from 'axios'
import nookies, { parseCookies } from 'nookies'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import type { StripeSubscriptionStatus } from '../types/stripe/subscription'

type Props = {
  children: React.ReactNode
}

export type AuthStateType = {
  user: {
    loggedInUser: User | null
    stripe_customer_id: string | null
    subscriptions: StripeSubscriptionStatus[]
  }
}

export type AuthContextType = [
  AuthStateType,
  Dispatch<SetStateAction<AuthStateType>>,
  boolean,
  Dispatch<SetStateAction<boolean>>
]

const defaultValue: AuthContextType = [
  { user: { loggedInUser: null, stripe_customer_id: null, subscriptions: [] } },
  () => {},
  true,
  () => {},
]
const AuthContext = createContext<AuthContextType>(defaultValue)

const AuthProvider = ({ children }: Props) => {
  const [state, setState] = useState<AuthStateType>({
    user: { loggedInUser: null, stripe_customer_id: null, subscriptions: [] },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // console.log('context is mounted:\n%o', state)
    const unsubscribe = onAuthStateChanged(getAuth(), async (loggedInUser) => {
      if (loggedInUser) {
        loggedInUser
          .getIdToken()
          .then((token) => nookies.set(undefined, 'token', token, {}))

        const cookies = parseCookies()
        // console.log('cookies:\n%o', cookies)
        const { data } = await axios.get('/api/subscriptions/status', {
          params: {
            stripe_customer_id: cookies.stripe_customer_id,
          },
        })
        // console.log(`getting subscription status in context:\n%o`, data)

        setState((oldState: AuthStateType) => ({
          ...oldState,
          user: {
            ...oldState.user,
            loggedInUser: loggedInUser,
            stripe_customer_id: cookies.stripe_customer_id,
            subscriptions: data,
          },
        }))
        setIsLoading(false) // 認証情報の取得完了
      }
    })
    return () => unsubscribe()
  }, [])

  // axios config
  const token =
    state && state.user.loggedInUser?.getIdToken()
      ? state.user.loggedInUser?.getIdToken()
      : ''
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  // console.log(`context idex is called:\n%o`, state)

  return (
    <AuthContext.Provider value={[state, setState, isLoading, setIsLoading]}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
