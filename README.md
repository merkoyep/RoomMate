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

# AI Usage reflection

For this project, AI was incedibly helpful in the initial scoping of the project, introducing me to new coding concept that I was unfamiliar with, and debugging.

At the start of the project, the first thing I did was ask AI: `I want to create a budget tracking app, using a Node.JS backend with GraphQL, and a react native front end. Is this a good idea, and what are the alternate options?` I found out that it was a very good idea and even ideal to go this route. I was concerned however about whether this project would meet project requirements, so I also prompted and asked what roadblocks I may encounter. This is where I learned that Framer Motion and tailwind aren't supported in React Native. It however suggested alternate libraries like react-native-reanimated and native-wind, which very closely mimiced what I needed to accomplish.

After the initial planning and wireframing I did on figma, I started to build out the app. One of the first roadblocks that I had was figuring out navigation on mobile. I prompted ai `What are some ways navigation is handled in single page mobile applications?` and it outlined some options for me. However, because I am in favor of using modals, I prompeted it for more information on how one would implement rendering modals. Luckily, since I was using redux already, all I needed to do was conditinally render modals on top of my existing screens using a redux state, and a resolver to call modal renders.

Finally, when it came to debugging, AI helped me the most. Something I spent a few hours more than I really should have on was figuring out why there was extra padding on some flex elements. I had styled them with `gap-2` so that I would have space between elements, but the start of the component would have a gap too. Turns out, because I was so used to Tailwind but switched to nativewind for this project, I didn't realize there was a different behaviour. While tailwind applies a gap between elements, nativewind applies it between, before, and after elements. Through a quick prompt, AI was able to tell me what I needed to fix, so rather than gap-2, I used `mb-2` for each child element.

Overall, using AI in this project really helped me make quick progress and think ahead of any roadblocks that I may encounter. Additionally, features to help debug, and the ability to provide technical context on new topics have really been helpful for me as a student.
