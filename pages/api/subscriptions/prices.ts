import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prices = await stripe.prices.list({
    lookup_key: [
      'monthly_membership_standard',
      'yearly_membership_standard',
      'monthly_membership_premium',
      'yearly_membership_premium',
    ],
  })
  // console.log('prices =>', prices)
  res.json(prices.data.reverse())
}
