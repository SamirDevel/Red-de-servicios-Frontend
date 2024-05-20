import {Route} from 'react-router-dom'
import MainLayout from '../Layout/MainLayout'
import Menu from '../Pages/Menu'
import VentasPeriodo from '../Pages/Modules/VNT/VentasPeriodo/VentasPeriodo'

const ventasRoutes = <Route path='/vnt/' element={<MainLayout text='Modulo de Ventas'/>}>
    <Route path="menu/:id" index element={ <Menu area='VNT' titulo='Opciones de ventas' opciones={[
            {texto:'Ventas por periodo', ruta:'periodo'},
    ]}/> } />
    <Route path='periodo/:id'>
        <Route index element={ <VentasPeriodo/> }/>
    </Route>
</Route>

export default ventasRoutes