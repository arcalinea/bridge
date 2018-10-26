
var ssbAdaptor = exports;
ssbAdaptor.smorsToSsb = smorsToSsb;

function smorsToSsb(posts) {
  var ssb_posts = [];
  for (var i in posts){
    ssb_post = {};
    ssb_post['type'] = "post";
    ssb_post['text'] = posts[i]['data']['text'];
    ssb_posts.push(ssb_post)
  }
  return ssb_posts;
}