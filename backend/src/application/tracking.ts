import prisma from "../infrastructure/db";

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000;
  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const checkGeofencing = async (user: any, latitude: number, longitude: number): Promise<boolean> => {
  const leaderLocation = await prisma.userLocation.findFirst({
    where: { userID: user.team.leaderID },
    orderBy: { timestamp: "desc" },
  });

  if (!leaderLocation) return false;

  const distance = calculateDistance(latitude, longitude, leaderLocation.latitude, leaderLocation.longitude);
  if (distance > user.team.range) {
    await prisma.alert.create({ 
      data: { 
        userID: user.userID, 
        teamID: user.team.teamID, 
        type: "OUT_OF_RANGE", 
        message: `${user.username} is out of range!`,
        lastLatitude: latitude,
        lastLongitude: longitude,
        user: { connect: { userID: user.userID } },
        team: { connect: { teamID: user.team.teamID } }
      } 
    });
    return true;
  }

  return false;
};

