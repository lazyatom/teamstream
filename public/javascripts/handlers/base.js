var Base = function Base() {}

Base.allMessages = "__ALL_MESSAGES";

$.extend(Base.prototype, {
  respondTo: [],
  panel: null,

  process: function(data) {
    var message = this.message(data);
    var from = this.from(data);
    message.append(from);
    message.append(this.timestamp(data));
    message.append(this.messageContent(data));
    message.data('message', data);
    var messages = this.panel.find(".message");
    if (messages.length > 0) {
      var last_message = messages.last().data().message;
      var same_type = (last_message.type == data.type);
      var same_user = (last_message.user == data.user);
      if (same_user && same_type) {
        $(from).addClass('no_from_change');
      } else {
        $(from).removeClass('no_from_change');
      }
    }
    this.panel.append(message);
    return message;
  },

  message: function(data) {
    var classes = [data.type,"message group"];
    return $.li("", { "class": classes.join(" ") });
  },

  from: function(data) {
    return $.span(data.user, { "class": 'from' });
  },

  messageContent: function(data) {
    return $.span(data.content, { "class": 'content' });
  },

  timestamp: function(data) {
    return $.a("", { "class": "time-sent", href: (PissWhistle.stream_name + "/message/" + data._id['$oid'])}).append(
      $.time(data.timestamp, {"datetime": this.iso8601(data.timestamp),"class": 'timestamp timeago'}).timeago()
    );
  },

  iso8601: function(timestamp) { return $.iso8601(timestamp) }
});

