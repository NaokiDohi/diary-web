import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // const user = await User.findById(req.user._id)
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: process.env.STRIPE_SUCCESS_URL,
    })
    res.json(portalSession.url)
  } catch (err) {
    console.log(err)
  }
}
