import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../../assets/auth'
import type { StripeSubscription } from '../../types/stripe/subscription'
import type { User } from 'firebase/auth'
import type Stripe from 'stripe'

const Account = () => {
  const router = useRouter()
  const loggedInUser = useContext<User | null>(AuthContext)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    if (loggedInUser) setIsLoggedIn(true)
  }, [loggedInUser])

  useEffect(() => {
    const getSubscriptions = async () => {
      const { data } = await axios.get('/api/subscriptions/list')
      //   console.log("Subs =>", data);
      setSubscriptions(data.data)
    }
    if (isLoggedIn) getSubscriptions()
  }, [isLoggedIn])

  const manageSubscriptions = async () => {
    const { data } = await axios.get('/api/subscriptions/portal')
    window.open(data, '_self')
  }

  return (
    <div className='container'>
      <div className='row'>
        <h1>Account</h1>
        <p className='lead pb-4'>Your subscription Status.</p>
        {/* <pre>{JSON.stringify(subscriptions, null, 4)}</pre> */}
        <div className='row'>
          {subscriptions &&
            subscriptions.map((sub: StripeSubscription) => (
              <div key={sub.id}>
                <section>
                  <hr />
                  <h4 className='fw-bold'>{sub.plan.nickname}</h4>
                  <h5>
                    {(sub.plan.amount! / 100).toLocaleString('en-US', {
                      style: 'currency',
                      currency: sub.plan.currency,
                    })}
                  </h5>
                  <p>Status: {sub.status}</p>
                  <p>
                    Card last 4 digit: {sub.default_payment_method?.card.last4}
                  </p>
                  <p>
                    Card expiry:
                    {moment(sub.current_period_end * 1000)
                      .format('dddd, MMMM Do YYYY h:mm:ss a')
                      .toString()}
                  </p>
                  <button
                    className='btn btn-outline-danger'
                    onClick={() =>
                      router.push(`../${sub.plan.nickname.toLowerCase()}`)
                    }
                  >
                    Access
                  </button>{' '}
                  <button
                    className='btn btn-outline-warning'
                    onClick={manageSubscriptions}
                  >
                    Manage Subscriptions
                  </button>
                </section>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Account
