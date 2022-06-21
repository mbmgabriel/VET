import React from 'react'
import { MessengerChat } from 'react-messenger-chat-plugin';

export default function FacebookMessengerPlugin() {
  return (
    <MessengerChat
      pageId="103022335784792"
      language="en_US"
      themeColor={"#EE9337"}
      bottomSpacing={40}
      loggedInGreeting="Hi. How can I help you?"
      loggedOutGreeting="Thank you for visiting. Please log in to continue."
      greetingDialogDisplay={"show"}
      debugMode={true}
      onMessengerShow={() => {
        console.log("onMessengerShow");
      }}
      onMessengerHide={() => {
        console.log("onMessengerHide");
      }}
      onMessengerDialogShow={() => {
        console.log("onMessengerDialogShow");
      }}
      onMessengerDialogHide={() => {
        console.log("onMessengerDialogHide");
      }}
      onMessengerMounted={() => {
        console.log("onMessengerMounted");
      }}
      onMessengerLoad={() => {
        console.log("onMessengerLoad");
      }}
    />
  )
}
