import React, {createContext} from 'react';


export const ConnectionContext = createContext({
  connection: null,
  updateConnection: (conn) => {}
});
export const ChannelContext = createContext({
  channel: null,
  updateChannel: (chn) => {}
});

export const ConnectionConsumer = ConnectionContext.Consumer
export const ChannelConsumer = ChannelContext.Consumer