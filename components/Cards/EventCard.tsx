import { Box } from '@chakra-ui/react'
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
    // <Box className='col rounded bg-green-500 m-5 shadow-lg'>
    //   <div className={`card m-5 rounded-3 shadow-sm`}>
    //     <div className={`card-header py-3`}>
    //       <h1 className='my-0 fw-normal'>・{event.title}</h1>
    //     </div>
    //     <div className='card-body mb-5'>
    //       <h1 className='card-title pricing-card-title'>
    //         ・{event.description}
    //       </h1>
    //       <ul className='list-unstyled mt-3 mb-5'>
    //         <li>・{`${startH}:${startM}`}</li>
    //         <li>・{`${endH}:${endM}`}</li>
    //       </ul>
    //       {/* <pre>{JSON.stringify(event, null, 4)}</pre> */}
    //     </div>
    //   </div>
    // </Box>
    <Card size={'lg'}></Card>
  )
}

export default EventCard
