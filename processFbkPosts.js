const fs = require('fs');
const readline = require('readline');
const path = require('path');
var moment = require('moment');
var prompt = require('prompt-sync')();

const config = require('./config');

var processPosts = function(dataDir) {
    var postsToBeAdded = getPostsToAdd(path.join(config.facebook.data_dir, 'your_posts.json'));
    return postsToBeAdded;
};

module.exports = processPosts;

function getType(post){
    if (post.title == config.facebook.username +  " shared a link." || post.title == config.facebook.username +  " shared a post."){
        return 'original';
    }
}

function getPostsToAdd(filePath){
    var posts = [];
    var postJSON = parsePosts(filePath);
    for (var i in postJSON){
        var post = postJSON[i];
        var postTime = moment.unix(post['timestamp']);
        var from = moment(config.facebook.from.join('-'), "YYYY-MM-DD");
        var to = moment(config.facebook.to.join('-'), "YYYY-MM-DD");
        if (postTime > from && postTime < to){
            switch(getType(post)){
                case 'original': 
                    // console.log("Original post:", post)
                    if (post['data']){
                        var postObj = {
                            'text': post['data'][0]['post'],
                            'created_at': post['timestamp']
                        }
                        posts.push(postObj);
                        break;
                    }
            }
        }
    }
    return posts
}

function parsePosts(filePath){
    var data = fs.readFileSync(filePath, 'utf8');
    var postJSON = JSON.parse(data);
    return postJSON
}