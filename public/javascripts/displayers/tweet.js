PissWhistle.addDisplayer("tweet", {
  panel: null,

  initialize: function(panel) {
    this.panel = panel;
  },

  process: function(data) {
    var message = $.div("", {"class": data.type + " message"});

    message.appendChild($.span('from', data.user));

    tweet = document.createElement('div');
    tweet.className = "tweet_border";
    avatar = document.createElement('img');
    avatar.src = "http://img.tweetimag.es/i/"+data.original.user.screen_name+"_n.png";
    tweet.appendChild(avatar);
    tweet.appendChild($.span('content', data.content));
  
    from_div = document.createElement('div');
    profile_link = document.createElement('a');
    profile_link.href = "http://twitter.com/"+data.original.user.screen_name;
    profile_link.target = "_blank";
    profile_link.innerHTML = "@"+data.original.user.screen_name;
    from_div.appendChild(profile_link);
    from_div.appendChild($.span(" via twitter", {"class": 'twitter_source'}));
    tweet.appendChild(from_div);

    message.appendChild(tweet);

    this.panel.append(message);
  }
});