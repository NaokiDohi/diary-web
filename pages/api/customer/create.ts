import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const email = req.body.email
    try {
      const customer = await stripe.customers.create({
        email,
      })
      // console.log('Stripe customer created in signup =>', customer)
      res.json(customer)
    } catch (err: any) {
      console.log(err)
      res.status(err.statusCode || 500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
