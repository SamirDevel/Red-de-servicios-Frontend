import { Route } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Menu from "../Pages/Menu";
//paginas
import Relaciones from "../Pages/Modules/CYC/Relaciones/Relaciones";
import SaldoPendeinte from "../Pages/Modules/CYC/SaldoPendiente/SaldoPendeinte";
import Documento from "../Pages/Modules/CYC/SaldoPendiente/Documento";
import ReportesCyC from "../Pages/Modules/CYC/ReportesCyC/ReportesCyC";
import Desgloce from "../Pages/Modules/CYC/ReportesCyC/Desgloce";
import Historico from "../Pages/Modules/CYC/HistoricoAgentes/Historico";
import Consultar from "../Pages/Modules/CYC/Viajes/Consultar";
import Abrir from "../Pages/Modules/CYC/Viajes/Abrir";
import Editar from "../Pages/Modules/CYC/Viajes/Editar";
import Cancelar from "../Pages/Modules/CYC/Viajes/Cancelar";
import AddMotivo from "../Pages/Modules/CYC/Viajes/AddMotivo";
import FacturasSinRelacion from "../Pages/Modules/CYC/Viajes/FacturasSinRelacion";
import CerrarFacrura from "../Pages/Modules/CYC/Viajes/FacturasSinRelacion/CerrarFacrura";

const cycRoutes = (
  <Route
    path="/cyc/"
    element={<MainLayout text="Modulo de credito y Cobranza" />}
  >
    <Route
      path="menu/:id"
      index
      element={
        <Menu
          area="CYC"
          opciones={[
            { texto: "Relaciones de Facturas", ruta: "relaciones" },
            { texto: "Facturas con saldo pendiente", ruta: "pendientes" },
            { texto: "Reporteador CyC", ruta: "reporteador" },
            { texto: "Historico Agentes", ruta: "agentes" },
            { texto: "Relaciones de Viajes", ruta: "viajes" },
          ]}
        />
      }
    />
    <Route path="relaciones/:id" element={<Relaciones />} />
    <Route path="pendientes/:id">
      <Route index element={<SaldoPendeinte />} />
      <Route path="documento/:serie/:folio" element={<Documento />} />
    </Route>
    <Route path="reporteador/:id">
      <Route index element={<ReportesCyC />} />
      <Route
        path="desgloce/:tipo/:subtipo/:empresa/:agente/:rutas/:fechaI/:fechaF"
        element={<Desgloce />}
      />
    </Route>
    <Route path="agentes/:id" element={<Historico />} />

    <Route path="viajes/:id">
        <Route index element={ <Menu area="CYC" opciones={[
              { texto: "Consultas de viajes", ruta: "viajes", subruta:"consultar" },
              { texto: "Facturas sin relacion", ruta: "viajes", subruta:"sin_relacion" },
            ]}
        />}/>
      <Route path="consultar/">
        <Route index element={<Consultar />}/>
        <Route path="viaje/:serie/:folio/abrir" element={<Abrir />} />
        <Route path="viaje/:serie/:folio/editar" element={<Editar />} />
        <Route path="viaje/:serie/:folio/cancelar">
          <Route index element={<Cancelar />} />
          <Route path="crear/motivo/:evento" element={<AddMotivo />} />
        </Route>
        <Route path="viaje/:serie/:folio/editar">
          <Route index element={<Editar />} />
          <Route path="crear/motivo/:evento" element={<AddMotivo />} />
        </Route>
      </Route>
      <Route path="sin_relacion">
        <Route index element={<FacturasSinRelacion />}/>
        <Route path="cerrar/:serie/:folio/:concepto" element={<CerrarFacrura />}/>
      </Route>
    </Route>
  </Route>
);
export default cycRoutes;
//<Route path='desgloce/:tipo/:subtipo/:empresa/:agente/:rutas/:fechaI/:fechaF' element={<Desgloce/>}/>
