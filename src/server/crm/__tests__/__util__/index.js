import { capitalize } from 'lodash'

export default mock => {
  const contactUrl = id => `contacts/by_id/${encodeURIComponent(id)}`
  const contactByEmailUrl = email => `contacts/by_email/${encodeURIComponent(email)}`
  const emailWithId = (id, email) => ({ [email]: id })

  const mockSuccessResponse = (url, payload, method = 'GET', metadata = {}) =>
    mock[`on${capitalize(method)}`](url).reply(200, {
      payload,
      metadata: {
        error: false,
        ...metadata
      }
    })

  const mockFailedResponse = (url, method = 'GET') => mock[`on${capitalize(method)}`](url).reply(500)

  const mockSuccessGetContact = (id, contactData) => mockSuccessResponse(contactUrl(id), { ...contactData, id })
  const mockSuccessGetByEmail = (id, email, contactData) =>
    mockSuccessResponse(contactByEmailUrl(email), { ...contactData, email, id })

  const mockFailedGetContact = id => mockFailedResponse(id)
  const mockFailedGetByEmail = email => mock.onGet(contactByEmailUrl(email)).reply(404, { payload: { code: 404 } })

  const mockSuccessChangeStatus = () => mockSuccessResponse('v2/contacts/change_status', {}, 'POST')
  const mockSuccessDeleteContact = () => mockSuccessResponse('contacts/delete', {}, 'POST')

  const mockSuccessCreateContact = (email, autoGeneratedId) =>
    mockSuccessResponse(
      'v2/contacts',
      {
        created_emails: emailWithId(autoGeneratedId, email)
      },
      'POST'
    )

  const mockSuccessUpdateContact = (email, id) =>
    mockSuccessResponse(
      'v2/contacts',
      {
        updated_emails: emailWithId(id, email)
      },
      'PUT'
    )

  const mockSuccessUpdateEmail = (email, id) =>
    mockSuccessResponse(
      'contacts/change_email',
      {
        success_emails: emailWithId(id, email)
      },
      'PUT'
    )

  return {
    contactUrl,
    contactByEmailUrl,

    mockSuccessGetContact,
    mockSuccessGetByEmail,
    mockFailedGetContact,
    mockFailedGetByEmail,

    mockSuccessChangeStatus,
    mockSuccessDeleteContact,

    mockSuccessCreateContact,
    mockSuccessUpdateContact,

    mockSuccessUpdateEmail
  }
}