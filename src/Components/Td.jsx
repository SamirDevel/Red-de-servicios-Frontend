import React from 'react'

function Td(props) {
  
  return (
    <td key={`${props.row}-${props.col}`}
    className={`${props.highlight} text-sm max-w-fit min-w-fit w-fit`}>
        {props.content}
    </td>
  )
}

export default Td