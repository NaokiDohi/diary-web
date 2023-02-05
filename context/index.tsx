import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import nookies from 'nookies'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

type Props = {
  children: React.ReactNode
}

type AuthStateType = {
  user: {
    loggedInUser: User | null
  }
}

export type AuthContextType = [
  AuthStateType,
  Dispatch<SetStateAction<AuthStateType>>
]

const defaultValue: AuthContextType = [
  { user: { loggedInUser: null } },
  () => {},
]
const AuthContext = createContext<AuthContextType>(defaultValue)

const AuthProvider = ({ children }: Props) => {
  const [state, setState] = useState<AuthStateType>({
    user: { loggedInUser: null },
  })

  useEffect(() => {
    onAuthStateChanged(getAuth(), (loggedInUser) => {
      if (loggedInUser) {
        loggedInUser
          .getIdToken()
          .then((token) => nookies.set(undefined, 'token', token, {}))
        setState({
          user: { loggedInUser: loggedInUser },
        })
      }
    })
  }, [])

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
