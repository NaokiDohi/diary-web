// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

type URL = {
  url: string
}

type Error = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<URL | Error>
) {
  if (req.method === 'POST') {
    try {
      //   const user = await User.findById(req.user._id)
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: req.body.priceId,
            quantity: 1,
          },
        ],
        // customer: user.stripe_customer_id,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
      })
      // console.log("Checkout session =>", session);
      res.redirect(303, session.url)
    } catch (err: any) {
      console.log(err)
      res.status(err.statusCode || 500).json({ error: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
