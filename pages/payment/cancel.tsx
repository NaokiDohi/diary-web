import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'
import router from 'next/router'
import React, { useEffect } from 'react'

const PaymentCancel = () => {
  useEffect(() => {
    setTimeout(() => {
      router.replace('/landing')
    }, 2000)
  }, [])
  return (
    <Alert
      status='error'
      variant='subtle'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
      height='200px'
    >
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        Payment is cancelled!!
      </AlertTitle>
      <AlertDescription maxWidth='sm'>
        Thanks for Payment. But Something is happen. Please contact us.
      </AlertDescription>
    </Alert>
  )
}

export default PaymentCancel
