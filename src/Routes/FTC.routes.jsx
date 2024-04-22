import {Route} from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import Menu from '../Pages/Menu'
//paginas
import Crear from '../Pages/Modules/FTC/Viajes/Crear/Crear'
import Visualizar from '../Pages/Modules/FTC/Viajes/Visualizar/Visualizar'

const ftcRoutes = 
    <Route path='/ftc/' element={<MainLayout text='Modulo de Facturacion'/>}>
        <Route path="menu/:id" index element={ <Menu area='FTC' opciones={[
            {texto:'Creacion de viaje', ruta:'viaje/crear'},
            {texto:'Consultar viaje', ruta:'viaje/consultar'},
        ]}/> } />
        <Route path="viaje/crear/:id" element={ <Crear/> } />
        <Route path="viaje/consultar/:id" element={ <Visualizar/> } />
    </Route>

export default ftcRoutes