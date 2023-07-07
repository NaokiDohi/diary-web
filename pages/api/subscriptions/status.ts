import type { NextApiRequest, NextApiResponse } from 'next'
import {
  StripeSubscription,
  StripeSubscriptionStatus,
} from '../../../types/stripe/subscription'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // console.log(req.query!.stripe_customer_id)
    const customer_id = req.query!.stripe_customer_id
    const active_subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'active',
      expand: ['data.default_payment_method'],
    })
    const trialing_subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'trialing',
      expand: ['data.default_payment_method'],
    })
    // console.log('server subscription', subscriptions.data)
    const status_list: StripeSubscriptionStatus[] = []
    active_subscriptions.data.map((sub: StripeSubscription) => {
      // status[`${sub.id}`] = sub.status
      const tmp_status: StripeSubscriptionStatus = {}
      tmp_status[`${sub.plan.nickname}`] = sub.status
      status_list.push(tmp_status)
    })
    trialing_subscriptions.data.map((sub: StripeSubscription) => {
      // status[`${sub.id}`] = sub.status
      const tmp_status: StripeSubscriptionStatus = {}
      tmp_status[`${sub.plan.nickname}`] = sub.status
      status_list.push(tmp_status)
    })
    // console.log(`Server results:\n%o`, status_list)
    res.json(status_list)
  } catch (err) {
    console.log(err)
  }
}
