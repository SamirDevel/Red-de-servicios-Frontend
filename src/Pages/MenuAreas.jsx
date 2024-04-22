import { useNavigate, useParams } from "react-router-dom";
import MenuButton from "../Components/MenuButton";
import Logo from "../Components/Logo";

function MenuAreas() {
    const navigate = useNavigate();
    const params = useParams();
    const areaUsuario = sessionStorage.getItem("area");
    function open(string, area){
        if(areaUsuario===area||areaUsuario==='GRC'){
            navigate(`/${area}/${string}/${params.id}`);
        }else alert('el usuario no tiene acceso a este modulo');
    }
    //console.log(sessionStorage)
  return (
    <div className=" flex flex-col">
      <Logo custom='self-center w-64'/>
      <MenuButton text='Credito y Cobranza' fn = {()=>open('menu','CYC')} />
      <MenuButton text='Recursos Humanos' fn ={()=>open('menu', 'RH')}/>
      <MenuButton text='Almacen e Inventario' fn ={()=>open('menu', 'ALM')}/>
      <MenuButton text='Facturacion' fn ={()=>open('menu', 'FTC')}/>
    </div>
  )
}

export default MenuAreas