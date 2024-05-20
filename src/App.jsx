import {BrowserRouter, Routes, Route} from 'react-router-dom'
//layouts
import MainLayout from './Layout/MainLayout'
//paginas
import Login from './Pages/Login'
import MenuAreas from './Pages/MenuAreas'
//rutas
import cycRoutes from './Routes/CYC.routes'
import rhRoutes from './Routes/RH.routes'
import almRoutes from './Routes/ALM.routes'
import ftcRoutes from './Routes/FTC.routes'
import ventasRoutes from './Routes/VNT.routes'
import logisticaRotes from './Routes/LGT.routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout text='Red de servicios CMP'/>}>
          <Route index element={ <Login/> } />
        </Route>

        <Route path="/menus/:id" element={<MainLayout text='Red de servicios CMP'/>}>
            <Route index element={ <MenuAreas /> } />
        </Route>

        {cycRoutes}

        {rhRoutes}
        
        {almRoutes}

        {ftcRoutes}

        {ventasRoutes}

        {logisticaRotes}
      </Routes>
    </BrowserRouter>
  )
}

export default App
