// bot authored by Jonathan Lattanzi
// thanks to DoctorMcKay and seishun for creating the node-steam libraries

var steam_user = require('steam-user')
var client = new steam_user()

var util = require('util')
var file = require('fs')
var mark = require('markovchain-generate')

var chain = new mark()

// log in creds
client.logOn({
  'accountName': 'salad_bot',
  'password': ''
})

// login was successful
client.on('loggedOn', function(){
  console.log('logged in as ' + client.steamID.getSteam3RenderedID())
  client.setPersona(steam_user.EPersonaState.Online)
})

client.on('steamGuard', function(domain, callback){
  // to do... maybe?
})

// throw error if invalid login
client.on('error', function(e){
  console.log(e)
})

client.on('friendTyping', function(steamID){
  console.log(steamID + ' is typing...')
})

// receive / echo message
client.on('friendMessage', function(steamID, message){
  console.log('[message received from:]' + steamID)
  console.log('[message:]' + message)

  reply(steamID, message)
})

// temp work around until i make my own markov chain generator
function reply(steamID, message) {
  var file = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

  chain.generateChain(file)
  var reply_msg = chain.generateString()

  client.chatMessage(steamID, reply_msg)
  console.log('[sent:]' + reply_msg)
}

// echo message once for every character in the received message
function annoying_reply(steamID, message) {
  for(i = 0; i < message.length; i++) {
    client.chatMessage(steamID, message)
    console.log('message echo: ' + message)
  }
}
