var Twitter = function Twitter(panel) {
  this.panel = $(panel);
}

Twitter.prototype = new Base;
Twitter.prototype.constructor = Twitter;

$.extend(Twitter.prototype, {
  respondTo: ['tweet'],

  from: function(data) {
  },

  messageContent: function(data) {
    var tweet = data.original;
    var content_span = $.span(": ", {"class": 'content'});
    var img = $('<img src="' +  tweet.user.profile_image_url + '" />');
    content_span.prepend($.a(" " + tweet.user.name, {href:"http://twitter.com/" + tweet.user.screen_name, target:"_blank"}));
    content_span.prepend(img);
    content_span.append(tweet.text + " ");
    content_span.append($.a('#', {href:"http://twitter.com/" + tweet.user.screen_name + "/statuses/" + tweet.id_str, target:"_blank"}));
    return content_span;
  }
});