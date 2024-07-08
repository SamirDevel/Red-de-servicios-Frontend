import { useState, useEffect } from 'react'
import ComisionChoferRow from './ComisionChoferRow'
import { fns } from '../../../../../Functions';

function TablaComisionChofer({rows, save, fn, fechaI, fechaF}) {
    const [totalDescuentos, setTotalDescuentos] = useState(0)
    const [descuentos, setDescuentos] = useState([rows])
    const [total, setTotal] = useState(0)

    let totalLocales = 0;
    let totalJalisco = 0;
    let totalForaneos = 0;
    let totalaViajes = 0;
    let totalAux = 0;
    let pagoLocales = 0;
    let pagoJalisco = 0;
    let pagoForaneos = 0;
    let pagoAux = 0;
    let totalSubtotal = 0;

    function acumDes(){
        let acum = 0;
        rows.forEach(element => {
            acum += element.descuento;
        });
        setTotalDescuentos(acum);
    }
    function acumTot(){
        let acum = 0;
        rows.forEach(element => {
            acum += element.totalApagar;
        });
        setTotal(acum);
    }
    return (
        <table>
            <thead className='bg-blue-950 text-white'>
                <tr>

                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Foraneos</th>
                    <th>Pago</th>
                    <th>A Jalisco</th>
                    <th>Pago</th>
                    <th>Locales</th>
                    <th>Pago</th>
                    <th>Viajes</th>
                    <th>Auxiliar</th>
                    <th>Pago</th>
                    <th>Subtotal</th>
                    <th>Descuentos</th>
                    <th>Motivo</th>
                    <th>Total</th>
                    <th>Abrir</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((element, index) => {
                    totalLocales += element.LOCALES
                    totalJalisco += element.JALISCO
                    totalForaneos += element.FORANEOS
                    totalAux += element.AUXILIAR
                    pagoLocales += element.TOTALL
                    pagoJalisco += element.TOTALJ
                    pagoForaneos += element.TOTALF
                    pagoAux += element.TOTALA
                    totalaViajes += element.VIAJES
                    totalSubtotal += element.TOTALL + element.TOTALJ + element.TOTALF + element.TOTALA
                    return <ComisionChoferRow raw={element} key={`${element.CODIGO}-${index}`} totDes={acumDes} tot={acumTot} save={save} fn={fn}/>
                })}
            </tbody>
            <tfoot className='bg-blue-950 text-white'>
                <tr>
                    <td></td>
                    <td></td>
                    <td>{totalForaneos}</td>
                    <td>{fns.moneyFormat(pagoForaneos)}</td>
                    <td>{totalJalisco}</td>
                    <td>{fns.moneyFormat(pagoJalisco)}</td>
                    <td>{totalLocales}</td>
                    <td>{fns.moneyFormat(pagoLocales)}</td>
                    <td>{totalaViajes}</td>
                    <td>{totalAux}</td>
                    <td>{fns.moneyFormat(pagoAux)}</td>
                    <td>{fns.moneyFormat(totalSubtotal)}</td>
                    <td>{fns.moneyFormat(totalDescuentos)}</td>
                    <td></td>
                    <td>{fns.moneyFormat(total)}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
    )
}

export default TablaComisionChofer