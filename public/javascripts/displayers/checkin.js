PissWhistle.addDisplayer("checkin", {
  panel: null,

  initialize: function(panel) {
    this.panel = panel
  },

  process: function(data) {
    var message = $.div("", {"class": data.type + " message"});

    if (data.original.status == "fail") {
      $(message).addClass('fail');
    }

    if ($.trim(this.panel.find("span.from").last().html()) == $.trim(data.user)) {
      message.append($.span(data.user, { "class": 'from hidden' }));
      message.append($.span('', { "class": 'from_shim' }));
    } else {
      message.append($.span(data.user, { "class": 'from from_change' }));
    }

    var checkin = data.original.last_checkins[0];
    var map = "<img src='http://maps.google.com/maps/api/staticmap?markers=size:tiny|color:green|" + data.lat + "," + data.lng + "&zoom=12&size=250x50&sensor=false'>"
    var link_message =  checkin.message + " - <a href='http://gowalla.com" + checkin.spot.url + "'>" + checkin.spot.name + "</a>"
    var contentSpan = $.span(map + link_message, { "class": 'content' });
    message.append(contentSpan);

    message.append($.span($.timeago(new Date(data.timestamp)), { "class": 'timestamp' }));

    this.panel.append(message);
  }
});