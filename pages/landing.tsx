import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/index'
import PriceCard from '../components/Cards/PriceCard'
import GuestLayout from '../layouts/GuestLayout'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import { Center, Heading, VStack, Box, HStack, Spacer } from '@chakra-ui/react'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'
import type { NextPageWithLayout } from './_app'
import type { Stripe } from 'stripe'
import type { AuthContextType } from '../context/index'

type BillingInterval = 'year' | 'month'

const Home: NextPageWithLayout = () => {
  const router = useRouter()
  const [state, setState] = useContext<AuthContextType>(AuthContext)
  const [prices, setPrices] = useState([])
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>([])
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  // console.log('router info', router)
  // console.log('This use is', state.user.loggedInUser)
  const intervals = Array.from(
    new Set(prices?.map((price: Stripe.Price) => price.recurring?.interval))
  )

  const fetchPrices = async () => {
    const { data } = await axios.get('/api/subscriptions/prices')
    // console.log('Getting Prices', data)
    setPrices(data)
  }

  const handleClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    price: Stripe.Price
  ) => {
    e.preventDefault()
    // if (userSubscriptions && userSubscriptions.includes(price.id)) {
    //   router.push(`/${price.nickname?.toLowerCase()}`)
    //   return
    // }
    // console.log('Plan was clicked. price_id is', price.id)
    if (state.user.loggedInUser) {
      console.log(state.user.stripe_customer_id)
      const { data } = await axios.post('api/checkout/create', {
        priceId: price.id,
        stripe_customer_id: state.user.stripe_customer_id,
      })
      // console.log('Subscription was created', data)
      window.open(data, '_self')
    } else {
      router.push('/register')
    }
  }

  useEffect(() => {
    // console.log(`state %o:`, state.user)
    // console.log(`user subscription:%o`, userSubscriptions)
    if (
      state.user.loggedInUser &&
      state.user.stripe_customer_id &&
      state.user.subscriptions.length !== 0
    ) {
      setIsLoggedIn(true)
      // console.log(`user subscription length: ${userSubscriptions.length}`)
      router.push('/')
    } else {
      fetchPrices()
    }
  }, [
    state.user.loggedInUser,
    state.user.stripe_customer_id,
    state.user.subscriptions,
  ])

  return (
    <div className={styles.container}>
      <Head>
        <title>Diary</title>
        <meta name='description' content='Generated by create next app' />
      </Head>

      <div className='col-start-3 col-end-4 w-100'>
        <VStack>
          <Heading as='h1' fontSize='30px'>
            Diary
          </Heading>
          <div>
            <Center>
              <Heading as='h2' fontSize='20px'>
                This is for Guest User
              </Heading>
            </Center>
            <Center>
              <Box overflowY='auto' maxWidth='800px' maxHeight='500px'>
                <Center>
                  <Heading as='h3' fontSize='20px'>
                    Chose your Plan
                  </Heading>
                </Center>
                <div className='relative self-center mt-6 bg-gray-800 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800'>
                  <Spacer />
                  {intervals.includes('month') && (
                    <button
                      onClick={() => setBillingInterval('month')}
                      type='button'
                      className={`${
                        billingInterval === 'month'
                          ? 'relative w-1/2 bg-zinc-700 border-gray-800 shadow-sm text-white'
                          : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                      } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                    >
                      Monthly billing
                    </button>
                  )}
                  <Spacer />
                  {intervals.includes('year') && (
                    <button
                      onClick={() => setBillingInterval('year')}
                      type='button'
                      className={`${
                        billingInterval === 'year'
                          ? 'relative w-1/2 bg-zinc-700 border-gray-800 shadow-sm text-white'
                          : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                      } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                    >
                      Yearly billing
                    </button>
                  )}
                  <Spacer />
                </div>
                <Center>
                  <HStack>
                    {prices &&
                      prices.map(
                        (price: Stripe.Price) =>
                          price.recurring?.interval === billingInterval && (
                            <PriceCard
                              key={price.id}
                              price={price}
                              handleSubscription={handleClick}
                              // userSubscriptions={userSubscriptions}
                            />
                          )
                      )}
                  </HStack>
                </Center>
              </Box>
            </Center>
          </div>
        </VStack>
      </div>
    </div>
  )
}

export default Home

Home.layout = (page) => <GuestLayout>{page}</GuestLayout>
