import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import { AuthContext } from '../../context/index'

const PaymentSuccess = () => {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 2000)
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
