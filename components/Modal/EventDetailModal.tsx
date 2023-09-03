import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { EventType } from '../../types/event'
import EventCard from '../Cards/EventCard'

type EventDetailModalPropsType = {
  event: EventType
}

const EventDetailModal = ({ event }: EventDetailModalPropsType) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startH, startM, startS] = new Date(event!.startTime.toString())
    .toString()
    .split(' ')[4]
    .split(':')
  const [endH, endM, endS] = new Date(event!.endTime.toString())
    .toString()
    .split(' ')[4]
    .split(':')
  return (
    <VStack spacing={4}>
      <button onClick={onOpen}>
        <EventCard event={event} />
      </button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{event!.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>{event!.description}</div>
            <ul className='list-unstyled mt-3 mb-4'>
              <li>・{`${startH}:${startM}`}</li>
              <li>・{`${endH}:${endM}`}</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <IconButton
                isRound={false}
                variant='solid'
                className='bg-green-500'
                aria-label='Edit'
                fontSize='20px'
                icon={<EditIcon />}
              />
              <IconButton
                isRound={false}
                variant='solid'
                className='bg-green-500'
                aria-label='Delete'
                fontSize='20px'
                icon={<DeleteIcon />}
              />
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default EventDetailModal
