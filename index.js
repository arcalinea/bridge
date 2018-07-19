const twitterConfig = require('./config');
const processTweets = require('./processTweets');

var tweets = processTweets(twitterConfig.data_dir);
console.log("Tweets", tweets);