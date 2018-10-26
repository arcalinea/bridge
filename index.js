const fs = require('fs');
const moment = require('moment');

// const processTweets = require('./extensions/twitter');
const twitterAdaptor = require('./extensions/twitter');
const ssbAdaptor = require('./extensions/ssb');
const facebookAdaptor = require('./extensions/facebook');

const config = require('./config');

// Pull in social media data, feed into common data format. 
//  1. From user-requested data dump
// 	2. TODO: Through OAuth and API

// Smor = social media object representation
// Type
// Source
// Author
// Created_At
// Data
// Response_To
// Signature

// function Smor(type){
//     this.type = type;
//     this.source = "";
//     this.author = "";
//     this.created_at = "";
//     this.data = {};
//     this.response_to = "";
//     this.signature = "";
// }

function createDataFile(smors){
    fs.writeFile("data.json", JSON.stringify(smors), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

// Get raw tweets
var tweets = twitterAdaptor.readFromDataDir(config.twitter.data_dir);
console.log("Tweets", tweets);
// convert raw tweets to smors
var smors = twitterAdaptor.toSmors(tweets);
console.log("Smors", smors);
// // convert smor to ssb post
var ssb_posts = ssbAdaptor.smorsToSsb(smors);
console.log("Ssb posts", ssb_posts);

var ssb_posts = ssbAdaptor.smorsToSsb(twitterAdaptor.toSmors(twitterAdaptor.readFromDataDir(config.twitter.data_dir)));
console.log("Ssb posts", ssb_posts);

var fbkPosts = facebookAdaptor.readFromDataDir(config.facebook.data_dir);
console.log("fbkPosts", fbkPosts)
var fbkSmors = facebookAdaptor.toSmors(fbkPosts);
console.log("fbkSmors", fbkSmors)

// var allSmors = smorsT.concat(smorsF);
// console.log("Posts", allSmors)
// createDataFile(allSmors);

