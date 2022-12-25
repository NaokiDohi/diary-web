import { useContext } from 'react'
import Stripe from 'stripe'
// import { AuthContext } from '../../assets/auth'
import { UserContext } from '../../context'

type PriceCard = {
  price: Stripe.Price
  handleSubscription: Function
  userSubscriptions: string[]
}

const PriceCard = ({
  price,
  handleSubscription,
  userSubscriptions,
}: PriceCard) => {
  const state = useContext(UserContext)
  // const state = useContext(AuthContext)

  const dynamicDescription = () => {
    if (price.nickname === 'BASIC') {
      return 'It can include 5 users.'
    } else if (price.nickname === 'STANDARD') {
      return 'It can include 10 users.'
    } else if (price.nickname === 'PREMIUM') {
      return 'It can include 20 users.'
    }
  }

  const buttonStyle = (price: Stripe.Price) => {
    return price.nickname === 'BASIC' ? 'btn-outline-danger' : 'btn-danger'
  }

  const headerStyle = () => {
    return price.nickname === 'PREMIUM' ? 'bg-danger text-light' : ''
  }

  const borderStyle = () => {
    return price.nickname === 'PREMIUM' ? 'border-danger' : ''
  }

  const buttonText = () => {
    return state && state.token ? 'Buy the plan' : 'Sign Up'
  }

  return (
    <div className='col'>
      <div className={`card mb-4 rounded-3 shadow-sm ${borderStyle()}`}>
        <div className={`card-header py-3 ${headerStyle()}`}>
          <h4 className='my-0 fw-normal'>{price.nickname}</h4>
        </div>
        <div className='card-body'>
          <h1 className='card-title pricing-card-title'>
            {((price.unit_amount as number) / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}{' '}
            <small className='text-muted'>/mo</small>
          </h1>
          <ul className='list-unstyled mt-3 mb-4'>
            <li className='fw-bold'>{dynamicDescription()}</li>
            <li>2 GB of storage</li>
            <li>Email support</li>
            <li>Help center access</li>
          </ul>
          {/* <pre>{JSON.stringify(price, null, 4)}</pre> */}
          <button
            onClick={(e) => handleSubscription(e, price)}
            className={`w-100 btn btn-lg ${buttonStyle(price)}`}
          >
            {userSubscriptions && userSubscriptions.includes(price.id)
              ? 'Access plan'
              : buttonText()}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PriceCard
