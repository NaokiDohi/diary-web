import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../context/index'
import type { StripeSubscription } from '../../types/stripe/subscription'
import type { AuthContextType } from '../../context/index'
import { Center, VStack, Button } from '@chakra-ui/react'

const Account = () => {
  const router = useRouter()
  const [state, setState] = useContext<AuthContextType>(AuthContext)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    // if (!state.user.loggedInUser) router.replace('/')
    // else
    if (state.user.loggedInUser) {
      const getSubscriptions = async () => {
        const { data } = await axios.get('/api/subscriptions/list', {
          params: {
            stripe_customer_id: state.user.stripe_customer_id,
          },
        })
        //   console.log("Subs =>", data);
        setSubscriptions(data.data)
      }
      getSubscriptions()
    }
  }, [state.user.loggedInUser])

  const manageSubscriptions = async () => {
    const { data } = await axios.get('/api/subscriptions/portal', {
      params: {
        stripe_customer_id: state.user.stripe_customer_id,
      },
    })
    window.open(data, '_self')
  }

  return (
    <Center>
      <div className='container '>
        <div className='row'>
          <Center>
            <VStack>
              <h1>Account</h1>
              <p className='lead pb-4'>Your subscription Status.</p>
            </VStack>
          </Center>
          {/* <pre>{JSON.stringify(subscriptions, null, 4)}</pre> */}
          <Center>
            <div className='row'>
              {subscriptions &&
                subscriptions.map((sub: StripeSubscription) => (
                  <div key={sub.id}>
                    <section>
                      <hr />
                      <h4 className='fw-bold'>{sub.plan.nickname}</h4>
                      <h5>
                        {sub.plan.amount!.toLocaleString('en-US', {
                          style: 'currency',
                          currency: sub.plan.currency,
                        })}
                      </h5>
                      <p>Status: {sub.status}</p>
                      <p>
                        Card last 4 digit:{' '}
                        {sub.default_payment_method?.card.last4}
                      </p>
                      <p>
                        Card expiry:
                        {moment(sub.current_period_end * 1000)
                          .format('dddd, MMMM Do YYYY h:mm:ss a')
                          .toString()}
                      </p>
                      <Center>
                        <Button
                          colorScheme='yellow'
                          variant='outline'
                          onClick={manageSubscriptions}
                        >
                          Manage Subscriptions
                        </Button>
                      </Center>
                    </section>
                  </div>
                ))}
            </div>
          </Center>
        </div>
      </div>
    </Center>
  )
}

export default Account
