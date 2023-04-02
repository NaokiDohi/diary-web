import type { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import creds from '../../../fbservercreds.json'
import { StripeSubscription } from '../../../types/stripe/subscription'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const serviceAccount = creds as admin.ServiceAccount
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    }
    console.log('req', req)
    const customer_id = req.query.stripe_customer_id
    const subscriptions = await stripe.subscriptions.list({
      customer: customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    })
    console.log('server subscription', subscriptions)

    let results: string[] = []

    subscriptions.map((sub: StripeSubscription) => {
      results.push(sub.plan.id)
    })

    console.log('server results', results)

    const db = getFirestore()
    const uid = req.query.firebase_user_id as string
    console.log('uid', uid)
    db.collection('users').doc(uid).set({
      firebase_user_id: uid,
      stripe_customer_id: customer_id,
      subscriptions: results,
    })
    db.collection('users')
      .doc(uid)
      .get()
      .then((data) => {
        data.data()
        res.json({ data: data.data })
      })
  } catch (err) {
    console.log(err)
  }
}
