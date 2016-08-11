# steambot
Just a simple steam chat bot just for laughs and practice. It uses Markov chains to generate text based on the source string, located in the `text` variable.


# use
Make sure Node.js is installed, enter your username and password in `account_name` and `password` fields, open cmd and simply run:</br></br>
`node steambot.js`</br></br>
Then you will be prompted with a Steam Gueard confirmation code, if everything is correct, you will be logged in. The bot will be running in the command prompt and waiting to receive a message.</br></br>
In order to disconnect the bot, simply exit out of the command prompt.

# tweaking
You can try playing around with the length of chunk extracted from the string by changing the `order` parameter. Just play around with the values until you get the desired effect.
