import { useState, useEffect, useContext, KeyboardEvent, memo } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext } from '../context/index'
import PriceCard from '../components/Cards/PriceCard'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import {
  Spinner,
  Center,
  Heading,
  VStack,
  Box,
  HStack,
  Spacer,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Divider,
  FormErrorMessage,
  Stack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { setMinutes, setHours } from 'date-fns'
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker'
import useSWR, { useSWRConfig } from 'swr'
import AuthLayout from '../layouts/AuthLayout'
import EventDetailModal from '../components/Modal/EventDetailModal'
import EventRegisterFormModal from '../components/Modal/EventRegisterFormModal'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'
import type { DayValue } from '@hassanmojab/react-modern-calendar-datepicker'
import type { NextPageWithLayout } from './_app'
import type { Stripe } from 'stripe'
import type { AuthContextType } from '../context/index'
import type { StripeSubscriptionStatus } from '../types/stripe/subscription'
import type { EventType } from '../types/event'
// eslint-disable-next-line react/display-name
const Home: NextPageWithLayout = memo(() => {
  var today = new Date()
  const defaultValue = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  }
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState, isPageLoading] =
    useContext<AuthContextType>(AuthContext)
  // console.log('state define in page/index.js:\n%o', state)
  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>([])
  const [status, setStatus] = useState<StripeSubscriptionStatus[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [selectedDay, setSelectedDay] = useState<DayValue>(defaultValue)
  const { mutate } = useSWRConfig()

  const zeroPad = (number: number, length: number) => {
    return number.toString().padStart(length, '0')
  }

  const fetcher = (url: string): Promise<any> =>
    fetch(url).then((res) => res.json())

  const { data, error, isLoading } = useSWR(
    `/api/events/get?year=${selectedDay?.year}&month=${zeroPad(
      selectedDay!.month,
      2
    )}&day=${zeroPad(selectedDay!.day, 2)}`,
    fetcher
  )

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    mode: 'onBlur', // フォームのバリデーションはフォーカスが外れたタイミングで行われるように設定
  })
  const startTime = watch('start_time')
  const endTime = watch('end_time')

  const handleKeyPress = (
    event: KeyboardEvent<HTMLInputElement>,
    fieldName: string | undefined
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const form = event.currentTarget.form as HTMLFormElement
      const formElementsArray = Array.from(form.elements) as HTMLInputElement[]
      if (fieldName) {
        const nextIndex = formElementsArray.findIndex(
          (element) => element.name === fieldName
        )
        const nextInput = formElementsArray[nextIndex]
        if (nextInput) nextInput.focus()
      } else {
        // trigger(fieldName) // バリデーションをトリガー
        handleSubmit(handleSecondaryActionClick)()
      }
    }
  }

  const closeAndReset = () => {
    onClose() // Close the modal after successful data submission.
    reset() // Reset string in the form,
  }

  // Step 4: Handle Secondary Action button click
  const handleSecondaryActionClick = async (values: any) => {
    // console.log(`%o`, values)
    const selectDate = new Date(
      `${selectedDay?.year}-${zeroPad(selectedDay!.month, 2)}-${zeroPad(
        selectedDay!.day,
        2
      )}`
    )
    const [startHours, startMinutes] = startTime.split(':')
    const startDateTime = setMinutes(
      setHours(selectDate, startHours),
      startMinutes
    )
    const [endHours, endMinutes] = endTime.split(':')
    const endDateTime = setMinutes(setHours(selectDate, endHours), endMinutes)
    // console.log(`startDateTime:${startDateTime}`)
    // console.log(`endDateTime:${endDateTime}`)

    // Save the form data to the database using Prisma
    try {
      await axios.post('/api/events/create', {
        title: values.title,
        description: values.description,
        startTime: startDateTime,
        endTime: endDateTime,
      })
      // Data saved successfully, you can perform any additional actions here if needed.
      console.log('Event data saved to the database.')
      closeAndReset()
      mutate(
        `/api/events/get?year=${selectedDay?.year}&month=${zeroPad(
          selectedDay!.month,
          2
        )}&day=${zeroPad(selectedDay!.day, 2)}`
      )
    } catch (error) {
      console.error('Error saving event data:', error)
    }
  }

  // console.log('router info', router)
  // console.log('This use is', state.user.loggedInUser)

  // const checkObjctKey = (obj: Object) => {
  //   const isExists =
  //     obj.hasOwnProperty('STANDARD_MONTHLY') ||
  //     obj.hasOwnProperty('STANDARD_YEARLY') ||
  //     obj.hasOwnProperty('PREMIUM_MONTHLY') ||
  //     obj.hasOwnProperty('PREMIUM_YEARLY')
  //   return isExists
  // }

  // const checkIsActive = () => {
  //   const isActive = state.user.subscriptions.map((obj: Object) => {
  //     const values = Object.values(obj)
  //     const isActive = values.includes('active') || values.includes('trial')
  //     return isActive
  //   })
  //   return isActive
  // }

  const handleClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    price: Stripe.Price
  ) => {
    e.preventDefault()
    if (userSubscriptions && userSubscriptions.includes(price.id)) {
      router.push(`/${price.nickname?.toLowerCase()}`)
      return
    }
    // console.log('Plan was clicked. price_id is', price.id)
    if (state.user.loggedInUser) {
      // console.log(state.user.stripe_customer_id)
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
    // console.log('page index is mounted.')
    // console.log('useEffect is called in page/index.js:\n%o', state)
    // console.log(`state.user.subscriptions:\n%o`, state.user)
    // Please fixe a bug about getting cookie's data.
    if (!state.user.loggedInUser) {
      // console.log('Please login')
      router.replace('/login')
    } else if (
      state.user.loggedInUser &&
      state.user.stripe_customer_id &&
      state.user.subscriptions.length !== 0
    ) {
      // console.log('set Login and Subscribe')
      setIsLoggedIn(true)
      setIsSubscribed(true)
    } else {
      router.push('/landing')
    }
  }, [
    state.user.loggedInUser,
    state.user.stripe_customer_id,
    state.user.subscriptions,
  ])

  if (isPageLoading) {
    return (
      <Center>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='green.400'
          size='xl'
        />
      </Center>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Diary</title>
        <meta name='description' content='Generated by create next app' />
      </Head>

      <Stack direction={['column', 'row']}>
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
              <>
                <Button className='bg-green-500' size='lg' onClick={onOpen}>
                  Register your events.
                </Button>
                <EventRegisterFormModal
                  isOpen={isOpen}
                  onClose={closeAndReset}
                  errors={errors}
                  register={register}
                  startTime={startTime}
                  isSubmitting={isSubmitting}
                  handleKeyPress={handleKeyPress}
                  handleSubmit={handleSubmit}
                  handleSecondaryActionClick={handleSecondaryActionClick}
                />
              </>
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
                  {data &&
                    data.map((event: EventType) => (
                      <EventDetailModal key={event.id} event={event} />
                    ))}
                </Box>
              </div>
            ) : (
              <div>
                <Center>
                  <VStack>
                    <Heading as='h2' fontSize='20px'>
                      This is for Guest User
                    </Heading>
                    <Heading as='h3' fontSize='20px'>
                      Chose your Plan
                    </Heading>
                  </VStack>
                </Center>
                <Center>
                  <Box overflowY='auto' maxWidth='800px' maxHeight='500px'>
                    <HStack>
                      {prices &&
                        prices.map((price: Stripe.Price) => (
                          <PriceCard
                            key={price.id}
                            price={price}
                            handleSubscription={handleClick}
                            // userSubscriptions={userSubscriptions}
                          />
                        ))}
                    </HStack>
                  </Box>
                </Center>
              </div>
            )}
          </VStack>
        </div>
        <Spacer />
      </Stack>
    </div>
  )
})
export default Home

Home.layout = (page) => <AuthLayout>{page}</AuthLayout>
