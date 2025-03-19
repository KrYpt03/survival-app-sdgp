# Survival App API Documentation

## Base URL

```
http://your-backend-url:5000
```

Replace `your-backend-url` with your actual deployed URL or use `localhost` for local development.

## Authentication

Most endpoints require authentication using Clerk. The frontend should include the Clerk JWT token in the Authorization header:

```
Authorization: Bearer <clerk_jwt_token>
```

## Error Responses

All API errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints

### Teams

#### Create Team
- **URL**: `/api/team`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "teamName": "Search & Rescue Team Alpha",
    "range": 100
  }
  ```
- **Response**:
  ```json
  {
    "teamID": "cm8g8nxev0002t93g8p0hylxz",
    "teamName": "Search & Rescue Team Alpha",
    "teamCode": "XYZ123", // Generated code for team joining
    "range": 100,
    "active": true,
    "leaderID": "user_id_here"
  }
  ```

#### Get Team Details
- **URL**: `/api/team/:teamID`
- **Method**: `GET`
- **Auth**: Required
- **URL Params**: `teamID` - The ID of the team
- **Response**:
  ```json
  {
    "teamID": "cm8g8nxev0002t93g8p0hylxz",
    "teamName": "Search & Rescue Team Alpha",
    "teamCode": "XYZ123",
    "range": 100,
    "active": true,
    "leaderID": "user_id_here",
    "members": [
      {
        "userID": "user_id_1",
        "username": "team_leader",
        "email": "leader@example.com",
        "lastLatitude": 6.9271,
        "lastLongitude": 79.8612
      },
      {
        "userID": "user_id_2",
        "username": "team_member",
        "email": "member@example.com",
        "lastLatitude": 6.9271,
        "lastLongitude": 79.8612
      }
    ]
  }
  ```

#### Join Team
- **URL**: `/api/team/join`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "teamCode": "XYZ123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Successfully joined team",
    "team": {
      "teamID": "cm8g8nxev0002t93g8p0hylxz",
      "teamName": "Search & Rescue Team Alpha",
      "teamCode": "XYZ123",
      "range": 100,
      "active": true,
      "leaderID": "user_id_here"
    }
  }
  ```

#### Update Team
- **URL**: `/api/team/:teamID`
- **Method**: `PUT`
- **Auth**: Required (Leader only)
- **URL Params**: `teamID` - The ID of the team
- **Body**:
  ```json
  {
    "teamName": "Updated Team Name",
    "range": 150
  }
  ```
- **Response**:
  ```json
  {
    "teamID": "cm8g8nxev0002t93g8p0hylxz",
    "teamName": "Updated Team Name",
    "teamCode": "XYZ123",
    "range": 150,
    "active": true,
    "leaderID": "user_id_here"
  }
  ```

#### Deactivate Team
- **URL**: `/api/team/:teamID`
- **Method**: `DELETE`
- **Auth**: Required (Leader only)
- **URL Params**: `teamID` - The ID of the team
- **Response**:
  ```json
  {
    "message": "Team deactivated successfully"
  }
  ```

### Locations

#### Update User Location
- **URL**: `/api/location/update`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "userID": "user_id_here",
    "latitude": 6.9271,
    "longitude": 79.8612,
    "altitude": 10,
    "speed": 5
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "isOutOfRange": false,
    "location": {
      "locationID": "location_id",
      "userID": "user_id_here",
      "latitude": 6.9271,
      "longitude": 79.8612,
      "altitude": 10,
      "speed": 5,
      "timestamp": "2023-07-24T12:34:56.789Z",
      "isSynced": true
    }
  }
  ```

#### Get Team Locations
- **URL**: `/api/location/team/:teamID`
- **Method**: `GET`
- **Auth**: Required
- **URL Params**: `teamID` - The ID of the team
- **Response**:
  ```json
  [
    {
      "userID": "user_id_1",
      "username": "team_leader",
      "latitude": 6.9271,
      "longitude": 79.8612,
      "timestamp": "2023-07-24T12:34:56.789Z"
    },
    {
      "userID": "user_id_2",
      "username": "team_member",
      "latitude": 6.9275,
      "longitude": 79.8615,
      "timestamp": "2023-07-24T12:35:00.123Z"
    }
  ]
  ```

### Alerts

#### Get Team Alerts
- **URL**: `/api/alert/team/:teamID`
- **Method**: `GET`
- **Auth**: Required
- **URL Params**: `teamID` - The ID of the team
- **Response**:
  ```json
  [
    {
      "alertID": "alert_id_1",
      "userID": "user_id_2",
      "username": "team_member",
      "type": "OUT_OF_RANGE",
      "message": "Member is out of range",
      "lastLatitude": 6.9371,
      "lastLongitude": 79.8712,
      "timestamp": "2023-07-24T12:34:56.789Z",
      "resolved": false
    }
  ]
  ```

#### Resolve Alert
- **URL**: `/api/alert/:alertID`
- **Method**: `PATCH`
- **Auth**: Required (Leader only)
- **URL Params**: `alertID` - The ID of the alert
- **Response**:
  ```json
  {
    "alertID": "alert_id_1",
    "resolved": true,
    "message": "Alert resolved successfully"
  }
  ```

#### Create Emergency Alert
- **URL**: `/api/alert/emergency`
- **Method**: `POST`
- **Auth**: Required
- **Body**:
  ```json
  {
    "userID": "user_id_here",
    "teamID": "team_id_here",
    "latitude": 6.9271,
    "longitude": 79.8612,
    "message": "Need immediate assistance"
  }
  ```
- **Response**:
  ```json
  {
    "alertID": "emergency_alert_id",
    "message": "Emergency alert created successfully"
  }
  ```

### Users

#### Clerk Webhook (Internal)
- **URL**: `/api/user/webhook`
- **Method**: `POST`
- **Auth**: Clerk Webhook Secret
- **Description**: Receives Clerk user events and syncs with database

#### Get Current User
- **URL**: `/api/user/me`
- **Method**: `GET`
- **Auth**: Required
- **Response**:
  ```json
  {
    "userID": "user_id_here",
    "username": "team_member",
    "email": "member@example.com",
    "clerkID": "clerk_id",
    "teamID": "team_id_here",
    "team": {
      "teamID": "team_id_here",
      "teamName": "Search & Rescue Team Alpha",
      "teamCode": "XYZ123",
      "leaderID": "leader_id"
    },
    "isLeader": false
  }
  ```

## Integration Examples

### Authentication Flow
```javascript
// On Clerk sign-in success
const token = await auth.getToken();

// Include in API requests
fetch('http://your-backend-url:5000/api/user/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(user => console.log(user));
```

### Location Tracking
```javascript
// Periodically update user location
function updateLocation(position) {
  const { latitude, longitude, altitude, speed } = position.coords;
  
  fetch('http://your-backend-url:5000/api/location/update', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userID: currentUser.userID,
      latitude,
      longitude,
      altitude,
      speed
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.isOutOfRange) {
      // Show alert to user
    }
  });
}

// Call every 30 seconds while app is active
navigator.geolocation.watchPosition(updateLocation);
```

### Team Management
```javascript
// Create new team
function createTeam(teamName, range) {
  fetch('http://your-backend-url:5000/api/team', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      teamName,
      range
    })
  })
  .then(response => response.json())
  .then(team => {
    // Show team code to share with members
    displayTeamCode(team.teamCode);
  });
}

// Join existing team
function joinTeam(teamCode) {
  fetch('http://your-backend-url:5000/api/team/join', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      teamCode
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.team) {
      // Successfully joined team
      navigateToTeamDashboard(data.team);
    }
  });
}
``` 