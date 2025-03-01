// this file will be used to create a safe zone for the player to be in

//harvestine formula to calculate the cicle distance between two points  
const harvesine =(coor1, coor2) => {
    const R = 6371e3; // earth radius in meters

    //convert lattitude and longitude to radians
    const lat1 = coor1[1] * (Math.PI / 180);
    const lat2 = coor2[1] * (Math.PI / 180);

    //calculate the difference between the two points
    const deltaLat = (coor2[1] - coor1[1]) * (Math.PI / 180);
    const deltaLong = (coor2[0] - coor1[0]) * (Math.PI / 180);

    //applying harvestine formula to calculate a 
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong/2) * Math.sin(deltaLong/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; //distance in meters
};

//data storage maps 
const groupLeaders = new Map();
const groupSafeZones = new Map();

//setting the group leader and the safe zone
const setGroupLeader = (groupId, leaderId, radiusMeters) => {
    groupLeaders.set(groupId,leaderId);
    groupSafeZones.set(groupId,{radius : radiusMeters});
};


const updateLeaderLocation = (groupId,lattitude,longitude) => {
    if(!groupLeaders.has(groupId)) return;
//udate the groups safe zone according to the leaders location
    groupSafeZones.set(groupId,{center : [longitude,lattitude], radius: groupSafeZones.get(groupId).radius});
};

//cheeck if the user is in the safe zone
const checkSafeZone = (groupId, userId, lattitude, longitude) => {
    if(!groupSafeZones.has(groupId)) return null;

    const leaderId = groupLeaders.get(groupId);
    const leaderSafeZone = groupSafeZones.get(groupId);
    if(!leaderSafeZone.center) return null;

    // calling harvestine funcyion to calculate the distance between the user and the leader
    const distance = harvesine([longitude,lattitude], leaderSafeZone.center); 

    if(distance > leaderSafeZone.radius){
        return {
            userId,
            message :"Warining! you have exited the safe zone"
        };
    }
    return null;
};

mooduke.exports = {setGroupLeader, updateLeaderLocation, checkSafeZone};
