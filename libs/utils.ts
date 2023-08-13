export const convertToUTC = (localDateTime: Date) => {
  const utcDateTime = localDateTime.toLocaleString(undefined, {
    timeZone: 'UTC',
  })
  return new Date(utcDateTime)
}
