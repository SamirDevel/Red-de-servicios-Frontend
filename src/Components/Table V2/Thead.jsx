import { useState, useEffect } from 'react'
import Tr from './Tr'

function Thead({ heads, clicked, theme}) {
  return (
    <thead className={`${theme} select-none`}>
      <Tr heads={heads} type='head' clicked={clicked} index={0}/>
    </thead>
  )
}

export default Thead