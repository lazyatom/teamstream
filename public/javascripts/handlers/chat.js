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