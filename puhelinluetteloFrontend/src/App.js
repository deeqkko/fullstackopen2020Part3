import React from 'react';
import { useState, useEffect } from 'react';
import { Filter, PersonForm, ResultCatalog, Notification } from './components/phonebook'
import './App.css';
import commServer from './services/persons'

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification] = useState({ message: null, color: null })


  useEffect(() => {
    commServer
      .getPhoneBook()
      .then(phoneBook => {
        setPersons(phoneBook)
      })
  }, [notification])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addEntry = () => {
    const entryObject = {
      name: newName,
      number: newNumber
    }

    if (persons.findIndex(name => name.number === newNumber) !== -1) {
       duplicateAlert()
    
    } else if (persons.findIndex(name => name.name === newName) !== -1) {
      if (confirmNumberChange(newName) === true) {
        const entry = persons.find(name => name.name === newName)
        const changedEntry = {...entry, number: newNumber}
        commServer.updatePhoneNumber(entry.id, changedEntry)
                  .then(update =>
                    setPersons(persons.map(person =>
                      person.id !== entry.id ? person : update)),
                    showNotification(
                      `Updated ${entryObject.name} phonenumber to ${entryObject.number}`, 
                      `blue`)
                   )
                   .catch(error => {
                     showNotification(
                       `${entryObject.name} already removed from server.`,
                       `red`
                     )
                   })
      }     
    } else {
      //setPersons(persons.concat(entryObject))
      commServer
        .postToServer(entryObject)
        .then(response => {
          showNotification(`Added ${entryObject.name} to phonebook.`, `green`)
        })
        .catch(error => {
          showNotification(
            `${error.response.data.error.message}`,
            `red`
          )
        })
    }
    setNewName('')
    setNewNumber('')
  }

  const showNotification = (message, color) => {
    setNotification({
      message: message,
      color: color
    })
    setTimeout(() => {
      setNotification({ message: null, color: null })
    }, 5000)
  }

  const updatePhonebook = (event) => {
    event.preventDefault()
    addEntry()
  }

  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDeleteClick = (event) => {
    const newPersons = persons.filter(person => 
      person.id.toString() !== event.target.value)
    const deletePerson = persons.filter(person =>
      person.id.toString() === event.target.value)
    console.log(deletePerson[0].name)
    if (confirmDelete(deletePerson) === true){
      commServer
        .deleteFromServer(event.target.value)
        .then(response => {
          console.log(response)
          setPersons(newPersons)
          showNotification(
            `${deletePerson[0].name} deleted.`,
            `red`
          )
        })
      }
    
  }

  const confirmDelete = (deletePerson) => {
      console.log(deletePerson[0].name)
    return(
      window.confirm(`Removing ${deletePerson[0].name}. Are you sure?`)
    )  
  }

  const confirmNumberChange = (newName) => {
    const changeNumber = persons.filter(name =>
      name.name.toString() === newName)
    return(
      window.confirm(`Changing ${changeNumber[0].name} number to ${newNumber}. Proceed?`)
    )
  }


  const duplicateAlert = () => alert(`${newName} already in the Phonebook!`)

  const personsFiltered = persons.filter(persons => 
    persons.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification.message}
                    color={notification.color}
      />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add Person:</h3>
      <PersonForm updatePhonebook={updatePhonebook} 
                  newName={newName}
                  handleNameChange={handleNameChange}
                  newNumber={newNumber}
                  handleNumberChange={handleNumberChange}
      />
      <h2>Numbers:</h2>
      <ResultCatalog persons={personsFiltered}
                     handleDeleteClick={handleDeleteClick}
       />
    </div>
  )

}

export default App
