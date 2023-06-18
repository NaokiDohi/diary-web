import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import nookies, { parseCookies } from 'nookies'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { getSingleDoc } from '../assets/firebaseClientHelpers'

type Props = {
  children: React.ReactNode
}

export type AuthStateType = {
  user: {
    loggedInUser: User | null
    stripe_customer_id: string | null
    subscriptions: string[]
  }
}

export type AuthContextType = [
  AuthStateType,
  Dispatch<SetStateAction<AuthStateType>>
]

const defaultValue: AuthContextType = [
  { user: { loggedInUser: null, stripe_customer_id: null, subscriptions: [] } },
  () => {},
]
const AuthContext = createContext<AuthContextType>(defaultValue)

const AuthProvider = ({ children }: Props) => {
  const [state, setState] = useState<AuthStateType>({
    user: { loggedInUser: null, stripe_customer_id: null, subscriptions: [] },
  })

  useEffect(() => {
    onAuthStateChanged(getAuth(), (loggedInUser) => {
      if (loggedInUser) {
        loggedInUser
          .getIdToken()
          .then((token) => nookies.set(undefined, 'token', token, {}))

        const cookies = parseCookies()
        console.log('%o', cookies)
        console.log(`${cookies.stripe_customer_id}`)
        const userInfo = getSingleDoc('user', loggedInUser.uid)
        console.log(userInfo)

        setState((oldState: AuthStateType) => ({
          ...oldState,
          user: {
            ...oldState.user,
            loggedInUser: loggedInUser,
            stripe_customer_id: cookies.stripe_customer_id,
            subscriptions: [],
          },
        }))
      }
    })
  }, [
    state.user.loggedInUser,
    state.user.stripe_customer_id,
    state.user.subscriptions,
  ])

  // axios config
  // const token = state && state.token ? state.token : ''
  // axios.defaults.baseURL = process.env.REACT_APP_API_URL
  // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
