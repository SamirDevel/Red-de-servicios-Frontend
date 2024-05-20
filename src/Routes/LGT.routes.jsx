import {Route} from 'react-router-dom'
import MainLayout from "../Layout/MainLayout"
import Menu from "../Pages/Menu"
import Rendimientos from "../Pages/Modules/LGT/Rendimiento/Rendimientos"

const logisticaRotes = <Route path='/lgt/' element={<MainLayout text='Modulo de Ventas'/>}>
    <Route path="menu/:id" index element={ <Menu area='LGT' titulo='Apartados de logistica' opciones={[
            {texto:'Rendimientos de viajes', ruta:'rendimiento'},
    ]}/> } />
    <Route path='rendimiento/:id'>
        <Route index element={ <Rendimientos/> }/>
    </Route>
</Route>

export default logisticaRotes