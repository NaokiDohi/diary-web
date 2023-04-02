import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import nookies from 'nookies'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { AuthContext } from '../../context/index'
import type { AuthStateType } from '../../context/index'

const PaymentSuccess = () => {
  const router = useRouter()
  const [state, setState] = useContext(AuthContext)

  useEffect(() => {
    const getSubscriptionStatus = async () => {
      console.log(state)
      const { data } = await axios.get('/api/subscriptions/status', {
        params: {
          stripe_customer_id: state.user.stripe_customer_id,
          firebase_user_id: state.user.loggedInUser?.uid,
        },
      })
      console.log('Subscription Status =>', data)
      if (data && data.length === 0) {
        router.push('/landing')
      } else {
        // update user in Cookie
        nookies.set(undefined, 'user', data, {})
        // update user in context
        setState(data)
        setState((oldState: AuthStateType) => ({
          ...oldState,
          data,
        }))
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }
    getSubscriptionStatus()
  }, [])

  return (
    <Alert
      status='success'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='200px'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        Payment is successed!!
      </AlertTitle>
      <AlertDescription maxWidth='sm'>Thanks for Payment.</AlertDescription>
    </Alert>
  )
}

export default PaymentSuccess
