// bot authored by Jonathan Lattanzi
// thanks to DoctorMcKay and seishun for creating the node-steam libraries
// very special thanks to codereview user vvye (http://codereview.stackexchange.com/questions/75505/markov-text-generator) for the Markov Chain code

var steam_user = require('steam-user')
var client = new steam_user()

var text = 'Four score and seven years ago our fathers brought forth on this continent a new nation, conceived in liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battlefield of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But, in a larger sense, we can not dedicate, we can not consecrate, we can not hallow this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us—that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion—that we here highly resolve that these dead shall not have died in vain—that this nation, under God, shall have a new birth of freedom—and that government of the people, by the people, for the people, shall not perish from the earth. To understand today’s Republican Party, you have to understand that despite the fact that they had on the stage five governors, three senators, and a retarded neurosurgeon, first and foremost they wanted to get the opinion of President Donald Trump—a ham-colored cartoon character from I Love the ‘80s. Once you accept that, the rest of the night makes perfect sense. That’s all they have to sell: fear. Hope and change meet pee and poo. The entire slate of them up there seemed entirely unaware of the fact that women can now vote. Megyn Kelly asked President Trump right off the bat about President Trump calling women ‘fat pigs,’ ‘slobs,’ and ‘dogs.’ Trump’s answer? ‘I don’t have time for political correctness.’ He’s like one of those construction workers from the ‘70s who goes, ‘Nice tits. Oh, what? I can’t compliment a lady anymore?’ It’s crazy. Hey Lightweights, My name is Donald J Trump, and I hate every single one of you. All of you are sweaty, retarded, choke artists who spend every second of your campaign putting on make up. You are everything bad in this country. Honestly, have any of you ever built a skyscraper with your name on it? I mean, I guess its fun memorizing the same speech given by your handlers and screwing the electorate because of your own insecurities, but you all take to a whole new level. This is even worse than having Conservative Gay Foam Parties. Dont be a stranger. Just hit me with your best shot. Im pretty much perfect. I built hotels and casinos around the World, and a whole city in the Upper West Side of Manhattan. What jobs have you created other than "robocall smearing ghost-writers"? I also got my own Boeing 757, and have a banging hot daughter (She just blew me; Shit was SO cash). You are all faggots who should just kill yourselves. Thanks for listening. Pic Related: Its me and my daughter Ivanka. What the fuck did you just fucking say about me, you little bitch? I’ll have you know I graduated top of my class in the Navy Seals, and I’ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I’m the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You’re fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that’s just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little “clever” comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn’t, you didn’t, and now you’re paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You’re fucking dead, kiddo'

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
