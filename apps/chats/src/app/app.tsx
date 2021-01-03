import React, {  useEffect, useState } from "react";
import { Message } from '@chat-system/api-interfaces';
import Container from "./Container";
import {ChannelContext,ConnectionContext} from "./Context"



export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });
  const [connection, setconnection] = useState(null);
  const [channel, setChannel] = useState(null);
  const updateConnection = conn => {
    setconnection(conn);
  };
  const updateChannel = chn => {
    setChannel(chn);
  };
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>Welcome to chats!</h1>
      </div>
      <ConnectionContext.Provider value={{ connection, updateConnection }}>
      <ChannelContext.Provider value={{ channel, updateChannel }}>
        <Container />
      </ChannelContext.Provider>
    </ConnectionContext.Provider>
      <div>{m.message}</div>
    </>
  );
};

export default App;
