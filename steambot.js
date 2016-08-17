bot authored by Jonathan Lattanzi
// thanks to DoctorMcKay and seishun for creating the node-steam libraries
// very special thanks to codereview user vvye (http://codereview.stackexchange.com/questions/75505/markov-text-generator) for the Markov Chain code

var steam_user = require('steam-user')
var client = new steam_user()

var text = 'Four score and seven years ago our fathers brought forth on this continent a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But, in a larger sense, we can not dedicate, we can not consecrate, we can not hallow this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth.'

function markov(feed, order) {
  this.feed = feed
  this.order = order
  this.setup_frequencies()
}

markov.prototype = {
  setup_frequencies: function() {
    this.frequencies = {}

    for (var i = 0; i < this.feed.length - (this.order - 1); i++) {
      var chunk = this.feed.substr(i, this.order)
      if(!this.frequencies.hasOwnProperty(chunk)) {
        this.frequencies[chunk] = []
      }

      var follower = this.feed.substr(i + this.order, 1)
      this.frequencies[chunk].push(follower)
    }
  },

  get_random_char: function(chunk) {
    if(!this.frequencies.hasOwnProperty(chunk)) {
      return ''
    }

    var followers = this.frequencies[chunk]
    var rng_index = Math.floor(Math.random() * followers.length)

    return followers[rng_index]
  },

  get_random_chunk: function() {
    var rng_index = Math.floor(Math.random() * this.feed.length)
    return this.feed.substr(rng_index, this.order)
  },

  generate_text: function(length) {
    if(this.feed.length <= this.order) {
      return ''
    }

    var text = this.get_random_chunk()

    for (var i = this.order; i < length; i++) {
      var current_chunk = text.substr(text.length - this.order)
      var new_char = this.get_random_char(current_chunk)

      if(!new_char == '') {
        text += new_char
      } else {
        text += this.get_random_chunk()
      }
    }

    return text
  }
  }

// log in creds
client.logOn({
  'accountName': '',
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

// new markov object
var mark = new markov(text, 15)

// main reply
function reply(steamID, message) {
  var reply_msg = mark.generate_text(Math.floor(Math.random() + 100))
  client.chatMessage(steamID, reply_msg)
  console.log('[sent:]' + reply_msg + '\n')
}
