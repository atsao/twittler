// Twittler
// In progress...

// Variables
var startIndex = 0;
var maxIndex = 0;

var loadTweets = function() {
  var tweet, tweetBlock;

  maxIndex = streams.home.length - 1;
  if (maxIndex > startIndex) {
    startIndex = startIndex === 0 ? 0 : startIndex + 1; // initial run
    $('#new-alert').text(''); // cleanup
    for (var i = startIndex; i <= maxIndex; i++) {
      tweet = streams.home[i];
      tweetBlock = $('<div>')
        .addClass('tweet')
        .append($('<a>')
          .addClass('username')
          .attr('href', 'javascript:loadUserTimeline("' + tweet.user + '");')
          .text(tweet.user))
        .append($('<p>')
          .addClass('message')
          .text(tweet.message)
          .append($('<p>')
            .append($('<time>')
              .addClass('timestamp')
              .text(tweet.created_at))));

      (tweetBlock).prependTo('#content').show(500);
    }
  }
  startIndex = maxIndex;
}

var loadUserTimeline = function(user) {
  var userTweetsIndex = streams.users[user].length - 1;
  var userTweet, userTweets, userTweetBlock;

  //$('#user-timeline').text('');
  clearUserTimeline();

  // Create a growing div for all of a user's tweets
  userTweets = $('<div>').addClass('user-tweets');


  while (userTweetsIndex !== 0) {
    userTweet = streams.users[user];
    userTweetBlock = $('<div>')
        .addClass('tweet')
        .append($('<a>')
          .addClass('username')
          .attr('href', 'javascript:loadUserTimeline("' + user + '");')
          .text(user))
        .append($('<p>')
          .addClass('message')
          .text(userTweet[userTweetsIndex].message)
          .append($('<p>')
            .append($('<time>')
              .addClass('timestamp')
              .text(userTweet[userTweetsIndex].created_at))));
    (userTweetBlock).show().appendTo(userTweets);
    
    userTweetsIndex--;
  }

  // Append the block of all the user's tweets to the modal window
  $('#user-timeline')
    .prepend($('<h1>')
      .text(user).addClass('timeline-title'))
    .prepend($('<a>')
      .text('\u2715').addClass('timeline-close')
      .attr('href', 'javascript:clearUserTimeline();'))
    .append(userTweets).show();

  $('#user-timeline').addClass('active');
  $('.overlay').addClass('active');
  $('body').addClass('fixed');
}

var clearUserTimeline = function() {
  $('#user-timeline').text('').removeClass('active');
  $('.overlay').removeClass('active');
  $('body').removeClass('fixed');
}

var checkTweets = function() {
  var tweetCount;
  if (streams.home.length - 1 > maxIndex) {
    tweetCount = streams.home.length - maxIndex;
    $('#new-alert').text(tweetCount + ' new tweets!');
  } else {
    $('#new-alert').text('');
    tweetCount = 0;
  }
  //setTimeout(checkTweets, 500);
}

$('#new-alert').on('click', function() {
    loadTweets();
    $(this).text('');
  });
$('.overlay').on('click', clearUserTimeline);

$(document).ready(function() {
  loadTweets();
  

  checkTweets();

})
