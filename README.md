# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

# The Process

### Here I have explained the complete flow of the project with each component. Only go ahead if you wish to know the complete flow.

## Register.jsx

After creating the frontend part, and initilaising the firebase app, we use firebase authentication.

We use email, password and name for registration.
The function used in firebase is

### `createUserWithEmailAndPassword(auth, email, password)`

### Flow of the Component Register.jsx

User Fills the Form:
Enters display name, email, and password.

### Form Submission:

The handleSubmit function processes the form:
Creates the user in Firebase Authentication.
Updates the user's profile.
Adds the user to the Firestore database.
Initializes the userChats collection for the user.

### Navigation:

Redirects the user to the home page after successful registration.

### Error Handling:

Displays an error message if any step in the process fails.

## Login.jsx

Flow of Login Component

### Form Submission:

The user enters their email and password, which are passed to

### `signInWithEmailAndPassword`

for Firebase authentication.

### User Authentication:

On successful login, the user's credentials (user.uid) are retrieved.

### Update Online Status:

Firestore is updated to set the user's online field to true.

### Navigation:

Redirects the authenticated user to the home page ("/").
Displays an error message if login fails.

## App.js

Flow of App.js

### User Authentication and Loading:

Retrieves currentUser and authLoading from AuthContext.
Shows a Loading... message if authLoading is true, waiting for Firebase to determine authentication state.

### Online/Offline Status Management:

### If currentUser is authenticated:

Marks the user as online using setOnline in Firestore.
Adds a beforeunload event listener to mark the user as offline on tab close or refresh.

### Cleanup:

When currentUser changes or the component unmounts, calls setOffline and removes the listener.

### Protected Routes:

Uses ProtectedRoute to restrict access to the / route:
Redirects unauthenticated users (currentUser === null) to /login.
Renders Home for authenticated users.

### Routing:

Public routes (/login, /register) allow user authentication and registration.
The / route is protected, displaying Home only for authenticated users.

## Search.jsx

Flow of Search Component

### Search Input Handling:

The user types a username in the search bar.
When the "Enter" key is pressed, handleSearch is called to query Firestore for a user with a matching displayName.

### User Search:

handleSearch:
Queries the users collection in Firestore.

## Navbar.jsx

Flow of Navbar Component

### Display User Information:

Displays the app logo and the current user's displayName.

### Handle Sign-Out:

handleSignOut Function:
Update Online Status:
Updates Firestore's users collection to set the online field to false and adds a lastSeen timestamp.

### Sign Out User:

Uses Firebase Authentication's signOut function to log out the user.

### Logout Button:

Triggers the handleSignOut function when clicked.

## Messages.jsx

Flow of Messages Component
State Management:

### messages:

A state variable to store an array of messages fetched from Firestore.

### Fetching Messages:

useEffect:
Listens for real-time updates to the chats document in Firestore using the onSnapshot listener.

### Flow:

Listens for changes to the doc in the chats collection identified by data.chatId.
If the document exists, updates the messages state with the messages field from the document.
Returns a cleanup function (unSub) to remove the listener when the component unmounts or data.chatId changes.

### Rendering Messages:

Maps over the messages array and renders a Message component for each message in the array.
Passes each message (m) as a prop to the Message component and uses m.id as the key.

### Real-time Updates:

Automatically re-renders whenever the chats document's messages field is updated in Firestore.

## Message.jsx

Flow of Message Component

### Scroll Behavior:

### useRef and useEffect:

Automatically scrolls the message into view when it is rendered or updated.
Ensures smooth scrolling to the latest message.

### Message Time Formatting:

formatTime Function:
Converts Firestore timestamps into a readable time format (e.g., HH:MM).

### Message Status Display:

getStatusIcon Function:
Renders the appropriate tick icon based on the message's status:
Single grey tick: Sent (status: "sent").
Double grey ticks: Delivered (status: "delivered").
Double blue ticks: Read (status: "read").
Displays ticks only for messages sent by the current user.

### Message Rendering:

Sender and Receiver Styling:
Adds the owner class if the senderId matches the currentUser.uid, differentiating sent and received messages.

### Message Content:

Displays the message text (message.text).
Includes the formatted time and status icons if applicable.

## Input.jsx

Flow of Input Component

### Message Sending:

Creates a new message with text, senderId, and status (sent or delivered based on recipient's online status) and updates Firestore.
Recipient Online Listener:

Listens for changes in the recipient's online status and updates any "sent" messages to "delivered" in real-time.

### UI Handling:

Captures user input, displays the input field and buttons, and clears the input after sending a message.

## Chats.jsx

Flow of Chats Component

### Real-time Chat List:

Uses onSnapshot to fetch and listen for updates to the userChats document for the currentUser in Firestore.

### Chat Selection:

On clicking a chat, handleSelect updates the ChatContext with the selected user and marks "delivered" messages as "read" in Firestore.
Last Message with Status:

Displays the last message of each chat along with its status (sent, delivered, or read) using tick icons.

## Chat.jsx

Flow of Chat Component

### User Online Status:

Uses onSnapshot to listen for real-time updates to the selected user's online status from Firestore.
Displays a green dot if the user is online and a red dot if offline.

### Chat Information:

Shows the selected user's displayName and online status.
Includes icons for additional actions (e.g., camera, add, more options).

### Messages and Input:

Renders the Messages component to display chat messages.
Renders the Input component to allow the user to send messages.

### Cleanup:

Unsubscribes from the Firestore listener when the component unmounts or the selected user changes.

## AuthContext.jsx

Flow of AuthContext Component

### Authentication State Management:

Uses Firebase's onAuthStateChanged to listen for authentication state changes and updates the currentUser state with the logged-in user or null if logged out.

### Loading State:

Maintains authLoading to indicate whether the authentication state is still being determined.
authLoading is set to false once the onAuthStateChanged callback resolves.

### Real-time Updates:

The onAuthStateChanged listener ensures the app dynamically responds to login, logout, or session expiry.

### Context Provider:

Provides currentUser and authLoading values to all components wrapped by AuthContextProvider.

## ChatContext.jsx

Flow of ChatContext Component

### Initial State:

Defines INITIAL_STATE:
chatId: "null" to indicate no chat is selected initially.
user: An empty object to represent no user selected.
Chat Reducer:

### Handles the CHANGE_USER action:

Updates the user in the state to the payload (selected user).
Generates a chatId based on the currentUser.uid and action.payload.uid (ensures consistent ordering).

### State Management:

Uses useReducer to manage the chat state based on dispatched actions.
Provides the data (current state) and dispatch function for state updates.

### Context Provider:

Exposes data (chat state) and dispatch to all children components wrapped in ChatContextProvider, allowing global access to the selected chat and user.
