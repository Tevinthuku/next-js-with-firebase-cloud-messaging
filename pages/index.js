import React, { Component } from 'react'

// just import what we need from firebase
var firebase = require("firebase/app")
require("firebase/messaging")

import fetch from 'isomorphic-unfetch'


export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
    }

    this.sendNotif = this.sendNotif.bind(this)

  }

  componentDidMount() {

      try {
        firebase.initializeApp({
          apiKey: "",
          projectId: "",
          messagingSenderId: ""
        })
        } catch (err) {
          // we skip the "already exists" message which is
          // not an actual error when we're hot-reloading
          if (!/already exists/.test(err.message)) {
            console.error('Firebase initialization error', err.stack)
          }
        }

     const messaging = firebase.messaging();

      messaging.requestPermission()
      .then(function() {
        console.log('We now have Permission')
        return messaging.getToken();
      })
      .then(function(token) {
        console.log(token)
      })
      .catch(function(err) {
        console.log('Error occurred ', err)
      })

      messaging.onMessage(function(payload) {
        console.log('On Message', payload)
      })
  }



sendNotif() {
  let { title } = this.state;

    fetch('/dummynotif', {
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify({ title })
    })

}


  render() {

    return (
      <div>
         <input type="text" value={this.state.title} />
         <button onClick={this.sendNotif}>Send Notif</button>
      </div>
    )
  }
}