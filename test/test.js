const config = require('../config');
const utils = require('../utils');

const twitterAdaptor = require('../extensions/twitter');
const facebookAdaptor = require('../extensions/facebook');
const ssbAdaptor = require('../extensions/ssb');

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

// Get raw tweets
var tweets = twitterAdaptor.readFromDataDir('./test/data');
console.log("Tweets", tweets);
// convert raw tweets to smors
var smors = twitterAdaptor.toSmors(tweets);
console.log("Smors", smors);
// // convert smor to ssb post
var ssb_posts = ssbAdaptor.smorsToSsb(smors);
console.log("Ssb posts", ssb_posts);

var ssb_posts = ssbAdaptor.smorsToSsb(twitterAdaptor.toSmors(twitterAdaptor.readFromDataDir('./test/data')));
console.log("Ssb posts", ssb_posts);

var fbkPosts = facebookAdaptor.readFromDataDir(config.facebook.data_dir);
console.log("fbkPosts", fbkPosts)
var fbkSmors = facebookAdaptor.toSmors(fbkPosts);
console.log("fbkSmors", fbkSmors)

var allSmors = smors.concat(fbkSmors);
console.log("Posts", allSmors)
utils.createDataFile(allSmors);

