import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Form, FormGroup, Button, Title } from '@adiranids/react-tailwind'
import { setCookie } from 'nookies'
import '@adiranids/react-tailwind/dist/style.css'
import { AuthContext } from '../context/index'
import validate from '../assets/validation'
import GuestLayout from '../layouts/GuestLayout'
import type { NextPageWithLayout } from './_app'
import type { AuthContextType, AuthStateType } from '../context/index'

const Login: NextPageWithLayout = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [errorEmail, setErrorEmail] = useState<string>('')
  const [errorPassword, setErrorPassword] = useState<string>('')

  const [state, setState] = useContext<AuthContextType>(AuthContext)
  const router = useRouter()

  useEffect(() => {
    // console.log(state.user.loggedInUser)
    if (state.user.loggedInUser) router.replace('/')
  }, [state.user.loggedInUser])

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const auth = getAuth()
    const eValidate = new validate(email, 'Email')
    const pValidate = new validate(password, 'Password')
    let { error: eError } = eValidate.required().isEmail()
    let { error: pError } = pValidate.required().lenValidator(6, 16)

    if (eError || pError) {
      setErrors(eError, pError)
      return false
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        const customer = await axios.get('api/customer/list', {
          params: {
            email: email,
          },
        })
        console.log('firebase user:', user.user)
        console.log('stripe user:', customer.data[0].id)
        setState((oldState: AuthStateType) => ({
          ...oldState,
          user: {
            ...oldState.user,
            loggedInUser: user.user,
            stripe_customer_id: customer.data[0].id,
          },
        }))

        const token = await user.user.getIdToken()
        setCookie(undefined, 'token', token)
        setCookie(undefined, 'stripe_customer_id', customer.data[0].id)
        console.log('Success!!')
        // console.log(state)
        ///
        // After that, we need to fix error handling about stripe user
        ///
        // console.log(user)
      })
      .catch((error) => {
        // console.log('error', error.code)
        if (error.code == 'auth/configuration-not-found') {
          setErrorEmail('User is not found. You need to register!!')
        } else if (error.code == 'auth/wrong-password') {
          setErrorPassword('Incorrect Password')
        }
      })
  }

  const setErrors = (emailError: string, passwordError: string) => {
    setErrorEmail(emailError)
    setErrorPassword(passwordError)
  }
  console.log(state)
  return (
    <div className='grid place-items-center mt-32'>
      <Head>
        <title>Login</title>
        <meta name='description' content='Login page for tech events' />
      </Head>
      <Title className='text-center font-bold' size={'h1'}>
        Login
      </Title>
      <Form className='md:w-1/4 w-full' onSubmit={handleLogin}>
        <FormGroup
          type='email'
          label='Email'
          value={email}
          change={(val: string) => setEmail(val)}
          error={errorEmail}
        />
        <FormGroup
          type='password'
          label='Password'
          value={password}
          change={(val: string) => setPassword(val)}
          error={errorPassword}
        />
        <div>
          <Button className='float-right' buttonType='primary'>
            Login
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Login

Login.layout = (page) => <GuestLayout>{page}</GuestLayout>
