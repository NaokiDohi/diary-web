import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Form, FormGroup, Button, Title } from '@adiranids/react-tailwind'
import '@adiranids/react-tailwind/dist/style.css'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { AuthContext, AuthStateType } from '../context/index'
import axios from 'axios'
import validate from '../assets/validation'
import { addNewWithDocId } from '../assets/firebaseClientHelpers'
import GuestLayout from '../layouts/GuestLayout'
import type { NextPageWithLayout } from './_app'
import type { AuthContextType } from '../context/index'
import { setCookie } from 'nookies'

const Register: NextPageWithLayout = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const [errorName, setErrorName] = useState<string>('')
  const [errorEmail, setErrorEmail] = useState<string>('')
  const [errorPassword, setErrorPassword] = useState<string>('')

  const [state, setState] = useContext<AuthContextType>(AuthContext)
  const router = useRouter()

  const handleRegistration = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    const auth = getAuth()
    const nValidate = new validate(name, 'Name')
    const eValidate = new validate(email, 'Email')
    const pValidate = new validate(password, 'Password')
    let { error: nError } = nValidate.required().lenValidator(3, 20)
    let { error: eError } = eValidate.required().isEmail()
    let { error: pError } = pValidate.required().lenValidator(6, 16)

    if (nError || eError || pError) {
      setErrors(nError, eError, pError)
      return false
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (user) => {
        const customer = await axios.post('api/customer/create', {
          email: email,
        })
        console.log('Customer was created', customer)
        const token = await user.user.getIdToken()
        setCookie(undefined, 'token', token)
        setCookie(undefined, 'stripe_customer_id', customer.data.id, {
          path: '/',
        })
        router.replace('/landing', undefined, { shallow: true })
        router.reload()

        // const docRef = addNewWithDocId('users', user.user.uid, {
        //   name: name,
        //   email: email,
        //   password: password,
        //   stripe_customer_id: customer.data.id,
        //   subscriptions: [],
        // })
      })
      .catch((error) => {
        // console.log('error', error.code)
        if (error.code == 'auth/email-already-in-use') {
          setErrorEmail('You have already registered!!')
        }
      })
  }

  const setErrors = (
    nameError: string,
    emailError: string,
    passwordError: string
  ) => {
    setErrorName(nameError)
    setErrorEmail(emailError)
    setErrorPassword(passwordError)
  }
  return (
    <div className='grid place-items-center mt-32'>
      <Head>
        <title>Register</title>
        <meta name='description' content='Register page for tech events' />
      </Head>
      <Title className='text-center font-bold' size={'h1'}>
        Register
      </Title>
      <Form className='md:w-1/2 lg:w-1/4 w-full' onSubmit={handleRegistration}>
        <FormGroup
          type='name'
          label='Name'
          value={name}
          change={(val: string) => setName(val)}
          error={errorName}
        />
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
            Register
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Register

Register.layout = (page) => <GuestLayout>{page}</GuestLayout>
