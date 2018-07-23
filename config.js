// config.js
const twitterConfig = {
    screen_name: 'arcalinea',
    data_dir: '/home/jay/code/social-networks/data/twitter/data/js/tweets',
    retweets: true,
    replies: true,
    from: ['2018', '03', '02'],
    to: ['2018', '05', '01'],
    dry_run: true
};

const facebookConfig = {
    username: 'Jay Graber',
    data_dir: '/home/jay/code/social-networks/data/facebook/posts',
    from: ['2015', '04', '01'],
    to: ['2018', '05', '01'],
    dry_run: true
};

module.exports = {
    'twitter': twitterConfig,
    'facebook': facebookConfig
}
