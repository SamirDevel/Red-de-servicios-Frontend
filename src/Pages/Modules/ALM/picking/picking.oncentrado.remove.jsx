import { useEffect, useState } from 'react';
import * as fns from '../../../../Functions';
import BlueButton from '../../../../Components/BlueBotton'
import Table from '../../../../Components/Table V2';

function PickingConcentradoRemove({fn, element, index}) {
    const pickedHeads = [
        {text:'Codigo', type:'string'},
        {text:'Producto', type:'string'},
        {text:'Cantidad', type:'string'},
    ]

    const [objetos, setObjetos] = useState([]);

    async function handleSubmit(e){
        e.preventDefault()
        fn(index)
    }

    useEffect(()=>{
        const array = element['array'].map(prod=>{
            const obj={
                codigo:prod['codigo'],
                nombre:prod['nombre'],
                conteo:prod['conteo'],
            }
            return obj
        });
        setObjetos(array);
    },[])


    
    return (
        <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
            <div className='flex flex-row'>
                <label>Serie:</label>
                <span className='mx-1'/>
                <label>{element['serie']}</label>
            </div>
            <br />
            <div className='flex flex-row w-full justify-evenly'>
                <div className='flex flex-row'>
                    <label className=''>Folio Inicial:</label>
                    <span className='mx-1'/>
                    <label>{element['inicio']}</label>
                </div>
                <div>
                    <label>Folio final:</label>
                    <span className='mx-1'/>
                    <label>{element['final']}</label>
                </div>
            </div>
            <br />
            <BlueButton text='Eliminar' fn={handleSubmit}/>
            <br />

            <Table  theme='bg-blue-950 text-white' colsHeads={pickedHeads} list={objetos} manage={setObjetos}/>
        </form>
    )
}

export default PickingConcentradoRemove
//return<Table  theme='bg-blue-950 text-white' colsHeads={comisionHeads} list={objetos} manage={setObjetos}/>