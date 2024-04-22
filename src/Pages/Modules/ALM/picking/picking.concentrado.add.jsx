import { useEffect, useState, useRef } from 'react';
import * as fns from '../../../../Functions';
import BlueButton from '../../../../Components/BlueBotton'
import ButtonEmpresa from '../../../../Components/button.empresa';
import Predictive from '../../../../Components/Predictive';

function PickingConcentradoAdd({fn, print, save}) {
    const [serie, setSerie] = useState('');
    const [folioI, setFolioI] = useState('');
    const [folioF, setFolioF] = useState('');
    const [empresa, setEmpresa] = useState('-1')
    const [rutas, setRutas] = useState([])
    const [ruta, setRuta] = useState('')
    
    const divRef = useRef(null);

    useEffect(()=>{
        async function getRutas(){
            const respuesta = await fns.GetData('/documentos/rutas/corp');
            setRutas(respuesta)
        }
        getRutas();
    }, [])

    function comprobar(callback){
        const errores = new Array();
        if(ruta==='')errores.push('Debe elegir una ruta')
        if(serie==='')errores.push('La serie es invalida')
        if(folioI===''||folioI<1)errores.push('El inicio del parametro es invalido')
        if(folioF===''||folioF<1)errores.push('El final del parametro es invalido')
        if(parseInt(folioF)<parseInt(folioI))errores.push('El parametro es invalido')
        if(empresa==='-1')errores.push('Debe seleccionar una empresa');
        if(errores.length===0){
            callback();
        }else{
            errores.forEach(err=>alert(err))
        }
    }
    async function handleSubmit(e){
        e.preventDefault()
        comprobar(async ()=>{
            const respuesta = await fns.GetData(`/almacen.inventario/calcular/${empresa}/${serie}/${folioI}/${folioF}`);
            if(respuesta['mensaje']===undefined){
                fn({array:respuesta, inicio:folioI, final:folioF, serie}, ()=>{
                    //setSerie('');
                    setFolioI('');
                    setFolioF('');
                    //setRuta('');
                    //setEmpresa('-1')
                });
            }else alert(respuesta['mensaje'])
        })
    }

    function getRutaCod(){
        const end = rutas.length;
        for(let i=0; i<end; i++){
            const rut = rutas[i]
            if(rut['nombre']===ruta)return rut['codigo'];
        }
        return -1;
    }



    return (
        <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
            <br />
            <div className='flex flex-col w-full items-center'>
                <div className={`flex flex-row ${empresa==='-1'?'visible':'hidden'}`}>
                    <ButtonEmpresa text='CMP' fn={()=>setEmpresa('cmp')}/>
                    <span className='mx-1'/>
                    <ButtonEmpresa text='CDC' fn={()=>setEmpresa('cdc')}/>
                </div>
                <div className={`flex flex-row ${empresa!=='-1'?'visible':'hidden'}`}>
                    <label className='w-[150px] bg-cyan-600 h-[50px] flex flex-col justify-center items-center text-white rounded-md text-xl'>
                        {empresa.toUpperCase()}
                    </label>
                </div>
                <span className=' my-5'/>
                <div className='flex flex-row'>
                    <div className='flex flex-col'>
                        <label>Ruta:</label>
                        <label>Capturar serie:</label>
                        <label>Folio Inicial:</label>
                        <label>Folio final:</label>
                    </div>
                    <span className='mx-1'/>
                    <div className='flex flex-col' ref={divRef}>
                        <Predictive Parameter='nombre'
                        id={'ruta'} change={setRuta} value={ruta} list = {rutas}
                        fn={(e)=>{
                            divRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                        <input className='border-2 border-black rounded-md' type="text" value={serie} onChange={e=>setSerie(e.target.value.toUpperCase())}/>
                        <input className='border-2 border-black rounded-md' type="number" value={folioI} onChange={e=>setFolioI(e.target.value)}/>
                        <input className='border-2 border-black rounded-md' type="number" value={folioF} onChange={e=>setFolioF(e.target.value)}/>
                    </div>
                </div>
            </div>
            <span className=' my-3'/>
            <br />
            <BlueButton text='Agregar' fn= {handleSubmit}/>
            <div className='flex flex-row justify-evenly w-full'>
                <BlueButton text='Guardar' fn={e=>{
                    e.preventDefault();
                    save(empresa, getRutaCod())
                    window.location.reload();
                }}/>
                <BlueButton text='Imprimir' fn={e=>{
                    e.preventDefault();
                    print(empresa, ruta);
                    /*empresa==='cdc'
                    ?'COMERCIAL DOMOS COPERNICO S.A. DE C.V.'
                    :'CENTRAL MAYORISTA DE PANELES S.A. DE C.V.'*/
                }}/>
            </div>
        </form>
    )
}

export default PickingConcentradoAdd