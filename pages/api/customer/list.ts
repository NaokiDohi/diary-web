import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const customers = await stripe.customers.list({
      email: req.query.email,
    })
    res.json(customers.data)
  } catch (err) {
    console.log(err)
  }
}
