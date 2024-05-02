import { useEffect, useState } from "react"
import Input from "../../../../Components/Input";
import * as fns from "../../../../Functions"

const formatCol = 'flex flex-col mr-3 justify-around';
const formatColEnd = `${formatCol} items-end`
const formatColStart = `${formatCol} items-start`

function Chofer() {
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('-1')
  const [codigo, setCodigo] = useState('')
  const [prefijo, setprefijo] = useState('')
  const [calle, setCalle] = useState('')
  const [rfc, setRfc] = useState('')
  const [licencia, setLicencia] = useState('')
  const [vigencia, setVigencia] = useState('')
  const [exterior, setExterior] = useState('')
  const [interior, setInterior] = useState('')
  const [colonia, setColonia] = useState('')
  const [cp, setCp] = useState('')
  const [tel1, setTel1] = useState('')
  const [tel2, setTel2] = useState('')
  const [tel3, setTel3] = useState('')
  const [tel4, setTel4] = useState('')
  const [pais, setPais] = useState('México')
  const [ciudad, setCiudad] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [estado, setEstado] = useState('Jalisco')
  const [tipo, setTipo] = useState('-1')
  
  useEffect(()=>{
    if(empresa==1)setprefijo(`CM`)
    else if(empresa==2)setprefijo(`CD`)
    else if(empresa==3)setprefijo(`PE`)
    else setprefijo(``)
  },[empresa])

  function comprobar(){
    const errores = new Array();
    const erroresDireccion = new Array()
    if(nombre=='')errores.push('Debe ingresar el Nombre del nuevo chofer');
    if(empresa=='-1')errores.push('Debe elegir una empresa de origen');
    if(tipo=='-1')errores.push('Debe elegir el tipo del chofer');
    if(codigo=='')errores.push('Debe ingresar el codigo');
    else if(codigo.length<3)errores.push('El codigo debe tener 3 digitos');
    if(rfc=='')errores.push('Debe ingresar el rfc');
    if(licencia=='')errores.push('Debe ingresar la licencia');
    if(vigencia=='')errores.push('Debe ingresar la vigencia de la licencia');
    if(calle=='')erroresDireccion.push('Calle');
    if(exterior=='')erroresDireccion.push('Exterior');
    if(colonia=='')erroresDireccion.push('Colonia');
    if(cp=='')erroresDireccion.push('Codigo Postal');
    if(municipio=='')erroresDireccion.push('Municipio');
    if(ciudad=='')erroresDireccion.push('Ciudad');
    if(pais=='')erroresDireccion.push('Pais');
    if(tel1=='')errores.push('Debe registrar al menos un telefono');
    else if(tel1.length<10)errores.push('El numero debe tener 10 digitos');
    //if(tel2!==''&&tel2.length<10)errores.push('El numero debe tener 10 digitos');
    let dirError = 'Debe registrar el Domicilio Completo. Faltantes:\n'
    erroresDireccion.forEach(error=>dirError+=`   -${error}\n`);
    if(erroresDireccion.length>0)errores.push(dirError);
    if(errores.length>0){
      errores.forEach(error=>alert(error));
      return false
    }else return true
  }

  async function handleSubmit(e){
    e.preventDefault();
    const correcto = comprobar();
    if(correcto===true){
      const obj = {
        nombre,
        codigo:`${prefijo}${codigo}`,
        rfc,
        licencia,
        vigencia,
        calle,
        exterior,
        interior:interior!==''?interior:undefined,
        colonia,
        cp,
        municipio,
        ciudad,
        estado,
        estatus:'ACTIVO',
        tipo:parseInt(tipo),
        pais,
        telefono:tel1,
      }
      const respuesta = await fns.PostData('/recursos.humanos/chofer/crear',obj);
      if(respuesta['mensaje']!==undefined){
        alert(respuesta['mensaje'])
        window.location.reload();
      }
      else alert(respuesta)
    }
  }

  function runStr(cad='', callback){
    const end = cad.length;
    let result=''
    for(let i=0; i<end; i++){
      result += callback(cad[i]);
    }
    return result;
  }
  function compareLetters(char=''){
    return char>='A'&&char<='Z';
  }
  function compareNumbers(char){
    return char>='0' && char<='9';
  }

  function compare(char='', fn){
      if(fn(char)===true)return char;
      else return ''
  }

  function handdleChangeRfc(value=''){
    if(value===null||value===''){
      setRfc('')
      return
    }
    const letras= runStr(value.substring(0,4),(char='')=>compare(char.toUpperCase(),compareLetters));
    const numeros = runStr(value.substring(4,10), (char)=>compare(char,compareNumbers));
    const libre=runStr(value.substring(10,13),char=>compare(char.toUpperCase(),char2=>{
      return compareLetters(char2)||compareNumbers(char2)
    }));
    if(letras.length<=4&&numeros.length==0)
      setRfc(letras)
    else{
      if(numeros.length<=6&&libre.length==0)
      setRfc(`${letras}${numeros}`)
      else setRfc(`${letras}${numeros}${libre}`)
    }
    //setRfc(value)
  }

  function handdleChangeCodigo(value){
    if(value===null||value===''){
      setCodigo('')
      return
    }
    const numeros = runStr(value.substring(0,3), (char)=>compare(char,compareNumbers));
    if(numeros.length<=3)setCodigo(numeros);
  }

  function setPhone(value, state){
    if(value===null||value===''){
      state('')
      return
    }
    const numeros = runStr(value.substring(0,10), (char)=>compare(char,compareNumbers));
    if(numeros.length<=10)state(numeros);
  }
  return (
    <form className='flex flex-col items-center' onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-row justify-center mr-5">
            <div className={`${formatColEnd}`}>
              <label>Nombre:</label>
              <span className="my-2"/>
              <label>Empresa:</label>
              <span className="my-2"/>
              <label>Codigo: {prefijo}</label>
              <span className="my-2"/>
              <label>RFC:</label>
              <span className="my-2"/>
              <label>Licencia:</label>
              <span className="my-2"/>
              <label>Vigencia:</label>
            </div>

            <div className={`${formatColStart}`}>
              <Input type="text" change={e=>setNombre(e.target.value)} value={nombre}/>
              <span className="my-2"/>
              <select className="border-2 border-black rounded-lg w-52" onChange={e=>setEmpresa(e.target.value)} value={empresa}>
                  <option value="-1">Seleccionar Opcion</option>
                  <option value={1}>CMP</option>
                  <option value={2}>CDC</option>
                  <option value={3}>PEI</option>
              </select>
              <span className="my-2"/>
              <Input type="text" change={e=>handdleChangeCodigo(e.target.value)} value={codigo} />
              <span className="my-2"/>
              <Input type="text" change={e=>handdleChangeRfc(e.target.value)} value={rfc} />
              <span className="my-2"/>
              <Input type="text" change={e=>setLicencia(e.target.value)} value={licencia.toUpperCase()} />
              <span className="my-2"/>
              <Input type="date" change={e=>setVigencia(e.target.value)} value={vigencia} custom={'w-full'} />
            </div>
          </div>

          <div className="flex flex-row justify-center mr-5">
            <div className={formatColEnd}>
              <label>Tipo:</label>          
              <label>Calle:</label>
              <label>Exterior:</label>
              <label>Interior:</label>
              <label>Colonia:</label>
              <label>Codigo Postal:</label>
            </div>
            
            <div className={formatColStart}>
              <select className="border-2 border-black rounded-lg w-52" onChange={e=>setTipo(e.target.value)} value={tipo}>
                <option value="-1">Seleccionar Opcion</option>
                <option value={1}>Transportista</option>
                <option value={2}>Agente de ventas</option>
              </select>
              <Input type="text" change={e=>setCalle(e.target.value)} value={calle} />
              <Input type="number" change={e=>setExterior(e.target.value)} value={exterior} />
              <Input type="number" change={e=>setInterior(e.target.value)} value={interior} />
              <Input type="text" change={e=>setColonia(e.target.value)} value={colonia} />
              <Input type="text" change={e=>setCp(e.target.value)} value={cp} />
            </div>
          </div>

          <div className="flex flex-row justify-center mr-5">
            <div className={formatColEnd}>
              <label>Municipio:</label>
              <label>Ciudad:</label>
              <label>Pais:</label>
              <label>Estado:</label>
              <label>Telefono principal:</label>
            </div>

            <div className={formatColStart}>
              <Input type="text" change={e=>setMunicipio(e.target.value)} value={municipio} />
              <Input type="text" change={e=>setCiudad(e.target.value)} value={ciudad} />
              <Input type="text" change={e=>setPais(e.target.value)} value={pais} />
              <Input type="text" change={e=>setEstado(e.target.value)} value={estado} />
              <Input type="text" change={e=>setPhone(e.target.value,setTel1)} value={tel1} />
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

export default Chofer

/*
<div className="flex flex-row justify-center mr-5">
            <div className={formatColEnd}>
              <label>Telefono 3:</label>
              <label>Telefono 4:</label>
              <span className="h-7"/>
              <span className="h-7"/>
              <span className="h-7"/>
            </div>

            <div className={formatColStart}>
              <Input type="number" change={e=>setTel3(e.target.value)} value={tel3} placeholder='opcional'/>
              <Input type="number" change={e=>setTel4(e.target.value)} value={tel4} placeholder='opcional'/>
              <span className="h-7"/>
              <span className="h-7"/>
              <span className="h-7"/>
            </div>
          </div>
          */