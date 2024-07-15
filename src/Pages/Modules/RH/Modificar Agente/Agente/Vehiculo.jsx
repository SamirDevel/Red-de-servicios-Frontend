import { useEffect, useState, useRef } from "react"
import Input from "../../../../../Components/Input"
import * as fns from "../../../../../Functions"
import Predictive from "../../../../../Components/Predictive"

function Vehiculo() {
    const divRef = useRef(null);

    const [vehiculos, setVehiculos] = useState([]);
    const [vehiculo, setVehiculo] = useState('');
    const [vehiculoE, setVehiculoE] = useState('');
    const [nombre, setNombre] = useState('')
    const [estatus, setEstatus] = useState('-1')
    const [codigo, setCodigo] = useState('')
    const [placas, setPlacas] = useState('')
    const [aseguradora, setAseguradora] = useState('')
    const [poliza, setPoliza] = useState('')
    const [configuracion, setConfiguracion] = useState('-1')
    const [configuraciones, setConfiguraciones] = useState([])
    const [tipoPermiso, setTipoPermiso] = useState('-1')
    const [tiposPermiso, setTiposPermiso] = useState([]);
    const [numeroPermiso, setNumeroPermiso] = useState('')
    const [año, setAño] = useState('')
    const [capacidad, setCapacidad] = useState('')
    const [vigencia, setVigencia] = useState('')
    const [tipoVehiculo, setTipoVehiculo] = useState(0)
    const [limiteLetras, setLimiteLetras]=useState(0)
    const [limiteNumeros, setLimitNumeros]=useState(0)
    const [uso, setUso] = useState(false)

    useEffect(()=>{
        async function GetData(){
            const respuesta = await fns.GetData('recursos.humanos/vehiculo/todos');
            console.log(respuesta)
            if(respuesta['mensaje']===undefined){
                setVehiculos(respuesta.map((item, id)=>{
                    return {...item, id};
                }))
            }else alert(respuesta['mensaje']);

        }
        GetData();
    },[])

    useEffect(()=>{
        async function getData(){
          const url = 'recursos.humanos/vehiculo/catalogos/'
          const respuesta = await Promise.all([fns.GetData(`${url}permisos`), fns.GetData(`${url}configuraciones.vehiculares`)])
          console.log(respuesta)
          setTiposPermiso(respuesta[0]);
          setConfiguraciones(respuesta[1]);
        }
        getData();
      },[])
    useEffect(()=>{
    if(tipoVehiculo==='Camioneta'){
        setLimiteLetras(2);
        setLimitNumeros(5);
    }
    if(tipoVehiculo==='Auto'){
        setLimiteLetras(3);
        setLimitNumeros(4);
    }
    setPlacas('');
    }, [tipoVehiculo])
    useEffect(()=>{
    setNumeroPermiso(placas);
    },[placas])
    useEffect(()=>{
        async function getChoferData(){
            if(codigo!==''){
                const respuesta = await fns.GetData(`recursos.humanos/vehiculo/${codigo}`)
                console.log(respuesta)
                if(respuesta['mensaje']===undefined)setVehiculoE(respuesta);
                else alert(respuesta['mensaje'])
            }else setVehiculoE('')
        }
        getChoferData();
    }, [codigo])
    useEffect(()=>{
        if(vehiculoE!==''){
            setNombre(vehiculoE['nombre']);
            setPlacas(vehiculoE['segmento1']);
            setAseguradora(vehiculoE['txt2']);
            setPoliza(vehiculoE['txt3'])
            setConfiguracion(vehiculoE['segmento3'])
            setTipoPermiso(vehiculoE['segmento2'])
            setNumeroPermiso(vehiculoE['txt1'])
            setAño(vehiculoE['idProveedor'])
            setCapacidad(vehiculoE['capacidad'])
            setVigencia(vehiculoE['vigencia'].substring(0,10))
            setEstatus(vehiculoE['estatus'])
            setUso(vehiculoE['uso'])
        }
    }, [vehiculoE])

    async function handdleClickBucar(){
        const end = vehiculos.length;
        for(let i=0; i<end; i++){
            const veh = vehiculos[i]
            if(veh['codigo'] == vehiculo){
                setCodigo(veh['codigo']);
                break;
            }
        }
    }

    const runStr = fns.runStr;
    const compare = fns.compare;
    const compareLetters = fns.compareLetters;
    const compareNumbers = fns.compareNumbers;

    function handdleChangeAño(numero){
        fns.numberLimited(numero, setAño, 4);
    }
    function handdleChangeCapacidad(numero){
        fns.numberLimited(numero, setCapacidad, 3);
    }
    function handdleChangePlacas(value=''){
        if(value===null||value===''){
            setPlacas('')
            return
        }
        const letras= runStr(value.substring(0,limiteLetras),(char='')=>compare(char.toUpperCase(),compareLetters));
        const numeros = runStr(value.substring(limiteLetras,limiteNumeros+limiteLetras), (char)=>compare(char,compareNumbers));
        if(letras.length<=limiteLetras&&numeros.length==0)
            setPlacas(letras)
        else{
            if(numeros.length<=limiteNumeros)
            setPlacas(`${letras}${numeros}`)
        }
    }

    async function handdleSubmit(e){
        e.preventDefault();
        if(vehiculoE!==''){
            const respuesta = await fns.PatchData(`recursos.humanos/vehiculo/${codigo}`,{
                nombre,
                placas,
                aseguradora,
                poliza,
                configuracion,
                tipoPermiso,
                numPermiso:numeroPermiso,
                año,
                capacidad,
                vigencia,
                estatus,
                uso
            })
            if(respuesta['mensaje']===undefined){
                alert(respuesta)
                window.location.reload();
            }
            else alert(respuesta['mensaje']); 
        }
    }

  return (
    <form className='flex flex-col items-center' onSubmit={handdleSubmit}>
      <div className="flex flex-col items-center justify-center">
        <br />
        <div className="flex flex-row justify-center" ref={divRef}>
            <label>Vehiculo: </label>
            <span className="mx-2"/>
            <Predictive Parameter='codigo'
            id={'vehiculo'} change={setVehiculo} value={vehiculo} list = {vehiculos}
            fn={(e)=>{
                divRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
                //console.log(divRef.current.childNodes[0].childNodes[0].childNodes[0]);
            }}
            />
        </div>
        <br />
        <button
        type="Button"
        className = "text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600"
        onClick={handdleClickBucar}
        >
        Buscar
        </button>
        <br />
        <label className={`${vehiculoE!==''?'visible':'hidden'}`}>Codigo: {codigo}</label>
        <div className={`${vehiculoE!==''?'visible':'hidden'}`}>
          <span className="mx-2"/>
          <label className="flex flex-row">
            Es Vehiculo de vendedor
            <span className="mx-1"/>
            <input type="checkbox"checked={uso===2} onChange={e=>setUso(e.target.checked===true?2:1)}/>
          </label>
        </div>
        <br />
        <div className={`flex flex-row ${vehiculoE!==''?'visible':'hidden'}`}>
          <div className="flex flex-row justify-center mr-5">
            <div className={`formatCol mx-1 colEnd`}>
                <label>Estatus:</label>
                <span className="my-2"/>
                <label>Nombre:</label>
                <span className="my-2"/>
                <label>Placas:</label>
                <span className="my-2"/>
                <label>Aseguradora:</label>
                <span className="my-2"/>
                <label>Poliza:</label>
            </div>
            <div className={`formatCol mx-1 colStart`}>
                <select value={estatus} onChange={e=>setEstatus(e.target.value)}>
                <option value="-1">Seleccionar Opcion</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                </select>
                <Input type="text" change={e=>setNombre(e.target.value)} value={nombre}/>
                <span className="my-2"/>
                <Input type="text" change={e=>handdleChangePlacas(e.target.value)} value={placas} />
                <span className="my-2"/>
                <Input type="text" change={e=>setAseguradora(e.target.value)} value={aseguradora} />
                <span className="my-2"/>
                <Input type="text" change={e=>setPoliza(e.target.value)} value={poliza} />
            </div>
          </div>

          <div className="flex flex-row justify-center mr-5">
            <div className={'formatCol mx-1 colEnd'}>
              <label>Configuracion vehicular:</label>          
              <label>Tipo de permiso:</label>
              <label>Numero de permiso:</label>
              <label>Año del vehiculo:</label>
              <label>Capacidad del tanque (litros):</label>
              <label>Vigencia:</label>
            </div>
            
            <div className={'formatCol mx-1 colStart'}>
              <select className="border-2 border-black rounded-lg w-52" onChange={e=>setConfiguracion(e.target.value)} value={configuracion}>
                <option value="-1">Seleccionar Opcion</option>
                {configuraciones.map(config=>{
                  const cod = config['codigo'];
                  return <option value={cod} key={cod}>{cod}-{config['tipo']}</option>
                })}
              </select>
              <select className="border-2 border-black rounded-lg w-52" onChange={e=>setTipoPermiso(e.target.value)} value={tipoPermiso}>
                <option value="-1">Seleccionar Opcion</option>
                {tiposPermiso.map(tipo=>{
                  const cod = tipo['codigo'];
                  return <option value={cod} key={cod}>{cod}-{tipo['tipo']}</option>
                })}
              </select>
              <Input type="text" change={e=>setNumeroPermiso(e.target.value)} value={numeroPermiso} />
              <Input type="text" change={e=>handdleChangeAño(e.target.value)} value={año} />
              <Input type="number" change={e=>handdleChangeCapacidad(e.target.value)} value={capacidad} />
              <Input type="date" custom='w-full'change={e=>setVigencia(e.target.value)} value={vigencia} />
            </div>
          </div>
        </div>
        <br />
        <button
        type="submit"
        className = {`${vehiculoE!==''?'visible':'hidden'} text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600`}
        >
          Aceptar
        </button>
      </div>
    </form>
  )
}

export default Vehiculo