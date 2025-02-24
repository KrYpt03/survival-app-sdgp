const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

const groups = new Map(); // store activee groups with members

//handle socket connection
io.on('connection', (socket) =>{
    console.log('A user connected',socket.id);

    socket.on('joinGroup',({groupId, username, lattitude, longitude})=>{
        if(!groups.has(groupId)){
            groups.set(groupId, []);
        }

        const members= groups.get(groupId);
        members.push({id:socket.id, username, lattitude,longitude});
        groups.set(groupId, members);
        socket.join(groupId);
        io.to(groupId).emit('updateGroup', members);
    });

    // Update location
    socket.on('updateLocation', ({ groupId, latitude, longitude }) => {
        const members = groups.get(groupId) || [];
        const memberIndex = members.findIndex(m => m.id === socket.id);
        if (memberIndex !== -1) {
            members[memberIndex].latitude = latitude;
            members[memberIndex].longitude = longitude;
            io.to(groupId).emit('updateGroup', members);
        }
    });

    // Leave group or disconnect
    socket.on('disconnect',()=>{
        for(const[groupId,members]of groups.entries()){
            const updateMembers = members.filter(m=>m.id !== socket.id);
            if (updateMembers.length ===0){
                groups.delete(groupId);
            }else{
                groups.set(groupId, updateMembers);
                io.to(groupId).emit('updateGroup', updateMembers);
            }
        }
        console.log('A user disconnected', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
