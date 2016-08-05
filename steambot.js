/*
    use fs to log received messages in array format in a file for the bot to choose at random
    eventually work on defining  sentence structure/grammer for more realistic replies
*/

// bot authored by Jonathan Lattanzi
// thanks to DoctorMcKay and seishun for creating the node-steam libraries

var steam_user = require('steam-user')
var client = new steam_user()
var fs = require('fs')

// log in creds
client.logOn({
  'accountName': 'jmlattanzi',
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

var replies = [
  'kek', 'topkek', 'nice meme', 'yee', 'im not sure how i feel about that', 'no',
  'i really cant believe how tall giraffes are', 'i want you to hit me as hard as you can',
  'im not sure how i feel about car jackers',
  'lol ok', 'ikr', 'fugg', 'damn son, whered ya find this'
]

// main reply function
function reply(steamID,  message){
  var reply_msg = replies[Math.floor(Math.random() * replies.length)]
  client.chatMessage(steamID, reply_msg)
  console.log('[sent:] ' + reply_msg)
}

// echo message once for every character in the received message
function annoying_reply(steamID, message) {
  for(i = 0; i < message.length; i++) {
    client.chatMessage(steamID, message)
    console.log('message echo: ' + message)
  }
}
