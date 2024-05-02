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
  const [fechaI, setFechaI] = useState("");
  const [fechaF, setFechaF] = useState("");
  const [tipoDoc, setTpoDoc] = useState("");
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
        ABRIR:<OpenButtonIcon size={30} url={
          `${window.location}/cerrar/${factura.serie}/${factura.folio}/${tipoDoc}`
        } emergente={true}/>,
        MOTIVO:factura.motivo,
        REVISION:factura.fecha!==undefined?fns.dateString(new Date(factura.expedicion)):''
      }
    }))
  }, [facturas])
  useEffect(()=>{
    setFacuras([])
  }, [tipoDoc])

  async function handdleSubmit(e) {
    e.preventDefault();
    console.log(clienteE)
    const queryStr = fns.makeUrlQuery({
      serie,
      folio,
      fechaI,
      fechaF,
      cliente:clienteE.codigo
    });
    //console.log(queryStr);
    const url = (()=>{
      const cad = `credito.cobranza/viajes/facturas/sin_relacion`;
      if(tipoDoc==='pendiente')return cad;
      if(tipoDoc==='revisado')return `${cad}/cerradas`;
    })()
    if(tipoDoc===''){
      alert('Debe seleccionar un tipo de documento')
    }else{
      const respuesta = await fns.GetData(`${url}${queryStr}`);
      console.log(respuesta);
      if (respuesta["mensaje"] === undefined) {
        setFacuras(respuesta);
      } else alert(respuesta["mensaje"]);
    }
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
                cliRef.current.childNodes[1].childNodes[0].childNodes[0].blur();
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
                seriRef.current.childNodes[2].childNodes[0].childNodes[0].blur();
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

          Fecha Inicial:
          <div>
            <Input
              type="date"
              value={fechaI}
              change={(e) => setFechaI(e.target.value)}
            />
          </div>
          Fecha Final:
          <div>
            <Input
              type="date"
              value={fechaF}
              change={(e) => setFechaF(e.target.value)}
            />
          </div>
          Tipo de documento:
          <div className="columnas">
            <label>
                <input type="radio" name='documento' value={'pendiente'} onChange={e=>setTpoDoc(e.target.value)}/>
                <span className="mx-1"/>
                Sin revisar
            </label>
            <label>
              <input type="radio" name='documento' value={'revisado'} onChange={e=>setTpoDoc(e.target.value)}/>
              <span className="mx-1"/>
              Revisado
            </label>
          </div>
          
        </div>
      </div>
      <br />

      <BlueButton text="Buscar" fn={handdleSubmit} />
      <br />
      <div className={`${tipoDoc==='pendiente'?'visible':'hidden'}`}>
        <Table  theme='bg-blue-950 text-white' colsHeads={heads} list={objetos} manage={setObjetos} keyName='FACTURA'/>
      </div>
      <div className={`${tipoDoc==='revisado'?'visible':'hidden'}`}>
        <Table  theme='bg-blue-950 text-white' colsHeads={[
          ...heads
          ,{text:'Motivo', type:'string'}
          ,{text:'Revision', type:'string'}
        ]} list={objetos} manage={setObjetos} keyName='FACTURA'/>
      </div>
    </form>
  );
};

export default Index;
//