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

