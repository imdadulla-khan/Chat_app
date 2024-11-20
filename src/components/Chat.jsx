import React, { useContext, useState, useEffect } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (data.user?.uid) {
      // Listen to the user's online status in Firestore
      const unsub = onSnapshot(doc(db, "users", data.user.uid), (doc) => {
        if (doc.exists()) {
          setIsOnline(doc.data().online);
        }
      });

      return () => unsub(); // Cleanup listener on component unmount
    }
  }, [data.user?.uid]);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>
          {data.user?.displayName}{" "}
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isOnline ? "green" : "red",
              marginLeft: "8px",
            }}
          ></span>
        </span>
        <div className="chatIcons">
          <img src={Cam} alt="Cam" />
          <img src={Add} alt="Add" />
          <img src={More} alt="More" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
