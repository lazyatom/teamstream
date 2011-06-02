Status = function(panel) {
  this.panel = $(panel);
}

Status.prototype = {
  respondTo: ['status'],

  process: function(message) {
    $.each(this.panel.find("li#"+message["user"]), function(i, item) {
      $("span",item).remove();
      $(item).append($.span(" ("+message["original"]["message"]+")"))
    });
  }
}