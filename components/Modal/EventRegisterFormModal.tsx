import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react'
import {
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form/dist/types/form'
import { FieldValues } from 'react-hook-form/dist/types/fields'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { isAfter, setHours, setMinutes } from 'date-fns'

type EventRegisterFormModalPropsType = {
  isOpen: boolean
  onClose: () => void
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  isSubmitting: boolean
  startTime: any
  handleKeyPress: (
    event: React.KeyboardEvent<HTMLInputElement>,
    fieldName: string | undefined
  ) => void
  handleSubmit: UseFormHandleSubmit<FieldValues, undefined>
  handleSecondaryActionClick: (values: any) => void
}

const EventRegisterFormModal = ({
  isOpen,
  onClose,
  errors,
  register,
  isSubmitting,
  startTime,
  handleKeyPress,
  handleSubmit,
  handleSecondaryActionClick,
}: EventRegisterFormModalPropsType) => {
  var today = new Date()
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        as='form'
        onSubmit={handleSubmit(handleSecondaryActionClick)}
      >
        <ModalHeader>Add Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack>
            <VStack>
              <FormControl isInvalid={Boolean(errors.title)}>
                <FormLabel>Title</FormLabel>
                <Input
                  id='title'
                  placeholder='Title'
                  onKeyDown={(event) => handleKeyPress(event, 'description')}
                  {...register('title', {
                    required: 'Title is requreid!!',
                  })}
                />
                <FormErrorMessage>
                  {errors.title && (errors.title.message as React.ReactNode)}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(errors.description)}>
                <FormLabel>Description</FormLabel>
                <Input
                  id='description'
                  placeholder='Description'
                  onKeyDown={(event) => handleKeyPress(event, 'start_time')}
                  {...register('description', {
                    required: 'Description is required!!',
                  })}
                />

                <FormErrorMessage>
                  {errors.description &&
                    (errors.description.message as React.ReactNode)}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack>
              <FormControl isInvalid={Boolean(errors.start_time)}>
                <FormLabel>Start Time</FormLabel>
                <Input
                  id='start-time'
                  size='md'
                  type='time'
                  onKeyDown={(event) => handleKeyPress(event, 'end_time')}
                  {...register('start_time', {
                    required: 'Start time is requreid!!',
                  })}
                />
                <FormErrorMessage>
                  {errors.start_time &&
                    (errors.start_time.message as React.ReactNode)}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.end_time)}>
                <FormLabel>End Time</FormLabel>
                <Input
                  id='end-time'
                  size='md'
                  type='time'
                  {...register('end_time', {
                    required: 'end time is requreid!!',
                    validate: (endTime) => {
                      const [endHours, endMinutes] = endTime.split(':')
                      const endDateTime = setMinutes(
                        setHours(today, endHours),
                        endMinutes
                      )
                      const [startHours, startMinutes] = startTime.split(':')
                      const startDateTime = setMinutes(
                        setHours(today, startHours),
                        startMinutes
                      )
                      return isAfter(endDateTime, startDateTime)
                        ? true
                        : 'End time must be after Start time'
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.end_time &&
                    (errors.end_time.message as React.ReactNode)}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </HStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant='ghost'
            className='bg-green-500'
            isLoading={isSubmitting}
            type='submit'
          >
            Register your event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EventRegisterFormModal
