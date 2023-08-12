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
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { isAfter, setMinutes, setHours } from 'date-fns'
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker'
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'
import type { DayValue } from '@hassanmojab/react-modern-calendar-datepicker'
import type { NextPageWithLayout } from './_app'
import type { Stripe } from 'stripe'
import type { AuthContextType } from '../context/index'
import type { StripeSubscriptionStatus } from '../types/stripe/subscription'
import AuthLayout from '../layouts/AuthLayout'
// eslint-disable-next-line react/display-name
const Home: NextPageWithLayout = memo(() => {
  var today = new Date()
  const defaultValue = {
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  }
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState, isLoading] = useContext<AuthContextType>(AuthContext)
  // console.log('state define in page/index.js:\n%o', state)
  const [prices, setPrices] = useState<Stripe.Price[]>([])
  const [userSubscriptions, setUserSubscriptions] = useState<string[]>([])
  const [status, setStatus] = useState<StripeSubscriptionStatus[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [selectedDay, setSelectedDay] = useState<DayValue>(defaultValue)

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
    const [startHours, startMinutes] = startTime.split(':')
    const startDateTime = setMinutes(setHours(today, startHours), startMinutes)
    const [endHours, endMinutes] = endTime.split(':')
    const endDateTime = setMinutes(setHours(today, endHours), endMinutes)
    // console.log(startDateTime)
    // console.log(endDateTime)

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

  if (isLoading) {
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
              <>
                <Button className='bg-green-500' size='lg' onClick={onOpen}>
                  Register your events.
                </Button>
                <Modal isOpen={isOpen} onClose={closeAndReset} isCentered>
                  <ModalOverlay />
                  <ModalContent
                    as='form'
                    onSubmit={handleSubmit(handleSecondaryActionClick)}
                  >
                    <ModalHeader>Add Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <HStack>
                        <VStack>
                          <FormControl isInvalid={Boolean(errors.title)}>
                            <FormLabel>Title</FormLabel>
                            <Input
                              id='title'
                              placeholder='Title'
                              onKeyDown={(event) =>
                                handleKeyPress(event, 'description')
                              }
                              {...register('title', {
                                required: 'Title is requreid!!',
                              })}
                            />
                            <FormErrorMessage>
                              {errors.title &&
                                (errors.title.message as React.ReactNode)}
                            </FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={Boolean(errors.description)}>
                            <FormLabel>Description</FormLabel>
                            <Input
                              id='description'
                              placeholder='Description'
                              onKeyDown={(event) =>
                                handleKeyPress(event, 'start_time')
                              }
                              {...register('description', {
                                required: 'Description is required!!',
                              })}
                            />

                            <FormErrorMessage>
                              {errors.description &&
                                (errors.description.message as React.ReactNode)}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                        <VStack>
                          <FormControl isInvalid={Boolean(errors.start_time)}>
                            <FormLabel>Start Time</FormLabel>
                            <Input
                              id='start-time'
                              size='md'
                              type='time'
                              onKeyDown={(event) =>
                                handleKeyPress(event, 'end_time')
                              }
                              {...register('start_time', {
                                required: 'Start time is requreid!!',
                              })}
                            />
                            <FormErrorMessage>
                              {errors.start_time &&
                                (errors.start_time.message as React.ReactNode)}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl isInvalid={Boolean(errors.end_time)}>
                            <FormLabel>End Time</FormLabel>
                            <Input
                              id='end-time'
                              size='md'
                              type='time'
                              {...register('end_time', {
                                required: 'end time is requreid!!',
                                validate: (endTime) => {
                                  const [endHours, endMinutes] =
                                    endTime.split(':')
                                  const endDateTime = setMinutes(
                                    setHours(today, endHours),
                                    endMinutes
                                  )
                                  const [startHours, startMinutes] =
                                    startTime.split(':')
                                  const startDateTime = setMinutes(
                                    setHours(today, startHours),
                                    startMinutes
                                  )
                                  return isAfter(endDateTime, startDateTime)
                                    ? true
                                    : 'End time must be after Start time'
                                },
                              })}
                            />
                            <FormErrorMessage>
                              {errors.end_time &&
                                (errors.end_time.message as React.ReactNode)}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </HStack>
                    </ModalBody>

                    <ModalFooter>
                      <Button
                        variant='ghost'
                        className='bg-green-500'
                        isLoading={isSubmitting}
                        type='submit'
                      >
                        Register your event
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
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
                  <ul className='max-w-sm max-h-screen rounded shadow-lg'>
                    {items}
                  </ul>
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
      </HStack>
    </div>
  )
})
export default Home

Home.layout = (page) => <AuthLayout>{page}</AuthLayout>
