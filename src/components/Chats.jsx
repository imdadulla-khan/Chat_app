import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import logo from "../img/logo.webp";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = async (user) => {
    // Generate combinedId based on the currentUser and the selected user
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    // Dispatch the selected user info to the ChatContext
    dispatch({ type: "CHANGE_USER", payload: user });

    // Mark messages as read in Firestore
    const chatDoc = await getDoc(doc(db, "chats", combinedId));

    if (chatDoc.exists()) {
      const updatedMessages = chatDoc.data().messages.map((msg) => {
        if (msg.status === "delivered" && msg.senderId !== currentUser.uid) {
          return { ...msg, status: "read" };
        }
        return msg;
      });

      // Update the chat document with the modified messages
      await updateDoc(doc(db, "chats", combinedId), {
        messages: updatedMessages,
      });
    }
  };

  // Function to render the correct tick icon based on status
  const getStatusIcon = (status) => {
    if (status === "sent") {
      return <span className="singleTick">✔</span>; // Single tick (grey)
    } else if (status === "delivered") {
      return <span className="doubleTickGrey">✔✔</span>; // Double grey ticks
    } else if (status === "read") {
      return (
        <span className="doubleTickBlue" style={{ color: "blue" }}>
          ✔✔
        </span>
      ); // Double blue ticks
    }
    return null;
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          const lastMessage = chat[1].lastMessage;
          return (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={logo} alt="Logo" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>
                  {lastMessage?.text}{" "}
                  {lastMessage?.status && getStatusIcon(lastMessage?.status)}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
