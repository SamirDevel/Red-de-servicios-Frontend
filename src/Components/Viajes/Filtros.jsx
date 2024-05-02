import React, {useState, useEffect, useRef} from 'react'
import BlueButton from '../BlueBotton'
import Input from '../Input'
import Div from '../Div'
import {fns} from '../../Functions'
import Predictive from '../Predictive'
import Select from '../Select'

function Filtros({area, setDocs, children, filtro}) {
    const refRuta = useRef(null);
    const refChof = useRef(null);
    const refVehi = useRef(null);
    const refAuxi = useRef(null);
    const refUsuario = useRef(null);
    //Listas
    const [series, setSeries] = useState([])
    const [choferes, setChoferes] = useState([]);
    const [rutas, setRutas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    //elecciones
    const [choferE, setChoferE] = useState('');
    const [auxiliarE, setAuxiliarE] = useState('');
    const [vehiculoE, setVehiculoE] = useState('');
    const [rutaE, setRutaE] = useState('');
    const [usuarioE, setUsuarioE] = useState('');
    //variables
    const [serie, setSerie] = useState('');
    const [folio, setFolio] = useState('');
    const [chofer, setChofer] = useState('');
    const [auxiliar, setAuxiliar] = useState('');
    const [vehiculo, setVehiculo] = useState('');  
    const [ruta, setRuta] = useState('');
    const [usuario, setUsuario] = useState('');
    const [fechaI, setFechaI] = useState('')
    const [fechaF, setFechaF] = useState('')

    useEffect(()=>{
        async function getLists(){
            const respuesta = await Promise.all([
                fns.GetData(`viajes/series`),
                fns.GetData(`/documentos/rutas/corp`),
                fns.GetData(`viajes/choferes?estatus=ACTIVO`),
                fns.GetData(`viajes/vehiculos?estatus=ACTIVO`),
                fns.GetData(`/usuarios/todos`)
            ])
            console.log(respuesta);
            setSeries(respuesta[0]);
            setRutas(respuesta[1]);
            setChoferes(respuesta[2].map(item=>{
                return {...item, nombreUpper:item.nombre.toUpperCase()};
            }));
            setVehiculos(respuesta[3].map(item=>{
                return {...item, id:`${item.codigo}-${item.nombre.toUpperCase()}`};
            }))
            setUsuarios(respuesta[4].map(item=>{
                return {...item, nombreUpper:item.nombre.toUpperCase()};
            }));
        }
        getLists();
    }, [])
    useEffect(()=>{
        if(serie==-1)setSerie('');
    }, [serie])
    useEffect(()=>{
        fns.setStateE(chofer,choferes,'nombreUpper',setChoferE)
    },[chofer])
    useEffect(()=>{
        fns.setStateE(auxiliar,choferes,'nombreUpper',setAuxiliarE)
    },[auxiliar])
    useEffect(()=>{
        fns.setStateE(vehiculo,vehiculos,'id',setVehiculoE)
    },[vehiculo])
    useEffect(()=>{
        fns.setStateE(ruta,rutas,'nombre',setRutaE)
    },[ruta])
    useEffect(()=>{
        fns.setStateE(usuario,usuarios,'nombreUpper',setUsuarioE)
    },[usuario])
    

    async function handdleSubmit(e){
        e.preventDefault();
        console.log(filtro);
        const queryStr = fns.makeUrlQuery({
            serie,
            folio,
            chofer:choferE['codigo'],
            vehiculo:vehiculoE['codigo'],
            ruta:rutaE['codigo'],
            auxiliar:auxiliarE['codigo'],
            usuario:usuarioE['usuario'],
            fechaI,
            fechaF,
            ...filtro
        })
        //console.log(queryStr);
        const respuesta = await fns.GetData(`${area}/viajes/consulta${queryStr}`);
        console.log(respuesta)
        if(respuesta['mensaje']===undefined){
            setDocs(respuesta);
        }else alert(respuesta['mensaje']);
    }
    return (
        <form className='flex flex-col w-full items-center' onSubmit={handdleSubmit}>
            <Div parent={true} orientation='flex-row' width='w-42 mx-1' height='h-10' custom='w-fit'>
                <Div custom='items-end'>
                    <label>Serie:</label>
                    <label>Folio:</label>
                    <label>Chofer:</label>                    
                </Div>
                <Div>
                    <Select list={series} criterio='serie' id='serie' fn={e=>setSerie(e.target.value)} vale={serie} custom='w-full'/>
                    <Input type='number' value={folio} change={e=>setFolio(e.target.value)}/>
                    <div ref={refChof}>
                        <Predictive Parameter='nombreUpper'
                        id={'chofer'} change={setChofer} value={chofer} list = {choferes}
                        fn={(e)=>{
                            refChof.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                    </div>
                </Div>
                <Div custom='items-end'>
                    <label>Vehiculo:</label>
                    <label>Ruta:</label>
                    <label>Auxiliar:</label>
                </Div>
                <Div>
                    <div ref={refVehi}>
                        <Predictive Parameter='id'
                        id={'vehi'} change={setVehiculo} value={vehiculo} list = {vehiculos}
                        fn={(e)=>{
                            refVehi.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                    </div>
                    <div ref={refRuta}>
                        <Predictive Parameter='nombre'
                        id={'ruta'} change={setRuta} value={ruta} list = {rutas}
                        fn={(e)=>{
                            refRuta.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                    </div>
                    <div ref={refAuxi}>
                        <Predictive Parameter='nombreUpper'
                        id={'chofer'} change={setAuxiliar} value={auxiliar} list = {choferes}
                        fn={(e)=>{
                            refAuxi.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                    </div>
                </Div>
                <Div custom='items-end'>
                    <label>A patir de :</label>
                    <label>Hasta:</label>
                    <label>Usuario:</label>
                </Div>
                <Div>
                    <Input type='date' custom='w-full'vale={fechaI} change={e=>setFechaI(e.target.value)}/>
                    <Input type='date' custom='w-full'vale={fechaF} change={e=>setFechaF(e.target.value)}/>
                    <div ref={refUsuario}>
                        <Predictive Parameter='nombreUpper'
                        id={'usuario'} change={setUsuario} value={usuario} list = {usuarios}
                        fn={(e)=>{
                            refUsuario.current.childNodes[0].childNodes[0].childNodes[0].blur();
                            //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
                        }}
                        />
                    </div>
                </Div>
            </Div>
            {React.Children.map(children,(child, index)=>{
                return React.cloneElement(child, {key:index})
            })}
            <BlueButton text='Buscar' fn={handdleSubmit}/>
        </form>
    )
}

export default Filtros
/**
 * <div className='flex flex-row'>
            </div>
 */