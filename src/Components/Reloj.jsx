import {useEffect, useState} from 'react'

function Reloj() {
    const [hora, setHora] = useState('');
    const [fecha, setFecha] = useState('');

    function format(variable){
        return (variable < 10 ? `0${variable}` : variable);
    }
    function actualizarHora(){
        const now = new Date();
        const horas = format(now.getHours());
        const minutos = format(now.getMinutes());
        const segundos = format(now.getSeconds());
        setHora(`${horas}:${minutos}:${segundos}`);
    };
    function calculateFecha(){
        const weekday = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
        setFecha(`${weekday[new Date().getDay()]} ${new Date().toLocaleString('es-US', {month: 'numeric', year: 'numeric', day:'numeric'})}`);
    }

    useEffect(() => {
        calculateFecha();
        const intervalId = setInterval(actualizarHora, 1000);
        return () => clearInterval(intervalId);
      }, []);
    
    return (
        <>
            {`${fecha}-${hora}`}
        </>
    )
}

export default Reloj