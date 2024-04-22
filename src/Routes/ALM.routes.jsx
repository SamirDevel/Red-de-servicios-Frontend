import {Route} from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import Menu from '../Pages/Menu'
//Paginas
import PickingConcentrado from '../Pages/Modules/ALM/picking/Picking.concentrado'
import ConsultaPicking from '../Pages/Modules/ALM/picking/ConsultaPicking'
import PickingDocumento from '../Pages/Modules/ALM/picking/Picking.validacion'

const almRoutes = 
    <Route path='/alm/' element={<MainLayout text='Modulo de Almacen e Inventario'/>}>
        <Route path="menu/:id" index element={ <Menu area='ALM' opciones={[
            {texto:'Concetrado de picking', ruta:'picking'},
            {texto:'Consulta de picking', ruta:'picking/consulta'},
            {texto:'Validacion de picking', ruta:'picking/validar'},
        ]}/> } />
        <Route path="picking/:id" element={ <PickingConcentrado/> } />
        <Route path="picking/consulta/:id" element={ <ConsultaPicking/> } />
        <Route path="picking/validar/:id" element={ <PickingDocumento/> } />
    </Route>
export default almRoutes