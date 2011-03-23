var ChatCorrection = function ChatCorrection() {}

ChatCorrection.prototype = new Base;
ChatCorrection.prototype.constructor = ChatCorrection;

$.extend(ChatCorrection.prototype, {
  respondTo: ['chatCorrection'],

  process: function(data) {
    var lastMessage = $(".message").filter(function() { return $(this).find(".from").text() == data.user }).last();
    var original_content = $(lastMessage).children(".content").text();
    var match = data.content.split("/")[1];
    var replacement = data.content.split("/")[2];
    $(lastMessage).children(".content").text(original_content.replace(match, replacement));

    var time = $.time(data.timestamp, {"datetime": this.iso8601(data.timestamp),"class": 'timeago'}).timeago();
    var edit_span = $.span("(edited) ", { "class" : "edit-timestamp" })
    edit_span.append(time);
    $(lastMessage).children(".time-sent").empty();
    $(lastMessage).children(".time-sent").append(edit_span);
  }
});