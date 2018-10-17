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
        return 'myLink';
    }
    var re = new RegExp('^' + username + ' updated .{1,6} status.');
    if (post.title.match(re)) {
      return 'myStatusUpdate';
    }
    if (post.title.match(/.* shared a link to your timeline./)) {
      return 'linkOnMyTL';
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
                case 'myLink': 
                    // console.log("Original post:", post)
                    if (post['data']){
                        var postObj = {
                            'text': post['data'][0]['post'],
                            'created_at': post['timestamp']
                        }
                        posts.push(postObj);
                        break;
                    }
                case 'myStatusUpdate':
                    if (post['data']){
                      var postObj = {
                        'text': post['data'][0]['post'],
                        'created_at': post['timestamp']
                      }
                      posts.push(postObj);
                      break;
                    }
                case 'linkOnMyTL':
                    if (post['data']){
                      // get author info
                      var author = post['title'].match(/^(.*) shared/)[1];
                      var postObj = {
                        'text': post['data'][0]['post'],
                        'created_at': post['timestamp'],
                        'author': author
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