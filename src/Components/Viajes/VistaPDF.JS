import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { fns } from "../../Functions";
function getData(docs){
    let array = new Array();
    docs.forEach((doc, index)=>{
        array.push([
            index+1,
            doc['idCliente']['nombre'],
            `${doc['serie']}-${doc['folio']}`,
            doc['destino'],
            doc['domicilioElegido'],//.replace(/ /g,'\n'),
            doc['unidades'],
            '',
            fns.moneyFormat(doc['total']),
            doc['observacion'].replace(/ /g,'\n'),
        ])
    });
    return array;
}

function getTotales(docs){
    let cantAcum = 0;
    let totAcum = 0;
    docs.forEach(doc=>{
        cantAcum += doc['unidades'];
        totAcum += doc['total'];
    })
    return {cantAcum, totAcum}
}

export  default function makePDF(viaje)
{
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.orientation="landscape";
    doc.setFontSize(35);
    const logo = new Image();
    logo.src = '/Public/CMP image 2.png';
    doc.addImage(logo,'JPG',10,0,35,35);
    doc.text('CARTA PORTE', 75, 13);
    doc.setFontSize(16);
    doc.text(viaje.origen,95,20);
    doc.text(viaje.rfc,125,28);
    doc.setFontSize(12);
    doc.text(`Domicilio de origen: ${viaje.direccion}`,6,39);
    doc.text(`Fecha de elaboración: ${fns.dateString(new Date(viaje.fecha))}`,6,43);
    doc.text(`Chofer: ${viaje.chofer}`, 6, 47);
    doc.text(`Auxiliar: ${viaje.auxiliar!=''&&viaje.auxiliar!=undefined?viaje.auxiliar:''}`, 6, 51);
    doc.text(`Gas de salida: ${viaje.gas}`, 111, 44);
    doc.text(`Fecha de Inicio de la ruta: ${fns.dateString(new Date(viaje.fechaRuta))}`, 191, 44);
    doc.text(`Automovil: ${viaje.auto}`, 6, 55);
    doc.text(`Placas: ${viaje.placas}`, 6, 59);
    doc.text(`Folio: ${viaje.serfol}`, 191, 52);
    doc.text(`Km de salida: ${viaje.km}`, 111, 48);
    doc.text(`Ruta: ${viaje.ruta}`, 191, 48);
    doc.text(`Observaciones del vaje: ${viaje.obs}`, 6, 63);
    const {cantAcum, totAcum} = getTotales(viaje.docs)
    doc.text(`Total de Productos: ${cantAcum}`, 111, 67);
    doc.text(`Total del Viaje: ${fns.moneyFormat(totAcum)}`, 111, 71);
    //getData(docs)
    doc.autoTable({
    head:[['No', 'Razon\nSocial', 'Factura', 'Destino', 'Domicilio', 'Total\nde\nProductos', 'Peso\nAproximado', 'Total', 'Observaciones']],
    body: getData(viaje.docs),
    startY: 75,
    styles:{
        fontSize: 10,
        width: 'fit-content',
        valign: 'middle',
        halign : 'center',
        cellWidth: '30'
    }
    });
    doc.setFontSize(7);
    let finalY = doc.previousAutoTable.finalY +5;
    doc.text('__________________________________________________________________________',9,finalY+13);
    doc.text('RECEPCIÓN DE DOCUMENTOS',225,finalY+19) ;
    doc.text('__________________________________________________________________________',190,finalY+13);
    doc.text('AUTORIZACIÓN CREDITO Y COBRANZA',35,finalY+19) ;
    return doc
  }