import { useEffect, useState, useRef } from "react"
import Input from "../../../../../Components/Input"
import * as fns from "../../../../../Functions"
import Predictive from "../../../../../Components/Predictive"

function Chofer() {
    const divRef = useRef(null);
    
    const [choferes, setChoferes] = useState([]);
    const [chofer, setChofer] = useState('');
    const [choferE, setChoferE] = useState('');
    const [nombre, setNombre] = useState('')
    const [codigo, setCodigo] = useState('');
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
    const [pais, setPais] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [municipio, setMunicipio] = useState('')
    const [estado, setEstado] = useState('')
    const [estatus, setEstatus] = useState('')
    const [tipo, setTipo] = useState('-1')
    
    const formatCol = 'flex flex-col mr-3 justify-around';
    const formatColEnd = `${formatCol} items-end`
    const formatColStart = `${formatCol} items-start`
    
    useEffect(()=>{
        async function GetData(){
            const respuesta = await fns.GetData('recursos.humanos/chofer/todos');
            if(respuesta['mensaje']===undefined){
                setChoferes(respuesta.map(item=>{
                    return {...item, nombreUpper:item.nombre.toUpperCase()};
                }))
            }else alert(respuesta['mensaje']);

        }
        GetData();
    },[])
    useEffect(()=>{
        if(choferE!==''){
            const dom = choferE['domicilios'][0];
            setNombre(choferE['nombre']);
            setRfc(choferE['segmento1']);
            setLicencia(choferE['txt1']);
            setVigencia(fns.dateString(new Date(choferE['vigencia'])))
            setCalle(dom['calle']);
            setExterior(dom['exterior']);
            setInterior(dom['interior']);
            setColonia(dom['colonia']);
            setCp(dom['codigoPostal']);
            setMunicipio(dom['municipio']);
            setCiudad(dom['ciudad']);
            setPais(dom['pais'])
            setEstado(dom['estado'])
            setTel1(dom['tel1']);
            setEstatus(choferE['estatus'])
            setTipo(choferE['tipo'])
        }
    }, [choferE])
    useEffect(()=>{
        async function getChoferData(){
            if(codigo!==''){
                const respuesta = await fns.GetData(`recursos.humanos/chofer/${codigo}`)
                console.log(respuesta)
                if(respuesta['mensaje']===undefined)setChoferE(respuesta);
                else alert(respuesta['mensaje'])
            }else setChoferE('')
        }
        getChoferData();
    }, [codigo])
    useEffect(()=>{
        if(chofer==='')setCodigo('');
    }, [chofer])


    async function handdleSubmit(e){
        e.preventDefault();
        if(choferE!==''){
            const respuesta = await fns.PatchData(`recursos.humanos/chofer/${codigo}`,{
                nombre,
                codigo,
                rfc,
                licencia,
                vigencia,
                calle,
                exterior,
                interior,
                colonia,
                cp,
                municipio,
                ciudad,
                estado,
                pais,
                telefono:tel1,
                estatus,
                tipo,
            })
            if(respuesta['mensaje']===undefined){
                alert(respuesta)
                window.location.reload();
            }
            else alert(respuesta['mensaje']); 
        }
    }
    async function HhanddleClickBucar(){
        const end = choferes.length;
        for(let i=0; i<end; i++){
            const chof = choferes[i]
            if(chof['nombreUpper'] == chofer){
                setCodigo(chof['codigo']);
                break;
            }
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
    function runStr(cad='', callback){
        const end = cad.length;
        let result=''
        for(let i=0; i<end; i++){
          result += callback(cad[i]);
        }
        return result;
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
    <form className='flex flex-col items-center' onSubmit={handdleSubmit}>
        <br />
        <div className="flex flex-col">
            <div className="flex flex-row justify-center" ref={divRef}>
                <label>Chofer: </label>
                <span className="mx-2"/>
                <Predictive Parameter='nombreUpper'
                id={'agente'} change={setChofer} value={chofer} list = {choferes}
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
            onClick={HhanddleClickBucar}
            >
            Buscar
            </button>
            <br />
            <div className={`flex flex-row justify-center ${choferE!==''?'visible':'hidden'}`}>
                <label>Codigo:</label>
                <span className="mx-1"/>
                {codigo}
            </div>
            <br />
            <div className={`flex flex-row ${choferE!==''?'visible':'hidden'}`}>
                <div className="flex flex-row justify-center mr-5">
                    <div className={`${formatColEnd}`}>
                        <label>Nombre:</label>
                        <span className="my-2"/>
                        <label>Estatus</label>
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
                        <select className="border-2 border-black rounded-lg w-52" onChange={e=>setEstatus(e.target.value)} value={estatus}>
                            <option value="-1">Seleccionar Opcion</option>
                            <option value="INACTIVO">INACTIVO</option>
                            <option value="ACTIVO">ACTIVO</option>
                        </select>
                        <span className="my-2"/>
                        <Input type="text" change={e=>handdleChangeRfc(e.target.value)} value={rfc} />
                        <span className="my-2"/>
                        <Input type="text" change={e=>setLicencia(e.target.value)} value={licencia.toUpperCase()} />
                        <span className="my-2"/>
                        <Input type="date" change={e=>setVigencia(e.target.value)} value={vigencia} custom={'w-full'}/>
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
            className = {`${choferE!==''?'visible':'hidden'} text-white text-2xl bg-cyan-600 w-32 h-fit rounded-xl self-center place-self-center hover:bg-white hover:text-cyan-600`}
            >
            Guardar
            </button>
        </div>
    </form>
    )
}

export default Chofer