import { useState, useEffect } from 'react'
import Tr from './Tr'

function Thead(props) {
  const [heads, setHeads] = useState(props.heads)

  return (
    <thead className={`${props.theme}`}>
      <Tr heads={heads} type='head' clicked={props.clicked}/>
    </thead>
  )
}

export default Thead