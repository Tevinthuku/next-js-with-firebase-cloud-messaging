const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const admin = require('firebase-admin')
const path = require('path')
const { createServer } = require('http')
const { parse } = require('url')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()



const serve = (subpath, cache) => express.static(
  path.resolve(__dirname, subpath),
  {maxAge: cache && !dev ? 1000 * 60 * 60 * 24 * 30 : 0}
)

const firebase = admin.initializeApp({
  credential: admin.credential.cert(require('./credentials/server')),
  databaseURL: ''// here is where your db url goes
}, 'server')


app.prepare()
.then(() => {

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const server = express()

  server.use(bodyParser.json())

    server.use('/static', serve('./static', true))    
    // the firebase service worker file must be in the root of your project
    server.use('/firebase-messaging-sw.js', serve('./static/firebase-messaging-sw.js', true))

  server.use((req, res, next) => {
    req.firebaseServer = firebase
    next()
  })


  server.post('/dummynotif', (req, res) => {
    if (!req.body) return res.sendStatus(400)

      // the title that you have entered
      const title = req.body.title

      // This registration token comes from the client FCM SDKs.
      // insert your token here just for the demo. You can get this via the console after accepting to receive push notifications
      var registrationToken = "";

      // See the "Defining the message payload" section below for details
      // on how to define a message payload.
      var payload = {
        notification: {
          title: title,
          body: "Notification Body"
        }
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      firebase.messaging().sendToDevice(registrationToken, payload)
        .then(function(response) {
          // See the MessagingDevicesResponse reference documentation for
          // the contents of response.
          console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
          console.log("Error sending message:", error);
        });    

  })



  server.get('*', (req, res) => {
    return handle(req, res)
  })



  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})

