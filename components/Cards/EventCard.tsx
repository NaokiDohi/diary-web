import {
  Text,
  Box,
  Heading,
  Stack,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import { EventType } from '../../types/event'

type EventPropsType = {
  event: EventType
}

const EventCard = ({ event }: EventPropsType) => {
  const [startH, startM, startS] = new Date(event.startTime.toString())
    .toString()
    .split(' ')[4]
    .split(':')
  const [endH, endM, endS] = new Date(event.endTime.toString())
    .toString()
    .split(' ')[4]
    .split(':')
  return (
    <Card
      minW='250px'
      maxW='250px'
      className='rounded bg-green-500 m-1 shadow-lg'
    >
      <CardHeader textAlign='left'>
        <Heading size='md' className='card-header'>
          {event.title}
        </Heading>
      </CardHeader>
      <CardBody textAlign='left'>
        <Stack spacing='1'>
          <Box>
            <Text pt='2' fontSize='sm'>
              {event.description}
            </Text>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              ・{`${startH}:${startM}`}
            </Heading>
          </Box>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              ・{`${endH}:${endM}`}
            </Heading>
          </Box>
        </Stack>
      </CardBody>
      {/* <pre>{JSON.stringify(event, null, 4)}</pre> */}
    </Card>
  )
}

export default EventCard
