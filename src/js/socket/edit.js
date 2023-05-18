import io from "socket.io-client";

let socket = null

export const initSocket = (context) => {
    socket = io(context.$crudURL,{
        cors: { origin: '*' },
        transports: ['websocket']
    });

    // socket.on('connect', () => {
    //   console.log('connected to server');
    //   socket.emit('join',"test")
    //
    //   socket.once('disconnect', () => {
    //     console.log('disconnected from server');
    //   });

    //   let syncInProgress = false;
    //   // 서버로부터 변경사항을 받음
    //   socket.on('sync_sentence', (sync_str) =>{
    //     if (syncInProgress) {
    //       return;
    //     }
    //     syncInProgress = true;
    //     const encodedSync = toUint8Array(sync_str)
    //     console.log("sync start. update before", sentence_map.toJSON())
    //     Y.applyUpdate(ydoc, encodedSync)
    //     console.log("sync fin. after", sentence_map.toJSON())
    //
    //     const map = ydoc.getMap('sentence');
    //     tags.length = 0;
    //     map.forEach((value, key) => {
    //       tags.push({
    //         id: key,
    //         tag: value
    //       })
    //     })
    //     jsonKey += 1;
    //     dataKey += 1;
    //
    //     syncInProgress = false;
    //   })
    //
    //   let isEmitting = false;
    //
    //   socket.on('update_sentence_ok', () =>{
    //     isEmitting = false;
    //   })
    //
    //   const sync = () => {
    //     if (isEmitting) {
    //       return;
    //     }
    //     isEmitting = true;
    //     const changes = Y.encodeStateAsUpdate(ydoc)
    //     const encodeChanges = fromUint8Array(changes)
    //     if (encodeChanges.length > 0) {
    //       // 다른 클라이언트에게 변경사항을 전송
    //       socket.emit('update_sentence', {room: "test", msg: encodeChanges});
    //     }
    //     jsonKey += 1;
    //     dataKey += 1;
    //   }
    //   setInterval(sync, 100);
    //
    //   jsonKey += 1;
    //   dataKey += 1;
    // })

    return socket
}