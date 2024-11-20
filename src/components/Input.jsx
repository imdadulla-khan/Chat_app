import React, { useContext, useState, useEffect } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

const Input = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.user?.uid) return;

    // Real-time listener for recipient's online status
    const unsubscribe = onSnapshot(
      doc(db, "users", data.user.uid),
      async (docSnap) => {
        if (docSnap.exists() && docSnap.data().online) {
          // Check and update messages to "delivered" for the current chat
          const chatDoc = await getDoc(doc(db, "chats", data.chatId));
          if (chatDoc.exists()) {
            const messages = chatDoc.data().messages.map((msg) => {
              if (msg.status === "sent" && msg.senderId !== currentUser.uid) {
                return { ...msg, status: "delivered" };
              }
              return msg;
            });

            // Update the messages in Firestore
            await updateDoc(doc(db, "chats", data.chatId), { messages });
          }
        }
      }
    );

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [data.user?.uid, data.chatId, currentUser.uid]);

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      // Check if the recipient is online
      const recipientDoc = await getDoc(doc(db, "users", data.user.uid));
      const recipientOnline =
        recipientDoc.exists() && recipientDoc.data().online;

      // Create the new message object
      const newMessage = {
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        status: recipientOnline ? "delivered" : "sent", // Set status based on recipient's online status
      };

      // Add the message to the chats collection
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(newMessage),
      });

      // Update the last message in userChats collection for both users
      const lastMessageData = {
        [data.chatId + ".lastMessage"]: { text },
        [data.chatId + ".date"]: serverTimestamp(),
      };

      await updateDoc(doc(db, "userChats", currentUser.uid), lastMessageData);
      await updateDoc(doc(db, "userChats", data.user.uid), lastMessageData);

      // Clear the input field
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />

      <div className="send">
        <img src={Attach} alt="Attach" />
        <img src={Img} alt="Send" />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
