# MERN Chat Application

A real-time chat application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io. Users can register, log in, and chat with other registered users in private chat rooms.

## Features
- User registration and login
- Real-time messaging using Socket.io
- Private chat rooms between two users
- Message persistence in MongoDB
- Fetching and displaying chat history upon entering a chat room

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/mern-chat-app.git
```

2. Navigate to the project directory:
```
cd mern-chat-app
```

3. Install backend dependencies:
```
npm install
```

4. Navigate to the frontend directory and install frontend dependencies:
```
cd client
npm install
```

### Running the Application

1. Start the backend server:
```
node server.js
```

2. In a separate terminal, navigate to the frontend directory and start the React app:
```
cd client
npm start
```

The application should now be running on http://localhost:3000.

## Usage
1. Register a new user or log in with existing credentials.
2. Once logged in, you'll see a list of all registered users.
3. Select a user to start a chat. This will create a private chat room between you and the selected user.
4. Send and receive real-time messages. All messages are saved in the database and can be viewed later by re-entering the chat room.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the [MIT License](https://mit-license.org/).
