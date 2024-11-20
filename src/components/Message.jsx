import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  //   const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  // Format the message.date into a readable time format
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JS Date
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to render the correct tick icon based on message status
  const getStatusIcon = (status) => {
    if (status === "sent") {
      return (
        <span className="singleTick" style={{ color: "grey" }}>
          ✔
        </span>
      ); // Single tick (grey)
    } else if (status === "delivered") {
      return (
        <span className="doubleTickGrey" style={{ color: "grey" }}>
          ✔✔
        </span>
      ); // Double grey ticks
    } else if (status === "read") {
      return (
        <span className="doubleTickBlue" style={{ color: "blue" }}>
          ✔️✔️
        </span>
      ); // Double blue ticks
    }
    return null;
  };

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <span>{formatTime(message.date)}</span>
        {/* Show ticks only for messages sent by the current user */}
        {message.senderId === currentUser.uid &&
          getStatusIcon(message.status)}{" "}
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
