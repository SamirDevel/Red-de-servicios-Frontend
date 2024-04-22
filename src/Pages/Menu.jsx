import { useNavigate, useParams } from "react-router-dom";
import MenuButton from "../Components/MenuButton";
import Logo from "../Components/Logo";
function Menu(props) {
  const navigate = useNavigate();
  const params = useParams();
  function open(string, subruta){
    navigate(`/${props.area}/${string}/${params.id}${subruta!==undefined?`/${subruta}`:''}`);
  }
  return (
    <div className=" flex flex-col">
      <Logo custom='self-center w-72'/>
      <label className="self-center text-4xl text-cyan-800 font-extrabold">{props.titulo}</label>
      <br />
      {props.opciones.map((opcion, index)=>{
            return <MenuButton text={opcion.texto} fn = {()=>open(opcion.ruta, opcion.subruta)} key={index}/>
        })
      }
    </div>
  )
}

export default Menu

/*
<MenuButton text='Relaciones de Facturas' fn = {()=>open('relaciones')} />
<MenuButton text='Facturas con saldo pendiente' fn ={()=>open('pendientes')}/>
<MenuButton text='Reporteador CyC' fn ={()=>open('reporteador')}/>
<MenuButton text='Historico Agentes' fn ={()=>open('agentes')}/>
*/