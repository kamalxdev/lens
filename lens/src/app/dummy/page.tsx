'use client';



import { useSocket } from '@/provider/socket';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';


export default function Home() {
  // @ts-ignore
  const {socket}=useSocket();

  const [data,setData]=useState({
    name:"",
    email:"",
    room:""
  });
  const router=useRouter();
  useEffect(() => {

    socket.on("room:joined", (data:{room:string}) => {
      console.log("You've joined the room",data);
      router.push(`/room/${data.room}`);
    });

  }, [socket]);




  function handleJoinRoom(){
    socket.emit("room:join",data);
  }
  return (
    <div className="App">
      <header className="App-header">
        <input type="text" placeholder='Enter Name' onChange={(e)=>setData({...data,name:e.target.value})}/>
        <input type="text" placeholder='Enter Email' onChange={(e)=>setData({...data,email:e.target.value})}/>
        <input type="text" placeholder='Enter room code' onChange={(e)=>setData({...data,room:e.target.value})}/>
        <button type='button' onClick={handleJoinRoom}>Submit</button>
      </header>
    </div>
  );
}
