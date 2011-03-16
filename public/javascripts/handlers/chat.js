var Chat = function Chat(panel) {
  this.panel = $(panel);
  this.prepareDOM(this.panel);
  this.setupInput();
}

Chat.prototype = new Base;
Chat.prototype.constructor = Chat;

$.extend(Chat.prototype, {
  respondTo: ['chat', 'meta'],
  input: null,
  user: null,

  process: function(data) {
    var message = this.message(data);
    var from = this.from(data);
    message.append(from);
    message.append(this.timestamp(data));
    message.append(this.messageContent(data));
    message.data('message', data);

    var messages = this.panel.find(".message");
    var historical = false;
    if (messages.length > 0) {
      var timestampOfEarliestMessage = new Date(messages.first().data().message.timestamp);
      historical = new Date(data.timestamp) < timestampOfEarliestMessage;
    }

    if (historical) {
      if (messages.length > 0) {
        var first_message = messages.first().data().message;
        var same_type = (first_message.type == data.type);
        var same_user = (first_message.user == data.user);
        if (same_user && same_type) {
          this.panel.find('.message:first .from').addClass('no_from_change');
        } else {
          this.panel.find('.message:first .from').removeClass('no_from_change');
        }
      }
      this.panel.prepend(message);
    } else {
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
    }
    return message;
  },

  from: function(data) {
    if (!data.user) {
      data.user = "guest";
    };

    var from = $.span(data.user, { "class": 'from' });

    return from;
  },

  messageContent: function(data) {
    if (data.isPaste) {
      var formattedPaste = $("<pre></pre>").text(data.content);
      var contentSpan = $.span("", {"class": 'content'});
      $(contentSpan).append(formattedPaste).addClass("paste");
    } else {
      var contentSpan = $.span(data.content, {"class": 'content'});
      contentSpan.autolink();
    }
    //contentSpan.appendChild($.span('source', ' ('+data.type+')'));
    return contentSpan;
  },

  prepareDOM: function(panel) {
    var input = $('<textarea id="phrase"></textarea>')[0];
    var chatPanel = $('<div id="input"></div>')[0];
    chatPanel.appendChild(input);
    $("#footer").append(chatPanel);
    this.input = $(input);
  },

  setupInput: function() {
    this.input.attr('autocomplete','OFF');
    var self = this;
    this.input.keydown(function(ev) {
      var keyc = self.getKeyCode(ev);
      if (keyc == 13 || keyc == 10) {
        self.send($.trim(self.input.val()));
        self.input.val('');
        return false;
      }
      return true;
    });
    this.input.focus();
  },

  getKeyCode: function(ev) {
    if (window.event) return window.event.keyCode;
    return ev.keyCode;
  },

  send: function(text) {
    if (text != null && text.length>0 ) {
      if (this.isCorrection(text)) {
        PissWhistle.send({'type':'chatCorrection','content':text});
      } else {
        var isPaste = text.indexOf("\n") > 0;
        PissWhistle.send({'type':'chat','content':text,'isPaste':isPaste});
      }
    }
  },

  isCorrection: function(text) {
    return !(text.match(/^s\/[\w\s]+\/[\w\s]+/) == null);
  }
});