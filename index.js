const config = require('./config');
const utils = require('./utils');

const twitterAdaptor = require('./extensions/twitter');
const ssbAdaptor = require('./extensions/ssb');
const facebookAdaptor = require('./extensions/facebook');

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
