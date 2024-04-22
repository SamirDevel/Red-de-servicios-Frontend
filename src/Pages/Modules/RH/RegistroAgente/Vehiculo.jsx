import { useEffect, useState } from "react"
import Input from "../../../../Components/Input";
import * as fns from "../../../../Functions"

function Vehiculo() {
  const [nombre, setNombre] = useState('')
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
    async function getData(){
      const url = 'recursos.humanos/vehiculo/catalogos/'
      const respuesta = await Promise.all([fns.GetData(`${url}permisos`), fns.GetData(`${url}configuraciones.vehiculares`)])
      setTiposPermiso(respuesta[0]);
      setConfiguraciones(respuesta[1]);
    }
    getData();
  },[])
  
  const runStr = fns.runStr;
  const compare = fns.compare;
  const compareLetters = fns.compareLetters;
  const compareNumbers = fns.compareNumbers;

  function handdleChangeCodigo(numero){
    fns.numberLimited(numero, setCodigo, 4);
  }
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
    //setRfc(value)
  }

  function correcto(){
    const errores = new Array();
    if(nombre==='')errores.push('Debe proporcioar un nombre');
    if(codigo==='')errores.push('Debe proporcioar un codigo');
    if(placas==='')errores.push('Debe proporcioar las placas');
    if(aseguradora==='')errores.push('Debe proporcioar el nombre de la aseguradora');
    if(configuracion==='-1')errores.push('Debe proporcioar una configuración vehicular');
    if(tipoPermiso==='')errores.push('Debe proporcioar un tipo de permiso para el vehiculo');
    if(numeroPermiso==='')errores.push('Debe proporcioar un numero de permiso vehicular');
    if(año==='')errores.push('Debe proporcioar el año del vehiculo');
    if(capacidad===''||capacidad<=0)errores.push('Debe proporcioar una capacidad valida del tanque de gasolina');
    if(vigencia==='')errores.push('Debe proporcioar la fecha de vencimiento de la vigencia');
    if(errores.length===0)return true;
    else{
      errores.forEach(error=>alert(error));
      return false;
    }
  }

  async function handdleSubmit(e){
    e.preventDefault();
    if(correcto()===true){
      const respuesta=await fns.PostData('recursos.humanos/vehiculo/crear',{
        nombre,
        codigo,
        placas,
        aseguradora,
        poliza,
        configuracion,
        tipoPermiso,
        numPermiso:numeroPermiso,
        año:parseInt(año),
        capacidad:parseInt(capacidad),
        vigencia,
        estatus:'ACTIVO'
      });
      if(respuesta['mensaje']===undefined){
        alert(respuesta);
        window.location.reload();
      }
      else alert(respuesta['mensaje'])
    }
  }

  return (
    <form className='flex flex-col items-center' onSubmit={handdleSubmit}>
      <div className="flex flex-col">
        <div className="flex flex-row justify-center mr-5">
          <label className="flex flex-row">
            <input type="radio" name='TipoAuto' value={'Camioneta'} onChange={e=>setTipoVehiculo(e.target.value)}/>
            <span className="mx-1"/>
            Camioneta
          </label>
          <span className="mx-2"/>
          <label className="flex flex-row">
            <input type="radio" name='TipoAuto' value={'Auto'} onChange={e=>setTipoVehiculo(e.target.value)}/>
            <span className="mx-1"/>
            Automovil
          </label>
        </div>
        <br />
        <div className="flex flex-row">
          <div className="flex flex-row justify-center mr-5">
            <div className={`formatCol mx-1 colEnd`}>
              <label>Nombre:</label>
              <span className="my-2"/>
              <label>Codigo: </label>
              <span className="my-2"/>
              <label>Placas:</label>
              <span className="my-2"/>
              <label>Aseguradora:</label>
              <span className="my-2"/>
              <label>Poliza:</label>
            </div>
            <div className={`formatCol mx-1 colStart`}>
              <Input type="text" change={e=>setNombre(e.target.value)} value={nombre}/>
              <span className="my-2"/>
              <Input type="text" change=  {e=>handdleChangeCodigo(e.target.value)} value={codigo} />
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
        className = "text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600"
        >
          CREAR
        </button>
      </div>
    </form>
  )
}

export default Vehiculo