var Base = function Base() {}

Base.allMessages = "__ALL_MESSAGES";

$.extend(Base.prototype, {
  respondTo: [],
  panel: null,

  process: function(data, historical) {
    var message = this.message(data);
    message.append(this.from(data));
    message.append(this.timestamp(data));
    message.append(this.messageContent(data));
    message.data('message', data);
    if (historical) {
      this.panel.prepend(message);
    } else {
      this.panel.append(message);
    }
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

  iso8601: function(date) {
    function pad(n){
      return n<10 ? '0'+n : n
    }
    d = new Date(date);
    return d.getUTCFullYear()+'-'
    + pad(d.getUTCMonth()+1)+'-'
    + pad(d.getUTCDate())+'T'
    + pad(d.getUTCHours())+':'
    + pad(d.getUTCMinutes())+':'
    + pad(d.getUTCSeconds())+'Z'
  }
});

