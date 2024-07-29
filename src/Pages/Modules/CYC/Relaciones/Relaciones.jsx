import { useState, useEffect } from 'react';
import Table from '../../../../Components/Table'
import Input from '../../../../Components/Input';
import Select from '../../../../Components/Select';
import IconButton from '../../../../Components/IconButton';
import * as Functions from '../../../../Functions.js'
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFiletypePdf } from 'react-icons/bs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '../../../../Components/Logo.jsx';
function Relaciones() {
  //Partes para el componente Table
  const colsN = ['', 'No', 'Fecha', 'Serie', 'Folio', 'Razon Social', 'Total', 'Pendiente', 'Vencimiento', 'Ciudad', 'Observaciones'];
  const colsKeys = ['BORRAR', 'NUMBER', 'EXPEDICION', 'SERIE', 'FOLIO', 'NOMBRE', 'TOTAL', 'PENDIENTE', 'VENCIMIENTO', 'MUNICIPIO', 'OBSERVACIONES'];
  //States
  const [series, setSeries] = useState([]);
  const [serie, setSerie] = useState('-1');
  const [rutas, setRutas] = useState([]);
  const [ruta, setRuta] = useState('-1');
  const [agentes, setAgentes] = useState([]);
  const [agente, setAgente] = useState('-1');
  const [folio, setFolio] = useState('');
  const [periodoInicial, setPeriodoInicial] = useState('');
  const [periodoFinal, setPeriodoFinal] = useState('');
  const [objeto, setObjeto] = useState({});
  const [facturas, setFacturas] = useState([]);
  const [objetos, setObjetos] = useState([]);
  const [eliminado, setEliminado] = useState(0);
  const [pendientes, setPendientes] = useState([]);
  
  //Effects
  useEffect(()=>{
    async function getSeries(){
      try {
        const respuesta = await Promise.all([Functions.GetData(`/documentos/series/corp`), Functions.GetData(`/documentos/rutas/corp`), Functions.GetData(`/agentes/agentes/corp`)]);
        setSeries(respuesta[0]);
        setRutas(respuesta[1]);
        setAgentes(respuesta[2]);
      } catch (error) {
        console.log(error);
      }
    }
    getSeries();
  },[]);

  useEffect(()=>{
    let repetida = false;
      objetos.forEach(item=>{
        if(objeto['ID']==item['ID']){
          repetida = true;
          return;
        }
      });
    if(objeto['ID']!=undefined&&!repetida){
      setObjetos([...objetos, ...[objeto]]);
    }
    if(repetida==true)alert('La factura ya se encuentra den el documento');
  },[objeto]);

  useEffect(()=>{
    //console.log(facturas);
  },[objetos]);

  useEffect(()=>{
    //console.log(facturas);
  },[facturas]);

  useEffect(()=>{

    setObjetos(objetos.filter(objeto=>objeto['ID']!=eliminado));
    setFacturas(facturas.filter(factura=>factura['ID']!=eliminado));
    setPendientes(facturas.filter(factura=>factura['ID']!=eliminado));
  },[eliminado])

  //Funciones
  async function validar(){
    if(folio<1){
      alert('El folio debe ser un numero positivo mayor que 1');
    }else if(serie ==-1){
      alert('No se ha seleccionado una serie');
    }
    else{
      getFactura();
    }
  }

  async function getFactura(){
    try {
      const factura = await Functions.GetData(`/documentos/documento/corp/${serie}/${folio}?cliente=true&dom=true`);
      if(factura==''){
        alert('Factura no encontrada o Inexistente');
        setFolio('');
      }else{
        console.log(factura);
        let {id, expedicion, serie, folio, total, pendiente, vencimientoReal, atraso} = factura;
        expedicion = expedicion.substring(0,10);
        vencimientoReal.substring(0,10);
        total = Functions.moneyFormat(total);
        pendiente = Functions.moneyFormat(pendiente);
        const obj = {
          ID:id,
          BORRAR: <IconButton icon={
              <AiTwotoneDelete className='redHover' size={25}/>
          } id={id} fn={e=>{setEliminado(id)}}/>,
          NO: '',
          EXPEDICION:expedicion,
          SERIE:serie,
          FOLIO:folio,
          NOMBRE:factura['idCliente']['nombre'],
          TOTAL:total,
          PENDIENTE:pendiente,
          VENCIMIENTO:Functions.dateString(new Date(vencimientoReal)),
          MUNICIPIO:factura['idCliente']['domicilios'][0]['municipio'],
          OBSERVACIONES:<Input type = 'text' id={`observacion-${id}`}/>
        }
        setObjeto(obj);
        setFacturas([...facturas, factura]);
        if(atraso<0){
          setPendientes([...pendientes, factura]);
        }
        setFolio('');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getData(heads){
    let array = new Array();
    const array2 = new Array();
      const end = objetos.length;
      const end2 = heads.length;
      for(let i=0; i<end; i++){
        array.push(i+1);
        for(let j=1; j<end2-1; j++)
          array.push(objetos[i][heads[j]]);
        array.push(document.getElementById(`observacion-${objetos[i]['ID']}`).value)
        array2.push(array);
        array = new Array();
      }
      return array2;
  }
  function makePDF(){
    if(periodoInicial != '' && periodoFinal != '' && periodoInicial<periodoFinal)
    {
      const months = ['Enero', 'Ferero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const currentDate = new Date();
      const fechaInicial = new Date(periodoInicial);
      const fechaFinal = new Date(periodoFinal);
      const doc = new jsPDF('l', 'mm', 'a4');
      doc.orientation="landscape";
      const logo = new Image();
      logo.src = '/Public/CMP image 2.png';
      doc.addImage(logo,'JPG',0,0,35,35);
      doc.setFontSize(12);
      doc.text('COMERCIAL DOMOS COPERNICO SA DE CV', 35, 11);
      doc.text('CENTRAL MAYORISTA DE PANELES SA DE CV', 35, 18);
      doc.text('PROYECTOS E INSTALACIONES COPERNICO SA DE CV', 35, 25);
      doc.text('Entrega de Documentos', 165, 11);
      doc.text(`Expedido el ${currentDate.getDate()} de ${months[currentDate.getMonth()]} del ${currentDate.getFullYear()}`, 165, 18);
      doc.text(`Con periodo del ${fechaInicial.getDate()+1} de ${months[fechaInicial.getMonth()]} del ${fechaInicial.getFullYear()} al ${fechaFinal.getDate()+1} de ${months[fechaFinal.getMonth()]} del ${fechaFinal.getFullYear()}`, 165, 25);
      const heads = ['NO', 'EXPEDICION', 'SERIE', 'FOLIO', 'NOMBRE', 'TOTAL', 'PENDIENTE', 'VENCIMIENTO', 'MUNICIPIO', 'OBSERVACIONES'];
      doc.text(`RUTA: ${ruta}`,35,32);
      doc.text(`AGENTE: ${agente}`,35,37);
      doc.autoTable({
        head:[['No', 'Fecha', 'Serie', 'Folio', 'Razon Social', 'Total', 'Pendiente', 'Vencimiento', 'Ciudad', 'Observaciones']],
        body: getData(heads),
        startY: 42,
        styles:{
          fontSize: 8,
          width: 'fit-content',
          valign: 'middle',
          halign : 'center',
          cellWidth: 'wrap'
      }
      });
      doc.setFontSize(7);
      let finalY = doc.previousAutoTable.finalY +5;
      doc.text('DOCUMENTOS', 35, finalY);
      doc.text(objetos.length.toString(), 55, finalY);
      finalY += 4;
      doc.text('PAGADOS', 35, finalY);
      doc.text((objetos.length - pendientes.length).toString(), 55, finalY);
      finalY += 4;
      doc.text('PENDIENTES', 35, finalY);
      doc.text(pendientes.length.toString(), 55, finalY);
      window.open(doc.output("bloburl"), "Carta", "width=inherit, height=0");
    }
    else{
      alert('No se ha seleccionado un periodo valido del documento');
    }
  }
  return (
    <div>  
      <div className=' flex flex-row w-'>
        <Logo custom='mx-2 w-20'/>
        <div className=' flex flex-col justify-center'>
            <label htmlFor="">
              COMERCIAL DOMOS COPERNICO SA DE CV
            </label>
          <label htmlFor="">
            CENTRAL MAYORISTA DE PANELES SA DE CV
          </label>
          <label htmlFor="">
            PROYECTOS E INSTALACIONES COPERNICO SA DE CV
          </label>
        </div>
      </div>
      <div className=' flex justify-around text-sm'>
        <label htmlFor="">
          PERIODO DESDE: 
          {" "}
          <Input type = 'date' id='periodoInicial' change = {e=>{setPeriodoInicial(e.target.value)}} value = {periodoInicial}/>
        </label>
        <label htmlFor="">
          HASTA: 
          {" "}
          <Input type = 'date' id='periodoFinal' change = {e=>{setPeriodoFinal(e.target.value)}} value = {periodoFinal}/>
        </label>
        <label htmlFor="">
          RUTA: 
          {" "}
          <Select list = {rutas} criterio = {'nombre'} value = {ruta} fn = {e=>{setRuta(e.target.value)}}/>
        </label>
        <label htmlFor="">
          AGENTE: 
          {" "}
          <Select list = {agentes} criterio = {'nombre'} value = {agente} fn = {e=>{setAgente(e.target.value)}}/>
        </label>
      </div>
      <div>
        <br />
      </div>
      <div className=' flex justify-around text-sm'>
        <label htmlFor="">
          SERIE: 
          {" "}
          <Select list = { series} criterio = 'nombre' value = {serie} fn = {e=>{setSerie(e.target.value)}}/>
        </label>
        <label htmlFor="">
          FOLIO: <Input type = 'number' fn = {validar} id='folio' change = {e=>{setFolio(e.target.value)}} value = {folio}/>
        </label>
        <IconButton icon={<BsFiletypePdf size={35} className='redHover'/>} fn={makePDF}/>
      </div>
      <br />
      <div className=' flex justify-center'>
        <Table colsNames={colsN} colsKeys={colsKeys} values={objetos} manage={setObjetos}/>      
      </div>
    </div>
  )
}

export default Relaciones
