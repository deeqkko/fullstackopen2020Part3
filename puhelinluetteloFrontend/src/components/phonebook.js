import React from 'react'

export const Filter = (props) => {
    return(
        <div>
        Search by Name:<input value={props.filter}
                      onChange={props.handleFilter}
         />
      </div>
    )
}

export const PersonForm = (props) => {
    return(
        <form onSubmit={props.updatePhonebook}>
            <div>
            Name: <input value={props.newName}
                        onChange={props.handleNameChange}
            />
            </div>
            <div>
            Number: <input value={props.newNumber}
                            onChange={props.handleNumberChange}
            /></div>
            <div>
            <button type="submit">Add</button>
            </div>
        </form>
    )
}

export const ResultCatalog = (props) => {
    return(
        <ul>
            {props.persons.map(person => 
            <li key={person.id}>{person.name}<br />Tel: {person.number}
            <button value={person.id} onClick={props.handleDeleteClick}>Delete</button>
            </li>)}
        </ul>
    )
}

export const Notification = (props) => {
    const notificationStyle = {
        color: props.color,
        background: 'lightGray',
        borderStyle: 'solid',
        borderColor: props.color,
        borderRadius: '5px',
        margin: '10px',
        textAlign: 'center'
    }
    if (props.notification === null) {
        return null
    }

    return(
        <div style={notificationStyle}>
            <h1>{props.notification}</h1>
        </div>
    )
}
