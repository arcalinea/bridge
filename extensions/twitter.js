const fs = require('fs');
const readline = require('readline');
const path = require('path');
var moment = require('moment');
var prompt = require('prompt-sync')();

const config = require('../config');


var processTweets = function(dataDir) {
    var files = fs.readdirSync(dataDir);
    var filesToBeAdded = getFilesToAdd(files);
    var tweetsToBeAdded = getTweetsToAdd(filesToBeAdded);
    var tweets = orderTweetsByTime(tweetsToBeAdded);
    return tweets;
};

module.exports = processTweets;

function getType(tweet){
    if (tweet['retweeted_status']){
        return 'retweet';
    } else if (tweet['in_reply_to_status_id']){
        return 'reply';
    } else if (isMyTweet(tweet)){
        return 'original';
    }
}

function isMyTweet(tweet){
    var bool = false;
    if(!tweet['retweeted_status'] && tweet['in_reply_to_screen_name'] == config.twitter.screen_name){
        if (tweet['text'].slice(0, 1) != '@') {
            bool = true;
        }
    } else if (!tweet['retweeted_status'] && !tweet['in_reply_to_screen_name']){
        bool = true;
    }
    return bool;
}

function getFilesToAdd(files){
    var from = config.twitter.from;
    var to = config.twitter.to;
    filesToBeAdded = []
    for (i in files){
        var file = files[i];
        var fileDate = file.slice(0, -3).split('_');
        var fromCutoff = parseInt(from[0]) + parseInt(from[1]);
        var toCutoff = parseInt(to[0]) + parseInt(to[1]);
        var fileDate = parseInt(fileDate[0]) + parseInt(fileDate[1]);
        if (fromCutoff <= fileDate && fileDate <= toCutoff) {
            filesToBeAdded.push(file);
        }
    }
    console.log("\nFiles to be added:\n", filesToBeAdded);
    return filesToBeAdded;
}

function parseTweets(filePath){
    var data = fs.readFileSync(filePath, 'utf8');
    var jsonData = data.split('\n').slice(1).join('\n');
    var tweetJSON = JSON.parse(jsonData);
    return tweetJSON
}

function getTweetsToAdd(files){
    var tweetsToBeAdded = [];
    for (index = 0; index < files.length; ++index) {
            // parse each tweet file
            var filePath = path.join( config.twitter.data_dir, files[index] );
            var tweetJSON = parseTweets(filePath);
            // var tTime = moment('1999-03-28', "YYYY-MM-DDTH:mm:ss");
            for (var t in tweetJSON){
                var tweet = tweetJSON[t];
                var tweetTime = moment(Date.parse(tweet['created_at']));
                // console.log(tweetTime)
                var from = moment(config.twitter.from.join('-'), "YYYY-MM-DD");
                var to = moment(config.twitter.to.join('-'), "YYYY-MM-DD");
                if (tweetTime > from && tweetTime < to){
                    var linkStr = "https://twitter.com/" + config.twitter.screen_name + "/status/" + tweet['id_str'];
                    var tweetObj = {
                        'text': tweet['text'],
                        'link': linkStr,
                        'created_at': tweet['created_at']
                    };
                    switch(getType(tweet)){
                        case 'retweet':
                            if(config.twitter.retweets){
                                tweetObj['type'] = "retweet";
                                tweetsToBeAdded.push(tweetObj);
                            }
                            break;
                        case 'reply':
                            if(config.twitter.replies){
                                tweetObj['type'] = "reply";
                                tweetObj['response_to'] = "https://twitter.com/" + tweet['in_reply_to_screen_name'] + "/status/" + tweet['in_reply_to_status_id_str'];
                                tweetsToBeAdded.push(tweetObj);
                            }
                            break;
                        case 'original':
                            tweetObj['type'] = "my tweet";
                            tweetsToBeAdded.push(tweetObj);
                            break;
                    }
                }
            }
        }
    return tweetsToBeAdded;
}
  

function orderTweetsByTime(tweets){
    tweets.sort(function(a, b) {
        return Date.parse(a.created_at) - Date.parse(b.created_at);
    });
    return tweets;
}
