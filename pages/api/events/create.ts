// pages/api/createEvent.ts

import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../libs/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, description, startTime, endTime } = req.body

    // Save the event data to the database using Prisma
    await prisma.event.create({
      data: {
        title,
        description,
        startTime,
        endTime,
      },
    })

    res.status(201).json({ message: 'Event data saved successfully' })
  } catch (error) {
    console.error('Error saving event data:', error)
    res.status(500).json({ error: 'Something went wrong' })
  }
}
