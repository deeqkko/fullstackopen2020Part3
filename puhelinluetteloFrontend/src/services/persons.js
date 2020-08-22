import axios from 'axios'
const serverUrl = '/api/persons'

const getPhoneBook = () => {
    const request = axios.get(serverUrl)
    return request.then(response => response.data)
}


const postToServer = (entryObject) => {
    const request = axios.post(serverUrl, entryObject)
    return request.then(response => response.data)
}

const deleteFromServer = (id) => {
    const request = axios.delete(`${serverUrl}/${id}`)
    return request.then(response => response)
}

const updatePhoneNumber = (id, newEntry) => {
    const request = axios.put(`${serverUrl}/${id}`, newEntry)
    return request.then(response => response.data)
}


export default {
    getPhoneBook: getPhoneBook,
    postToServer: postToServer,
    deleteFromServer: deleteFromServer,
    updatePhoneNumber: updatePhoneNumber
}