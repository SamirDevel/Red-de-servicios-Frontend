import {Route} from 'react-router-dom'
import MainLayout from "../Layout/MainLayout"
import Menu from "../Pages/Menu"
import Rendimientos from "../Pages/Modules/LGT/Rendimiento/Rendimientos"
import Crear from '../Pages/Modules/LGT/Viajes/Crear'
import Consultar from '../Pages/Modules/LGT/Viajes/Consultar'

const logisticaRotes = <Route path='/lgt/' element={<MainLayout text='Modulo de Ventas'/>}>
    <Route path="menu/:id" index element={ <Menu area='LGT' titulo='Apartados de logistica' opciones={[
            {texto:'Rendimientos de viajes', ruta:'rendimiento'},
            {texto:'Creacion de viajes', ruta:'crear'},
            {texto:'Consulta de viajes', ruta:'consultar'},
    ]}/> } />
    <Route path='rendimiento/:id' element={ <Rendimientos/> } />
    <Route path='crear/:id' element={ <Crear/> } />
    <Route path='consultar/:id' element={ <Consultar/> } />
</Route>

export default logisticaRotes