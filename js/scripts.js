// Variables
// startIndex - Index where tweets loaded so far stopped
// maxIndex - Index of most recent tweet created
var startIndex = 0;
var maxIndex = 0;

// Load Tweets function
// Determines if there are new tweets to load
// If so, builds elements needed for tweet and adds to timeline
var loadTweets = function() {
  var tweet, tweetBlock, i;

  // Determine index of most recent tweet created
  maxIndex = streams.home.length - 1;

  // If there are new tweets that aren't yet loaded, build and add them to the timeline
  if (maxIndex > startIndex) {
    // On initial load of timeline, start at beginning of all tweets
    // On subsequent loads, determine where tweets should start loading from
    startIndex = startIndex === 0 ? 0 : startIndex + 1;

    // Clear alert box for new tweets available
    $('#new-alert').text('No new tweets.');

    // Loop through all the tweets so far, using startIndex and maxIndex as the bounds
    for (i = startIndex; i <= maxIndex; i++) {
      // Pull tweet information at iterator
      tweet = streams.home[i];

      // Build elements of tweet
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
              .addClass('timeago')
              .attr('datetime', tweet.created_at.toISOString())
              .text(tweet.created_at.toISOString()))));

      // Prepend block of tweet elements to the content div and utilize jQuery animation to show
      (tweetBlock).prependTo('#content').show(500);
    }
  }
  // At end of loop, all tweets so far are loaded
  // Re-initialize starting point
  startIndex = maxIndex;

  $("time.timeago").timeago();
}

// Load User Timeline
// If user selects a username, this will open a modal window to show that username's timeline
var loadUserTimeline = function(user) {
  var userTweet, userTweets, userTweetBlock;
  
  // Determine index of user's most recent tweet
  var userTweetsIndex = streams.users[user].length - 1;

  // Clear out user timeline for fresh load
  clearUserTimeline();

  // Initialize a growing div for all of a user's tweets
  userTweets = $('<div>').addClass('user-tweets');

  // Loop through each user's tweet to build individual tweet blocks
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
              .addClass('timeago')
              .attr('datetime', userTweet[userTweetsIndex].created_at.toISOString())
              .text(userTweet[userTweetsIndex].created_at.toISOString()))));

    // Show user's tweets and append to initialized user tweet container
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
      .attr('title', 'Close')
    .append(userTweets).show();

    $("time.timeago").timeago();

  // Add classes to the user timeline, overlay, and body to focus the modal window
  $('#user-timeline').addClass('active');
  $('.overlay').addClass('active');
  $('body').addClass('fixed');
}

// Clear User Timeline function
// Removes classes from the user timeline modal window to bring focus back to main timeline
var clearUserTimeline = function() {
  $('#user-timeline').text('').removeClass('active');
  $('.overlay').removeClass('active');
  $('body').removeClass('fixed');
}

// Check Tweets function
// Periodically check total tweets count for new tweets available
// Alert user there are new tweets to load
var checkTweets = function() {
  var tweetCount;

  // If the total tweet count is greater than the most recent tweet loaded, let's alert the user
  if (streams.home.length - 1 > maxIndex) {
    // Calculate the number of new tweets not yet loaded
    tweetCount = streams.home.length - maxIndex;
    $('#new-alert').text(tweetCount + ' new tweets!');
  } else {
    $('#new-alert').text('No new tweets.');
    tweetCount = 0;
  }

  // Set time to check for new tweets
  setTimeout(checkTweets, 1000);
}

// Add click listener to load new tweets
$('#new-alert').on('click', function() {
    loadTweets();
    $(this).text('No new tweets.');
  });

// Clear the user's timeline when the overlay is clicked
$('.overlay').on('click', clearUserTimeline);

$(document).ready(function() {
  // Initial load of tweets
  loadTweets();

  // Initialize time ago
  $("time.timeago").timeago();

  // Initial check for new tweets
  checkTweets();
})
