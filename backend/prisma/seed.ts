import { PrismaClient, AlertType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test leader user first (required for team)
  const leader = await prisma.user.upsert({
    where: { email: 'leader@example.com' },
    update: {},
    create: {
      email: 'leader@example.com',
      username: 'team_leader',
      clerkID: 'clerk_leader123',
    },
  });

  console.log('Created leader:', leader);

  // Create a test team
  const team = await prisma.team.upsert({
    where: { teamCode: 'TEST123' },
    update: {},
    create: {
      teamName: 'Test Team',
      teamCode: 'TEST123',
      range: 100,
      active: true,
      leaderID: leader.userID,
    },
  });

  console.log('Created team:', team);

  // Create a test member
  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: { teamID: team.teamID },
    create: {
      email: 'member@example.com',
      username: 'team_member',
      clerkID: 'clerk_member456',
      teamID: team.teamID,
    },
  });

  console.log('Created member:', member);

  // Create test location data
  const location = await prisma.userLocation.create({
    data: {
      userID: member.userID,
      latitude: 6.9271,
      longitude: 79.8612,
      altitude: 10,
      speed: 0,
    },
  });

  console.log('Created location:', location);

  // Create test alert
  const alert = await prisma.alert.create({
    data: {
      userID: member.userID,
      teamID: team.teamID,
      type: AlertType.OUT_OF_RANGE,
      message: 'Member is out of range',
      lastLatitude: 6.9371,
      lastLongitude: 79.8712,
    },
  });

  console.log('Created alert:', alert);

  // Create test emergency alert
  const emergencyAlert = await prisma.emergencyAlert.create({
    data: {
      userID: member.userID,
      teamID: team.teamID,
      latitude: 6.9271,
      longitude: 79.8612,
      message: 'Help needed',
    },
  });

  console.log('Created emergency alert:', emergencyAlert);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 