// this is a test to check the connection between the client and the server

const io = require('socket.io-client');

// Connect to the backend WebSocket server
const socket = io('http://localhost:5000');

socket.on('connect', () => {
    console.log('Connected to server as', socket.id);

    // Join a test group
    socket.emit('joinGroup', { groupId: 'test-group', username: 'User1', latitude: 7.8731, longitude: 80.7718 });

    // Listen for updates
    socket.on('updateGroup', (members) => {
        console.log('Updated group members:', members);
    });

    // Simulate location update
    setTimeout(() => {
        console.log('Updating location...');
        socket.emit('updateLocation', { groupId: 'test-group', latitude: 7.8735, longitude: 80.7720 });
    }, 5000);

    // Disconnect after 10 seconds
    setTimeout(() => {
        console.log('Disconnecting...');
        socket.disconnect();
    }, 10000);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
