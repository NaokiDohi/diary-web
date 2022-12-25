import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const customer_id = req.query.stripe_customer_id as string
    // const user = await User.findById(req.user._id)
    const subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    })
    res.json(subscriptions)
  } catch (err) {
    console.log(err)
  }
}
