import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';

let socket;


const Chat = () => {
   const location = useLocation();

   const [name, setName] = useState('');
   const [room, setRoom] = useState('');
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);
   const ENDPOINT = 'localhost:5000';
   
   useEffect(() => {
       const {name, room} = queryString.parse(location.search);

       socket = io(ENDPOINT);

       setName(name);
       setRoom(room);

       console.log(socket);
       socket.emit('join', {name, room}, () => {
           
       });

       return () => {
           socket.emit('disconnect');
           socket.off();
       }
   }, [ENDPOINT, location.search]);
 
   useEffect(() => {
       socket.on('message', (message) => {
        setMessages([...messages, message]);
       })
   }, [messages]);

   const sendMessage = (event) => {
       event.preventDefault();
       if(message) {
           socket.emit('sendMessage', message, () => setMessage(''));
       }
   }

   console.log(message, messages);

   return (
     <div className="outerContainer">
       <div className="container">
         <InfoBar room={room} />
       </div>
     </div>
   );
}

export default Chat;