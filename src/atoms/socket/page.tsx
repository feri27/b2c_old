// 'use client';
// import { generateEightDigitNum } from '@/utils/helpers';
// import axios from 'axios';
// import React, { useState } from 'react';
// import io, { Socket as SocketIO } from 'socket.io-client';

// const rand = generateEightDigitNum();
// function Socket() {
//   const [data, setData] = useState('');
//   const [socket, setSocket] = useState<SocketIO>();
//   const handleClick = async () => {
//     const res = await axios.post('http://localhost:5000/api/callfromfe', {
//       status: 'C',
//       id: rand,
//     });
//     let newSocket = socket;
//     if (!socket) {
//       console.log('hereeee');
//       newSocket = io('http://localhost:5000');
//       newSocket.emit('start', { txnID: rand });
//       setSocket(newSocket);
//     }

//     console.log(res.data);

//     // Listen for WebSocket events
//     newSocket!.on('data', (data) => {
//       console.log('here');
//       console.log({ data });

//       setData(data);
//       // Close the WebSocket connection
//       newSocket!.disconnect();
//     });
//   };
//   return (
//     <>
//       <div>Socket</div>
//       <button onClick={handleClick}>Connect</button>
//       <div>{JSON.stringify(data)}</div>
//     </>
//   );
// }

// export default Socket;
