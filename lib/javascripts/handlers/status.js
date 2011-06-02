Status = function(panel) {
  this.panel = $(panel);
}

Status.prototype = {
  respondTo: ['status'],

  process: function(message) {
    $.each(this.panel.find("li#"+message["user"]), function(i, item) {
      $("span.status",item).remove();
      $(item).append($.span(" ("+message["original"]["message"]+")", {"class":"status"}))
    });
  }
}