import {Route} from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import Menu from '../Pages/Menu'
//paginas
import RegistroAgente from '../Pages/Modules/RH/RegistroAgente/RegistroAgente'
import ModificarAgente from '../Pages/Modules/RH/Modificar Agente/ModificarAgente'
import ClaculoComisiones from '../Pages/Modules/RH/CalculoComisiones/ClaculoComisiones'
import EsquemasComision from '../Pages/Modules/RH/CalculoComisiones/EsquemasComision'
import DesgloceComision from '../Pages/Modules/RH/CalculoComisiones/Desgloce/index'
import ComisionChofer from '../Pages/Modules/RH/ComisionesChoferes/ComisionChofer'
import ValoresViajes from '../Pages/Modules/RH/ComisionesChoferes/ValoresViajes'
import Viajes from '../Pages/Modules/RH/ComisionesChoferes/Viajes'

const rhRoutes = 
    <Route path='/rh/' element={<MainLayout text='Modulo de Recursos Humanos'/>}>
        <Route path="menu/:id" index element={ <Menu area='RH' titulo='Control de Personal' opciones={[
            {texto:'Agentes', ruta:'agentes'},
            {texto:'Choferes', ruta:'choferes'},
            {texto:'Vehiculos', ruta:'vehiculos'},
            {texto:'Cálculo de comisiones', ruta:'calculoComisiones'},
        ]}/> } />
        <Route path='agentes/:id'>
            <Route index element={ <Menu area='RH' titulo='Control de Agentes' opciones={[
                {texto:'Nuevo', ruta:'registro', subruta:'agente'},
                {texto:'Modificar', ruta:'modificar', subruta:'agente'},
            ]}/> } />
        </Route>
        <Route path='choferes/:id'>
            <Route index element={ <Menu area='RH' titulo='Control de Choferes' opciones={[
                {texto:'Nuevo', ruta:'registro', subruta:'chofer'},
                {texto:'Modificar', ruta:'modificar', subruta:'chofer'},
            ]}/> } />
        </Route>    
        <Route path='vehiculos/:id'>
            <Route index element={ <Menu area='RH' titulo='Control de Vehiculos' opciones={[
                {texto:'Nuevo', ruta:'registro', subruta:'vehiculo'},
                {texto:'Modificar', ruta:'modificar', subruta:'vehiculo'},
            ]}/> } />
        </Route>
        <Route path='registro/:id/:tipo'>
            <Route index element = {<RegistroAgente/>}/>
        </Route>
        <Route path='modificar/:id/:tipo'>
            <Route index element = {<ModificarAgente/>}/>
        </Route>
        <Route path="calculoComisiones/:id" >
            <Route index element={ <Menu area='RH' titulo='Cálculo de Comisiones' opciones={[
                {texto:'Vendedores', ruta:'calculoComisiones', subruta:'vendedores'},
                {texto:'Choferes', ruta:'calculoComisiones', subruta:'choferes'},
            ]}/> } />
            <Route path="vendedores" >
                <Route index element={<ClaculoComisiones/>}/>
                <Route path='esquemas' element={<EsquemasComision/>}/>
                <Route path='desgloce/:agente/:fechaI/:fechaF/:grupo' element={<DesgloceComision/>}/>
            </Route>
            <Route path="choferes" >
                <Route index element={<ComisionChofer/>}/>
                <Route path='valores' element={<ValoresViajes/>}/>
                <Route path='desgloce/:chofer/:fechaI/:fechaF/:tipo' element={<Viajes/>}/>
            </Route>
        </Route>
    </Route>

export default rhRoutes