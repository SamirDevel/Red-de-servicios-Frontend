import React from 'react'

function Option(props) {
  return (
    <option value={props.value}>
        {props.text}
    </option>
  )
}

export default Option