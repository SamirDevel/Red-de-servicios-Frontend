import React, { useState, useRef, useEffect } from "react";
import "./FSR.css";
import Predictive from "../../../../../Components/Predictive";
import { fns } from "../../../../../Functions";
import BlueButton from "../../../../../Components/BlueBotton";
import Input from "../../../../../Components/Input";
import Div from "../../../../../Components/Div";
import Table from "../../../../../Components/Table V2";
import OpenButtonIcon from "../../../../../Components/OpenButtonIcon";

const Index = () => {
  const [cliente, setCliente] = useState("");
  const [clienteE, setClienteE] = useState("");
  
  const [clientes, setClientes] = useState([]);
  const [serie, setSerie] = useState("");
  const [series, setSeries] = useState([]);
  const [folio, setFolio] = useState("");
  const [expedicion, setExpedicion] = useState("");
  const [facturas, setFacuras] = useState([]);
  const [objetos, setObjetos] = useState([]);

  const cliRef = useRef(null);
  const seriRef = useRef(null);

  const heads = [
    {text:'Factura', type:'string'},
    {text:'Cliente', type:'string'},
    {text:'Total', type:'pesos'},
    {text:'Expedicion', type:'string'},
    {text:'Abrir', type:'string'},
  ]

  useEffect(() => {
    async function getData() {
      const respuesta = await Promise.all([
        fns.GetData("/clientes/corp"),
        fns.GetData("/documentos/series/corp"),
      ]);
      console.log(respuesta);
      setClientes(
        respuesta[0].map((cli) => {
          return { ...cli, nombreUpper: cli.nombre.toUpperCase() };
        })
      );
      setSeries(respuesta[1]);
    }
    getData();
  }, []);

  useEffect(() => {
    fns.setStateE(cliente, clientes, "nombreUpper", setClienteE);
  }, [cliente]);
  useEffect(()=>{
    setObjetos(facturas.map(factura=>{
      return {
        FACTURA:`${factura.serie}-${factura.folio}`,
        CLIENTE:factura.nombre,
        TOTAL:factura.total,
        EXPEDICION:fns.dateString(new Date(factura.expedicion)),
        ABRIR:<OpenButtonIcon size={30} url={`${window.location}/cerrar`}/>,
      }
    }))
  }, [facturas])

  async function handdleSubmit(e) {
    e.preventDefault();
    /*const queryStr = fns.makeUrlQuery({
      serie,
      folio,
      chofer: choferE["codigo"],
      vehiculo: vehiculoE["codigo"],
      ruta: rutaE["codigo"],
      auxiliar: auxiliarE["codigo"],
      usuario: usuarioE["usuario"],
      fechaI,
      fechaF,
      ...filtro,
    });
    //console.log(queryStr);*/
    const respuesta = await fns.GetData(`credito.cobranza/viajes/facturas/sin_relacion`);
    console.log(respuesta);
    if (respuesta["mensaje"] === undefined) {
      setFacuras(respuesta);
    } else alert(respuesta["mensaje"]);
  }
  return (
    <form
      className="flex flex-col w-full items-center"
      onSubmit={handdleSubmit}
    >
      <div className="contenedor">
        <div className="columnas">
          <div ref={cliRef}>
            Clientes:
            <Predictive
              Parameter="nombreUpper"
              id={"nombreUpper"}
              change={setCliente}
              value={cliente}
              list={clientes}
              fn={(e) => {
                cliRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                //console.log(divRef.current.childNodes[2].childNodes[1]);
              }}
            />
          </div>

          <div ref={seriRef}>
            Series:
            <br />
            <Predictive
              Parameter="nombre"
              id={"nombreUpper"}
              change={setSerie}
              value={serie}
              list={series}
              fn={(e) => {
                seriRef.current.childNodes[0].childNodes[0].childNodes[0].blur();
                //console.log(divRef.current.childNodes[2].childNodes[1]);
              }}
            />
          </div>
        </div>

        <div className="columnas">
          Folio:
          <Div>
            <Input
              type="number"
              value={folio}
              change={(e) => setFolio(e.target.value)}
            />
          </Div>

          Fecha:
          <div>
            <Input
              type="date"
              value={expedicion}
              change={(e) => setExpedicion(e.target.value)}
            />
          </div>
          
        </div>
      </div>
      <br />

      <BlueButton text="Buscar" fn={handdleSubmit} />
      <br />
      <Table  theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos} />
    </form>
  );
};

export default Index;
//keyName='FACTURA'