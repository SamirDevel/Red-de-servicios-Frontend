import React, { useState } from 'react'
import Modal from './Modal'
import Input from './Input'
import IconButton from './IconButton'
import { MdCancel } from 'react-icons/md'
import { FaFileDownload } from 'react-icons/fa'

function DownloadWindow({icon, download, closefn}){
    const [name, setName] = useState('')
    async function save(){
        if(name==='')alert('Debe elegir el nombre del archivo');
        else{
            download(name)
            closefn()
        }
    }
    function close(){
        closefn()
    }
    return <div className=' flex flex-col h-48 bg-white items-center justify-between rounded-lg'> 
        <div className=' flex flex-row mt-4 px-2 items-center'>
            {icon}
            <span className='mx-2'/> 
            <Input type={'text'} change={e=>setName(e.target.value)} value={name} placeholder={'Nombre del archivo'}/>
        </div>
        <div className=' flex flex-row mb-4'>
            <IconButton icon={<MdCancel size={50} className='redHover'/>} fn={close}/> 
            <span className=' mx-20'/>
            <IconButton icon={<FaFileDownload size={50} className='blueHover'/>} fn={save}/>
        </div>

    </div>
}
function DownloadModal({downloadFn, icon, isOpen, closefn}) {
    return (
        <Modal isOpen={isOpen}  component={<DownloadWindow icon={icon} closefn={closefn} download={downloadFn}/>}/>
    )
}

export default DownloadModal