import nc from 'next-connect'
import type { NextApiRequest, NextApiResponse } from 'next'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import creds from '../../../fbservercreds.json'

const handler = nc().post(async (req: NextApiRequest, res: NextApiResponse) => {
  // console.log('req.body.token\n', req.body.token)
  if (!req.body.token) res.status(403).json({ error: 'Unauthorized' })
  try {
    const serviceAccount = creds as admin.ServiceAccount
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    }
    const decoded = await getAuth().verifyIdToken(req.body.token)
    // console.log('decoded\n', decoded)
    res.status(200).json({ success: decoded })
  } catch (error) {
    res.status(403).json({ error: 'Unauthorized' })
  }
})
export default handler
