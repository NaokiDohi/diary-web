import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/index'
import PriceCard from '../components/Cards/PriceCard'
import GuestLayout from '../layouts/GuestLayout'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import { Center, Heading, VStack, Box, HStack, Spacer } from '@chakra-ui/react'
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'
import { Divider } from '@chakra-ui/react'
import type { DayValue } from '@hassanmojab/react-modern-calendar-datepicker'
import type { NextPageWithLayout } from './_app'
import type { Stripe } from 'stripe'
import type { AuthContextType, AuthStateType } from '../context/index'
import type { StripeSubscription } from '../types/stripe/subscription'

const Home: NextPageWithLayout = () => {
  var today = new Date()
  const defaultValue = {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  }
  const router = useRouter()
  const [state, setState] = useContext<AuthContextType>(AuthContext)
  const [prices, setPrices] = useState([])
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [selectedDay, setSelectedDay] = useState<DayValue>(defaultValue)
  // console.log('router info', router)
  // console.log('This use is', state.user.loggedInUser)

  const fetchPrices = async () => {
    const { data } = await axios.get('/api/subscriptions/prices')
    // console.log('Getting Prices', data)
    setPrices(data)
  }

  const getSubscriptions = async () => {
    const { data } = await axios.get('/api/subscriptions/list', {
      params: {
        stripe_customer_id: state.user.stripe_customer_id,
      },
    })
    //   console.log("Subs =>", data);
    setUserSubscriptions(data.data.subscriptions)
    setState({
      ...state,
      user: {
        ...state.user,
        loggedInUser: null,
        stripe_customer_id: null,
        subscriptions: userSubscriptions,
      },
    })
    console.log(state)
  }

  useEffect(() => {
    getSubscriptions()
    console.log(userSubscriptions)
  }, [state.user.subscriptions])

  useEffect(() => {
    console.log(state)
    if (state.user.loggedInUser) {
      setIsLoggedIn(true)
      if (userSubscriptions.length != 0) {
        setIsSubscribed(true)
      } else {
        router.push('/landing')
        // fetchPrices()
      }
    } else {
      // fetchPrices()
    }
  }, [state.user.loggedInUser, userSubscriptions])

  let items = []
  for (let i = 1; i <= 100; i++) {
    items.push(
      <li key={i} className='rounded bg-green-500 m-3'>
        <Center>Event {i}</Center>
      </li>
    )
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Diary</title>
        <meta name='description' content='Generated by create next app' />
      </Head>

      <HStack>
        {isLoggedIn && isSubscribed ? (
          <>
            <Spacer />
            <VStack>
              <Heading as='h1' fontSize='30px'>
                Optimize Your Life!
              </Heading>
              <Calendar
                value={selectedDay}
                onChange={setSelectedDay}
                shouldHighlightWeekends
              />
              {/* </div> */}
            </VStack>
          </>
        ) : null}

        <Divider orientation='vertical' borderColor={'red'} />
        <Spacer />

        <div className='col-start-3 col-end-4 w-100'>
          <VStack>
            <Heading as='h1' fontSize='30px'>
              Diary
            </Heading>

            {isLoggedIn && isSubscribed ? (
              <div>
                <Heading as='h2' fontSize='20px'>
                  This is for loggedInUser
                </Heading>
                <Box overflowY='auto' maxWidth='800px' maxHeight='500px'>
                  <ul className='max-w-sm max-h-screen rounded shadow-lg'>
                    {items}
                  </ul>
                </Box>
              </div>
            ) : null}
          </VStack>
        </div>
        <Spacer />
      </HStack>
    </div>
  )
}

export default Home

Home.layout = (page) => <GuestLayout>{page}</GuestLayout>
