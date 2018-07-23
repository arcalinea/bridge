const twitterConfig = require('./config');
const processTweets = require('./processTweets');
const fs = require('fs');
const moment = require('moment');

// Pull in social media data, feed into common data format. 
// 	- Nice way is OAuth and an easy UI for import, hacky way is user-requested data dump. 
// Data format MVP is simply using key/value store
//  - In dx network, can gossip heads of root hash, and communicate tree with peers. 
// Create basic display for different social posts using common data format. 
// Create box to post using common data format as well. 

// Type
// Source
// Author
// Created_At
// Data
// Response_To
// Signature

var tweets = processTweets(twitterConfig.data_dir);

// function Smor(type){
//     this.type = type;
//     this.source = "";
//     this.author = "";
//     this.created_at = "";
//     this.data = {};
//     this.response_to = "";
//     this.signature = "";
// }

function srcTwitter(link){
    return "twitter(" + link + ")";
}

function TweetsToSmors(tweets){
    var smors = [];
    for (var i in tweets){
        // var s = new Smor("tweet");
        var smor = {};
        smor['type'] = "tweet"
        smor['source'] = srcTwitter(tweets[i]['link']);
        smor['author'] = ''
        smor['created_at'] = moment(Date.parse(tweets[i]["created_at"])).unix();
        console.log("Smorssss", smor['created_at'])
        smor['data'] = {
            "text": tweets[i]["text"]
        }
        smor['signature '] = 'sig'
        if(tweets[i]['response_to']){
            smor['response_to'] = srcTwitter(tweets[i]['response_to']);
        }
        smors.push(smor);
    }
    return smors;
}

function createDataFile(tweets){
    fs.writeFile("data.json", JSON.stringify(smors), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

var smors = TweetsToSmors(tweets);
console.log(smors); 
// createDataFile(smors);

