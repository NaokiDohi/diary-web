import { createContext, SetStateAction } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { Auth, User } from 'firebase/auth'

class auth {
  auth: Auth
  user: any
  constructor() {
    this.auth = getAuth()
    this.user = this.auth.currentUser
  }
  checkAuthStatus(fn: Function) {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        fn(true)
      }
    })
  }
}

export const AuthContext = createContext<User | null>(null)

export default auth
