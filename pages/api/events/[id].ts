import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../libs/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const eventId = parseInt(req.query.id as string)

  if (req.method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: { id: eventId },
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
