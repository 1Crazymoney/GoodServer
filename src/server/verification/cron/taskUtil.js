// @flow
import { mapKeys, pickBy, toLower } from 'lodash'

export const DISPOSE_ENROLLMENTS_TASK = 'verification/dispose_enrollments'

export const DisposeAt = {
  Reauthenticate: 'auth-period',
  AccountRemoved: 'account-removal'
}

export const createTaskSubject = (enrollmentIdentifier, executeAt) => ({
  executeAt,
  enrollmentIdentifier: toLower(enrollmentIdentifier)
})

export const forEnrollment = (enrollmentIdentifier, executeAt = null) => {
  const subject = createTaskSubject(enrollmentIdentifier, executeAt)

  return mapKeys(pickBy(subject), (_, key) => `subject.${key}`)
}

// eslint-disable-next-line require-await
export const scheduleDisposalTask = async (storage, enrollmentIdentifier, executeAt): Promise<DelayedTaskRecord> => {
  await storage.cancelTasksQueued(DISPOSE_ENROLLMENTS_TASK, forEnrollment(enrollmentIdentifier))

  return storage.enqueueTask(DISPOSE_ENROLLMENTS_TASK, createTaskSubject(enrollmentIdentifier, executeAt))
}
