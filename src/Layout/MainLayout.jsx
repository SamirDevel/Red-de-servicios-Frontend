import { useParams, Outlet } from "react-router-dom"
import { useEffect, useState } from "react";
import Login from "../Pages/Login";
import IconButton from '../Components/IconButton'
import {FiLogOut} from 'react-icons/fi'
import * as Functions from '../Functions'
import Dog from '../Components/Dog'
import Modal from "../Components/Modal";
import { useSelector } from "react-redux";

function MainLayout(props) {
  const params = useParams();
  const loadModalRedux = useSelector(state=>{
    return state.loadModal.loading
  });
  const [loading, setLoading] = useState(false); 
  useEffect(()=>{
    setLoading(loadModalRedux)
  },[loadModalRedux])

  const stored = sessionStorage.getItem("id");
  const start = sessionStorage.getItem("start");
  const startChanged = (start/1000);
  const currentTime = (Date.now()/1000);
  const transcurred = currentTime-startChanged;
  if(params.id!==undefined){
    if(stored !== params.id||(transcurred)>(60*60)){
      sessionStorage.clear();
      return(<Login/>)
    }
    else Functions.setSesion(params.id);
  }
  //console.log(currentTime-startChanged);
  return (
      <div className="select-none h-screen">
        <div className="cmpColor text-white flex flex-row justify-between">
          <div>
            <h1
            className=" text-5xl font-extrabold h-fit">
                {props.text}
            </h1>
          </div>
        <div className="flex flex-row">
          <IconButton icon={<FiLogOut size={35} className='redHover'/>} fn={async()=>{
            const respuesta = await Functions.PostData(`/auth/salir/${stored}`,{});
            console.log(respuesta);
            alert(respuesta['mensaje']);
            sessionStorage.clear();
            window.location.reload();
            //console.log(sessionStorage)
          }}/>
        </div>
        </div>
        {(()=>{
          if(loading===true)return <Modal isOpen={loading}  component={<Dog/>}/>
        })()}
        <div className="h-full">
        <Outlet/>
        </div>
      </div>
    )
}

export default MainLayout