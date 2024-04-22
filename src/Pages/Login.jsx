import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Functions from '../Functions'
import Input from '../Components/Input'
import BlueBotton from '../Components/BlueBotton'
import Logo from '../Components/Logo'

const Login = () => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    //const [alerta, setAlerta] = useState({});

    const navigate = useNavigate();
    async function sendPassword(){
        if([nombre, password].includes('')){
            alertar('Algun campo está vacío');
        }else{
            try {
                const respuesta = await Functions.PostData('/auth/ingresar',
                    {usuario:nombre, psw:password}
                );
                if(respuesta['mensaje'] !== undefined){
                    alert(respuesta['mensaje']);
                }else if(respuesta['id']!==undefined){
                    //if(respuesta['area']==='CYC'||respuesta['area']==='GRC'){
                        //sessionStorage.session = respuesta['id'];
                    sessionStorage.setItem('id',respuesta['id']);
                    sessionStorage.setItem('area',respuesta['area']);
                    sessionStorage.setItem('start',Date.now());
                    Functions.setSesion(respuesta['id']);
                    navigate(`/Menus/${respuesta['id']}`);
                    //}else alert('el usuario no tiene acceso a este modulo');
                }else{
                    alertar('Usuario Inexistente');    
                }
            } catch (error) {
                console.log(error);
                alertar('Algo salio mal desde la interfaz, reportar a soporte');
            }
        }
        //const name = document.getElementById('Nombre');
        //const psw = document.getElementById('Password');
        //validar Usuario
        //
    }
    function alertar(msg){
        alert(msg);
    }
    return (
        <div className=" cmpColor flex h-full justify-center">
            <div className="flex flex-col h-full">
                <Logo custom='w-96 self-center'/>
                <div className=" flex flex-row">
                    <div className="flex flex-col">
                        <label className=" text-white calibri text-5xl text-end">
                            Usuario
                        </label>
                        <label className=" text-white calibri text-5xl text-end">
                            Contraseña
                        </label>
                    </div>
                    <div className="">
                        <div className="flex flex-col mt-2">
                            <Input fn = {sendPassword} id = 'Nombre' change ={e=>{setNombre(e.target.value)}} value={nombre}/>
                            <br />
                            <Input type='password' fn = {sendPassword} id = 'Password' change={e=>{setPassword(e.target.value)}} value={password}/>
                        </div>
                    </div>
                </div>
                <BlueBotton text='Enviar' fn = {sendPassword}/>
            </div>
        </div>
    )
}

export default Login
