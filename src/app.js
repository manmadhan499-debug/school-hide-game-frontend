import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// ⚠️ Replace with your Render backend URL
const socket = io("https://school-hide-game-server.onrender.com");

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);
  const [item, setItem] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("roomUpdate", players => setPlayers(players));
    socket.on("itemHidden", ({ by }) => setMessage(`Item hidden by ${by}`));
    socket.on("winner", ({ id }) => setMessage(`Winner: ${id}`));
    socket.on("notFound", () => setMessage("Wrong item! Try again"));
  }, []);

  const joinRoom = () => {
    socket.emit("joinRoom", { roomCode, playerName });
    setJoined(true);
  };

  const hideItem = () => {
    socket.emit("hideItem", { roomCode, item });
  };

  const findItem = () => {
    socket.emit("findItem", { roomCode, item });
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      {!joined ? (
        <>
          <h2>Join Room</h2>
          <input
            placeholder="Room Code"
            value={roomCode}
            onChange={e => setRoomCode(e.target.value)}
          />
          <br />
          <input
            placeholder="Your Name"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
          <br />
          <button onClick={joinRoom}>Join</button>
        </>
      ) : (
        <>
          <h2>Room: {roomCode}</h2>
          <h4>Players:</h4>
          <ul>
            {players.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
          <input
            placeholder="Item"
            value={item}
            onChange={e => setItem(e.target.value)}
          />
          <br />
          <button onClick={hideItem}>Hide Item</button>
          <button onClick={findItem}>Find Item</button>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default App;
