
export const notify = async () => {
  if (!(self instanceof ServiceWorkerGlobalScope)) {
    return
  }

  const now = new Date()
  // add notification options
  if (now.getHours() < 9 || now.getHours() > 23) {
    console.log('notify, not work time!')
    return
  }

  console.log('notify, work time')

  await self.registration.showNotification('Critical Error', {
    body: 'Critical error ' + new Date(),
    icon: 'notify.png',
  })
}