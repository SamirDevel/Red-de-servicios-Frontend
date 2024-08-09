import React, { useEffect, useState } from 'react'
import { MdOutlineManageSearch } from 'react-icons/md'
import { fns } from '../../Functions';

function Searchbar({list, result, compare}) {
  const [value, setValue] = useState('');
  const [coincidences, setCoincidences] = useState(0)
  useEffect(()=>{
    async function search() {
      if(value!==''){
        const array = await fns.findCoincidences(list, value, compare);
        setCoincidences(array.length);
        result(array, true)
      }else{
        setCoincidences(0)
        result([], false)
      }
    }
    search()
  }, [value])
  return (
    <div className=' border-4 border-black rounded-full h-8 flex flex-row items-center'>
      <span className='mr-1'/>
      <MdOutlineManageSearch size={25}/>
      <span className='mx-2'/>
      <input type="text" className='unset' value={value} onChange={e=>setValue(e.target.value)}/>
      <span className='mx-2'/>
      <label className={`${coincidences>0?'':'hidden'}`}>{`Elementos encontrados: ${coincidences}`}</label>
      <span className='mx-2'/>
    </div>
  )
}

export default Searchbar