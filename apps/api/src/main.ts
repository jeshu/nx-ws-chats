import * as express from 'express';
import WebSocket from 'ws';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';


const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const users = {};
const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message));
};

const sendToAll = (clients, type, { id, name: userName }) => {
  Object.values(clients).forEach((client) => {
    client.send(
      JSON.stringify({
        type,
        user: { id, userName },
      })
    );
  });
};
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.log('Invalid JSON received', err);
      data = {};
    }
    const { type, name, offer, answer, candidate } = data;
    switch (type) {
      case 'offer': {
        const offerRecipient = users[name];
        if (Boolean(offerRecipient) === true) {
          sendTo(offerRecipient, {
            type,
            offer,
            name: ws.name,
          })
        } else {
          sendTo(ws, {
            type: 'error',
            message: `User ${name} not exists`,
          })
        }
      }
        break;
      case 'answer': {
        const answerRecipient = users[name];
        if (Boolean(answerRecipient) === true) {
          sendTo(answerRecipient, {
            type,
            answer
          });
        } else {
          sendTo(ws, {
            type: 'error',
            message: 'User ${name} not found4'
          })
        }
      }
        break;
      case 'candidate': {
        const candidateRecipient = users[name];
        if (Boolean(candidateRecipient) === true) {
          sendTo(candidateRecipient, {
            type,
            candidate
          });
        } else {
          sendTo(ws, {
            type: 'error',
            message: 'User ${name} not found4'
          })
        }
      }
        break;
      case 'leave':
        sendToAll(users, 'leave', ws);
        break;
      case 'login':
        if (users[name]) {
          sendTo(ws, {
            type,
            success: false,
            message: 'Username not available',
          });
        } else {
          const id = uuidv4();
          const loggedIn = Object.values(users).map((user) => ({
            id: user.id,
            userName: user.name,
          }));

          users[name] = ws;
          ws.name = name;
          ws.id = id;
          sendTo(ws, {
            type,
            success: true,
            users: loggedIn,
          });
          sendToAll(users, 'updatedUsers', ws);
        }
        break;
      default:
        sendTo(ws, {
          type: "error",
          message: "Command not found: " + type
        });
        break;
    }
  });

  ws.on("close", () => {
    delete users[ws.name];
    sendToAll(users, 'leave', ws);
  });

  ws.send(
    JSON.stringify({
      type: 'connect',
      message: 'Well hello there... web-socket connection established',
    })
  );
});

const port = process.env.port || 9000;
server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
