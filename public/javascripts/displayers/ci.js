PissWhistle.addDisplayer("ci", {
  panel: null,

  initialize: function(panel) {
    this.panel = panel;
  },

  process: function(data) {
    var message = document.createElement('div')
    $(message).addClass(data.type).addClass("message");

    if (data.original.status == "fail") {
      $(message).addClass('fail');
    }

    if ($.trim(this.panel.find("span.from").last().html()) == $.trim(data.user)) {
      message.appendChild($.span('from hidden', data.user));
      message.appendChild($.span('from_shim', ''));
    } else {
      message.appendChild($.span('from', data.user));
      $(message).addClass('from_change');
    }
    message.appendChild($.span('content', data.content));
    message.appendChild($.span('timestamp', $.timeago(new Date(data.timestamp))));

    this.panel.append(message);
  }
});