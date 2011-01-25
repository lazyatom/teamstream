var Deploy = function Deploy(panel) {
  this.panel = $(panel);
}

Deploy.prototype = new Base;
Deploy.prototype.constructor = Deploy;

$.extend(Deploy.prototype, {
  respondTo: ['deploy'],
 
  messageContent: function(data) {
    var original = data.original;
    var contentSpan = $.span(":", { "class":"content" });
    contentSpan.prepend($.a(original.application, { href: original.github_url, target: "_blank" }));
    contentSpan.append($.span(original.deployed_by + " deployed build " + original.build + " to " + original.hosts ));
    contentSpan.append($.a(" - view changes", { href: original.compare_url, target: "_blank" }));
    return contentSpan;
  },

  timestamp: function(data) {
    return "";
  }
});