import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const user = await User.findById(req.user._id)

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    })

    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        subscriptions: subscriptions.data,
      },
      { new: true }
    )
    res.json(updated)
  } catch (err) {
    console.log(err)
  }
}
