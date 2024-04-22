import { useEffect, useState } from 'react';
import * as fns from '../../../../Functions';
import BlueButton from '../../../../Components/BlueBotton';
import PickingConcentradoAdd from './picking.concentrado.add';
import PickingConcentradoRemove from './picking.oncentrado.remove';
import jsPDF from 'jspdf';

function PickingConcentrado() {
    const [picking, setPicking] = useState([]);
    const [deleteds, setDeleteds] = useState([]);
    const [filtreds, setFiltreds] = useState([])
    
    useEffect(()=>{
        const list = picking.filter(picked=>deleteds.indexOf(picked['index'])===-1);
        setFiltreds(list);
    },[picking, deleteds])


    function comprobarPicked(picked){
        let  nueva = true;
        const end = filtreds.length;
        for(let i=0; i<end; i++){
            const element =filtreds[i] 
            if(element['serie']===picked['serie']){
                if(
                    picked['inicio']>=element['inicio']&&picked['inicio']<=element['final']
                    ||picked['final']>=element['inicio']&&picked['final']<=element['final']
                    ||
                    element['inicio']>=picked['inicio']&&element['final']<=picked['inicio']
                    ||element['inicio']>=picked['final']&&element['final']<=picked['final']
                ){
                    nueva=false;
                    break;
                }
            }
        }
        return nueva;
    }

    function addPicked(picked, clear){
        if(comprobarPicked(picked)===true){
            setPicking(prev=>[...prev, {...picked, index:prev.length}])
            clear();
        }else{
            alert('No puedes mezclar rangos en el picking');
        }
    }

    function deletePicked(index){
        setDeleteds([...deleteds, index]);
    }

    async function sendData(empresa, ruta){
        if(ruta!==-1){
            const respuesta = await postData(`/almacen.inventario/guardar/${empresa}/${ruta}`)
            alert(respuesta);
        }else alert('La ruta no es valida');

    }
    async function postData(url){
        if(filtreds.length<=0){
            alert('Debe elegir un grupo de facturas');
            return null;
        }
        const respuesta = await fns.PostData(url,
        filtreds.map(filter=>{
            return {serie:filter['serie'], folioI:filter['inicio'], folioF:filter['final']}
        }));
        if(respuesta['mensaje']===undefined){
            return respuesta;
        }else{
            alert(respuesta['mensaje']);
            return null
        };
    }
    async function getData(url){
        const respuesta = await postData(url)
        console.log(respuesta);
        if(respuesta!==null){
            const array = respuesta.map((el, index)=>[(index+1), el['codigo'], el['nombre'], el['conteo']]);
            return array
        }
        return null;
        
    }
    
    async function makePDF(empresa, ruta){
        const data = await getData(`/almacen.inventario/calcular/${empresa}`);
        if(data===null)return
        let cont = 0
        data.forEach(el=>{
            cont += el[3];
        })
        const doc = new jsPDF('p', 'mm', 'a4');
        const currentDate = new Date();
        const day = currentDate.getDay();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear(); 
        const names = filtreds.map(picked=>{
            return {nombre:picked['serie'], rango:`${picked['inicio']}-${picked['final']}`}
        })
        doc.setFontSize(12);
        let string = '';
        if(empresa==='cdc')string = 'COMERCIAL DOMOS COPERNICO S.A. DE C.V.'
        if(empresa==='cmp')string = 'CENTRAL MAYORISTA DE PANELES S.A. DE C.V.'
        doc.text(string, 40, 16);
        doc.text(`Compilado de picking`, 160, 16);
        let yAxis = 23;
        names.forEach(name=>{
            doc.text(`${name['nombre']}: ${name['rango']}`, 162, yAxis);
            yAxis +=7
        })
        const logo = new Image();
        logo.src = '/Public/CMP image 2.png';
        doc.addImage(logo,'JPG',5,5,35,35);
        doc.text(`Fecha ${day<=9?`0${day}`:day}/${month<=9?`0${month}`:month}/${year}`, 40, 22);
        doc.text(`Total de productos: ${cont}`, 40, 28);
        doc.text(ruta, 40, 34);
        doc.autoTable({
            head:[['#', 'Codigo','Producto', 'Cantidad']],
            body: data,
            startY: yAxis<42?42:yAxis+7,
            styles:{
              fontSize: 8,
              width: 'fit-content',
              valign: 'middle',
              halign : 'center',
              cellWidth: 'wrap'
          }
          });
        window.open(doc.output("bloburl"), "Carta", "width=inherit, height=0");
    }

    function showPicking(){
        return picking.map((picked, index)=>{
            if(deleteds.indexOf(index)!==-1)return null
            else return <PickingConcentradoRemove element={picked} index={index} key={index} fn={deletePicked}/>
        }) 
    }
    return (
        <div className='flex flex-col items-center'>
            <label className='text-4xl text-cyan-800 font-extrabold'>
                Concentrado de Picking
            </label>
            <br />
            <PickingConcentradoAdd fn={addPicked} print={makePDF} save={sendData}/>
            <br />
            {showPicking()}
        </div>
    )
}

export default PickingConcentrado

        /*const array = filtreds.map(
            picked=>picked['array']
        ).reduce((acumulador, arreglo) => acumulador.concat(arreglo), [])
        .map(el=>[el['codigo'], el['nombre'], el['conteo']]);
        /*.map(el=>{
            const result = [el['nombre'], el['conteo']] 
            return result
        });*/