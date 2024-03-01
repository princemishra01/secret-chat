import { useEffect, useState } from 'react'
import { useRef } from 'react'
import socketIOClient from "socket.io-client";

export const Notification = ({notificationMessage}) => {
  return (
    <div className='text-white absolute bottom-1 right-1 border border-gray-200 rounded-lg p-4 mb-4 bg-indigo-600 w-1/5'>
      <h2 className="text-md font-bold mb-2">Notification</h2>
      <div className="">
        <p className="text-white">{notificationMessage}</p>
      </div>
    </div>
  )
}

export const MessageArea = ({ messages, setMessages , username, socket, room}) => {
  const currentMsgRef = useRef(null);
  const handleSendMessage = () => {
    const newMessage = {username, message: currentMsgRef.current.value, timestamp: new Date().toLocaleTimeString()};
    // setMessages(messages => [...messages, newMessage]);
    socket.emit("message", {newMessage, room});
  }

  onkeydown = (e) => {
    if(e.key === "Enter"){
      handleSendMessage();
    }
  }

  return (
    <div className="w-1/2 p-4">
    <h2 className="text-lg font-bold mb-2">Chat Area</h2>
    <div className="border border-gray-200 rounded-lg p-4 mb-4 overflow-y-scroll h-[50vh]">
      {
        messages.map((msg, index) => {
          return (
              <div key={index} className="mb-2">
                <p className="font-bold">{msg.username}</p>
                <div className='flex justify-between'>
                  <span className="text-gray-700">{msg.message}</span>
                  <span className="text-gray-500 text-sm">{msg.timestamp}</span>
                </div>
              </div>
            )
          })
      }
    </div>
    <div>
      <input type="text" ref={currentMsgRef} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-lg p-4 bg-slate-100"/>
      <button onClick={handleSendMessage} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Send Message
      </button>
    </div>
  </div>
  )
}

export const Login = ({setUsername , username}) => {
  return (
    <div className='m-auto mt-12 w-[40%]'>
      <h2 className="text-lg font-bold mb-2">Enter your username</h2>
      <input type="text" id="username" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-lg p-4 bg-slate-100"/>
      <button onClick={() => {setUsername(document.getElementById("username").value)}} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
    </div>
  )
} 

export const Home = ({setUsername, username, setNotificationMessage}) => {
  const [messages, setMessages] = useState([]);
  const idRef = useRef(null);
  const [room, setRoom] = useState(null);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");
    setSocket(socket);
    socket.on("message", (msg) => {
      console.log(msg)
      setMessages(messages => [...messages, msg]);
    })
    // console.log(username);
    setNotificationMessage(`Wellcome ${username}. Join Room to talk.`)
  }, [])
  const handleJoinRoom = () => {
    if(socket){
      if(idRef.current.value == ""){
        setNotificationMessage(`Please enter a room id to join.`);
        return;
      }
      socket.emit("join-room", idRef.current.value);
      setRoom(idRef.current.value);
      setNotificationMessage(`You have joined the room ${idRef.current.value}`);
      idRef.current.value = "";
    }
  }
  const handleClearData = () => {
    socket.emit("leave-room", room);
    setMessages([]);
    setRoom(null); 
    setNotificationMessage(`You have left the room ${room} and all the messages are cleared.`);
  }
  return (
    <div className="flex">
      <div className="w-1/2 p-4">
        <h2 className="text-lg font-bold mb-2">Welcome {username}</h2>
        {
          !room ? 
          <div>
            <label htmlFor={idRef} className="block text-sm font-medium text-gray-700">Enter the room Id you want to join</label>
            <input type="text" ref={idRef} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-lg p-4 bg-slate-100"/>
            <button onClick={handleJoinRoom} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2">Join</button>
          </div> 
          : <h1>Room Joined {room}</h1>
        }
        <button onClick={() => setMessages([])} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2">Clear Messages</button>
        <button onClick={handleClearData} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Disconnect</button>
      </div>
      <MessageArea messages={messages} setMessages = {setMessages} username = {username} socket={socket} room={room}/>
    </div>
  )
}

function App() {
  const [username, setUsername] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("Enter Your Name.");
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(true);
    setTimeout(() => {
      setShown(false);
    }, 2000);
  }, [notificationMessage])

  return (
    <div className='w-full h-screen relative' >
      <header className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Secret Chat</h1>
        <h3>In this app you can create a room and start to chat and after closing the app your msg will be removed or you can do this with a button click</h3>
      </header>
      <section className="p-4">
        {
          username == "" 
          ? <Login username={username} setUsername={setUsername} setNotificationMessage={setNotificationMessage}/>
          : <Home username={username} setNotificationMessage={setNotificationMessage}/>
        }
      </section>
      {shown && <Notification notificationMessage={notificationMessage}/>}
    </div>
  )
}

export default App