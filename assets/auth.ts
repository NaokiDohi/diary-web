import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { Auth, User } from 'firebase/auth'

class auth {
  auth: Auth
  user: User | null

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

export default auth
