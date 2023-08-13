import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../libs/prisma'
import { convertToUTC } from '../../../libs/utils'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).end() // Method Not Allowed
  }
  const query = req.query
  // console.log(`This is obj %o`, req.query)

  const startUTC = convertToUTC(
    new Date(`${query.year}-${query.month}-${query.day}T00:00:00Z`)
  ).toISOString()
  const endUTC = convertToUTC(
    new Date(`${query.year}-${query.month}-${query.day}T23:59:59Z`)
  ).toISOString()

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: startUTC,
        lt: endUTC,
      },
    },
    orderBy: {
      startTime: 'asc', // Order by startTime field in the specified order or ascending order by default
    },
  })

  res.status(200).json(events)
}
