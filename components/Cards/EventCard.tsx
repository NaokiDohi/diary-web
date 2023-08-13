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
    <div className='col rounded bg-green-500 m-3 shadow-lg'>
      <div className={`card mb-4 rounded-3 shadow-sm`}>
        <div className={`card-header py-3`}>
          <h1 className='my-0 fw-normal'>・{event.title}</h1>
        </div>
        <div className='card-body'>
          <h1 className='card-title pricing-card-title'>
            ・{event.description}
          </h1>
          <ul className='list-unstyled mt-3 mb-4'>
            <li>・{`${startH}:${startM}`}</li>
            <li>・{`${endH}:${endM}`}</li>
          </ul>
          {/* <pre>{JSON.stringify(event, null, 4)}</pre> */}
        </div>
      </div>
    </div>
  )
}

export default EventCard
