import axios from './index'

const getAll = async () => {
  try {
    const endpoint = '/admin/users'

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

const create = async data => {
  try {
    const endpoint = '/admin/users'

    const response = await axios.post(endpoint, data)
    return response.data
  } catch (e) {
    return e
  }
}
const update = async (data, id) => {
  try {
    const endpoint = '/admin/users/' + id

    const response = await axios.patch(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}
const getByID = async id => {
  try {
    const endpoint = '/admin/users/' + id

    const response = await axios.get(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}
const remove = async id => {
  try {
    const endpoint = '/admin/users/' + id

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}
const updateLogo = async (data, id) => {
  try {
    const endpoint = '/admin/users/logo/' + id

    const response = await axios.put(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}
const removeDocument = async (id, documentId) => {
  try {
    const endpoint = `/admin/users/documents/${id}/${documentId}`

    const response = await axios.delete(endpoint)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}
const addDocument = async (id, data) => {
  try {
    const endpoint = `/admin/users/documents/${id}`

    const response = await axios.put(endpoint, data)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}

export { getAll, create, update, getByID, remove, updateLogo, removeDocument, addDocument }
