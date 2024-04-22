import clienteAxios from "./Config/axios";
import store from "./store";
import { loading, done } from "./LoadModalSlice";

let idSes=0; 
//#region Manejo de sesiones (pasar a Axios)
export function setSesion(nuevaSes){
    idSes = nuevaSes;
}

export function getSesion(){
    return idSes;
}
//#endregion
//#region manejo de peticiones http
async function execHTTP(callback){
    try{
        const cronometro = setTimeout(() => {
            store.dispatch(loading())
        }, 500);
        const datos = await callback();
        clearTimeout(cronometro);
        if(store.getState().loadModal.loading ===true)setTimeout(()=>{
            store.dispatch(done())
        },3000)
        //console.log(datos);
        return datos.data;
    } catch (error) {
        console.log(error)
        return {mensaje:'Ocurrio un error desde el cliente. Reportar a soporte técnico'}
    }
}
export async function PostData(url, body){
    return execHTTP(async ()=>{
        return await clienteAxios.post(url, body,{headers:{idSes}});
    })
}

export async function PatchData(url, body){
    return execHTTP(async ()=>{
        return await clienteAxios.patch(url,body,{headers:{idSes}});
    })
}
export async function GetData(url){
    
    return execHTTP(async ()=>{
        return await clienteAxios.get(url,{headers:{idSes}});
    })
} 
export async function DeleteData(url){
    return execHTTP(async ()=>{
        return await clienteAxios.delete(url,{headers:{idSes}});
    })
} 
//#endregion
//#region Formatos visuales de datos
export function moneyFormat(number){
    const formater = new Intl.NumberFormat('en-Us',{
        style: 'currency',
        currency: 'USD'
    });
    return formater.format(number);
}
export function fixed(numero=0){
    return parseFloat(numero.toFixed(2));
}
function addZeroFirst(number){
    return number<10?`0${number}`:number
}
export function dateString(date){
    //const day = new Date();
    return `${date.getUTCFullYear()}-${addZeroFirst(date.getUTCMonth()+1)}-${addZeroFirst(date.getUTCDate())}`
}
//#endregion
//#region funciones sobre arreglos
export function filtrar(arreglo1, arreglo2, criterio){
    //console.log(arreglo);
    return new Promise((resolve)=>{
        const arreglo = new Array();
        const end = arreglo1.length;
        const end2 = arreglo2.length;
        for(let i=0; i<end; i++){
        let repetida = false;
        for(let j=0; j<end2; j++){
            if(arreglo1[i][criterio] == arreglo2[j][criterio]){
            repetida=true;
            break;
            }
        }
        if(repetida==false)arreglo.push(arreglo1[i]);
        }
        resolve(arreglo.concat(arreglo2));
    });
}

export function quicksort(array, criterio) {
    if (array.length <= 1) {
      return array;
    }
    const pivot = array[0][criterio];
    const left = []; 
    const right = []
    for (var i = 1; i < array.length; i++) {
      array[i][criterio] < pivot ? left.push(array[i]) : right.push(array[i]);
    }
    return quicksort(left,criterio).concat(array[0], quicksort(right, criterio));
}

export function find(array, criteria, value,toFind){
    const end = array.length;
    for(let i=0;i<end; i++){
        if(array[i][criteria]==value)return array[i][toFind];
    }
    return -1;
}
  
export function reversequicksort(array, criterio) {
    if (array.length <= 1) {
      return array;
    }
    const pivot = array[0][criterio];
    const left = []; 
    const right = []
    for (var i = 1; i < array.length; i++) {
      array[i][criterio] > pivot ? right.push(array[i]) : left.push(array[i]);
    }
    return reversequicksort(right,criterio).concat(array[0], reversequicksort(left, criterio));
};
//#endregion
//alerta de arreglo de errores
export function alertar(errores=[]){
    errores.forEach(item=>{
        alert(item);
    })
}
//diferencia de dias ente dos fechas
export function daysDif(fecha1=Date,fecha2=Date){
    const difTime = fecha1.getTime() - fecha2.getTime();
    const dif = difTime/(1000*60*60*24);
    return parseFloat(dif.toFixed(0));
}
//limitador de caracteres y numeros para formats numericos y alfanumericos
export function runStr(cad='', callback){
    const end = cad.length;
    let result=''
    for(let i=0; i<end; i++){
      result += callback(cad[i]);
    }
    return result;
}
export function compareLetters(char=''){
    return (char>='A'&&char<='Z')||char==='Ñ';
}
export function compareNumbers(char){
    return char>='0' && char<='9';
}
export function compare(char='', fn){
    if(fn(char)===true)return char;
    else return ''
}
export function numberLimited(value, state, limit){
    if(value===null||value===''){
      state('')
      return
    }
    const numeros = runStr(value.substring(0,limit), (char)=>compare(char,compareNumbers));
    if(numeros.length<=limit)state(numeros);
}
//solo para variables que no son listas;
//creador de query para peticiones HTTP
export function makeUrlQuery(params){
    let cadena = ''
    let first = false;
    const keys = Object.keys(params);
    keys.forEach(key=>{
        if(params[key]!==''&&params[key]!==null&&params[key]!==undefined){
            if(first===false){
                cadena+='?';
                first = true;
            }else cadena+='&'
            cadena+=`${key}=${params[key]}`;
        }
    })
    return cadena;
}
//Strategy para patron de funciones en 3 pasos para predictivos
/*
Paso 1: arreglo de opciones
Paso 2: seleccionar una cadena para mostrar en el input
Paso 3: buscar la inicdencia en el areglo en llave y valor y obtener el valor deseado
*/
export function setStateE(comparer='', array=[], key='', callback){
    if(comparer===''){
        callback('')
        return;
    }
    array.forEach(element=>{
        if(element[key]===comparer){
            callback(element);
            return
        }
    })
}
//#region datos fiscales y de direcciones
export function getDatosFiscales(empresa){
    const dom = 'Calle Virgen-5485 Colonia Arboledas C.P:45070, Zapopan, Jalisco';
    if(empresa==='cdc')return {
        dom,
        origen:'COMERCIAL DOMOS COPERNICO',
        rfc:'CDC9910202M3'
    }
    if(empresa==='cmp')return {
        dom,
        origen:'CENTRAL MAYORISTA DE PANELES',
        rfc:'CMP081124CK3'
    }
    else return{
        dom:'',
        origen:'',
        rfc:''
    }
  }
//#endregion
export * as fns from './Functions.js'