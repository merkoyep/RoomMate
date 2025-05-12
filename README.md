# RoomMate

RoomMate is a ReactNative app that allows roommates to track and reconcile expenses. As of the current iteration of the app, households of 2 are supported only.

## Setup

### Database

As this is for assignment purposes only, a remote database was not confirugred. Rather, users must setup a local MongoDB.

1. Install MongoDB Community Edition:

   - For macOS (using Homebrew):
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community
     ```

2. Start MongoDB service:

   - macOS:
     ```bash
     brew services start mongodb-community
     ```

3. Verify MongoDB is running:

   ```bash
   mongosh
   ```

4. Configure environment variables:
   - Create a `.env` file in the server directory
   - Add the following configuration:
     ```
     MONGODB_URI=mongodb://localhost:27017/roommate
     JWT_SECRET=your_jwt_secret_key_here
     PORT=4000
     ```
   - Replace `your_jwt_secret_key_here` with a secure random string for JWT token generation
   - The default port is 4000, but you can change it if needed

### Users

In order to run the application, two users must be created. As of right now, this can be done easily through graphiQL.

1. In the server directory, run `npm install` to install your dependencies.
2. Run the server in your terminal: `npm start`.
3. Navigate to GraphiQL and run the following mutation for each new user:
   ```
   mutation createUser {
       createUser(username: "usernameHere", password: "passwordHere", email: "emailHere") {
           username
           email
       }
       }
   ```

### Client

Finally, run the client

1. cd into the client directory
2. run `npm install`
3. start the expo server by running `npx expo start`
4. If you have xcode or android studio installed, you may run this in a simulator. Otherwise, download the Expo app on you mobile device and scan the QR Code.
