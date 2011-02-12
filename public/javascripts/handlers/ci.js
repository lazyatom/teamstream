var CI = function CI() {
  this.panel = $.ol("", { id: "ci" });
  $(this.panel).addClass("top_panel");
  $("#top").append(this.panel);
  this.panel.before();
}

CI.prototype = new Base;
CI.prototype.constructor = CI;

$.extend(CI.prototype, {
  respondTo: ['ci', 'hudson'],
  projects: {},

  message: function(data) {
    console.log(data.original);
    var classes = [data.type,"build group " + data.original.result.toLowerCase()];
    return $.li("", { "class": classes.join(" ") });
  },

  process: function(data) {
    this.processProject(data);
    var message = this.message(data);

    var original = data.original;

    var contentSpan = $.span("", { "class" : 'content'})
    contentSpan.append($.p(original.message))

    when = $.a("", { "class": "time-sent", href: (PissWhistle.stream_name + "/message/" + data._id['$oid'])}).append(
      $.time(data.timestamp, {"datetime": this.iso8601(data.timestamp),"class": 'timestamp timeago'}).timeago()
    );
    contentSpan.append(when);
    message.append(contentSpan);

    message.hover(function(){
      $(".content",this).toggle();
    });

    this.panel.prependAndShow(message);
  },

  processProject: function(data) {
    if (data.original.build != undefined) {
      var tmp = data.original.build.workspace.split("/");
      var project = tmp.reverse()[1].toLowerCase();
      this.projects[project] = {'result' : data.original.result.toLowerCase()};

      var failureExists = false;
      for (var i in this.projects) {
        if (this.projects[i].result == 'failure') {
          failureExists = true;
        }
      }

      if (failureExists) {
        $("ol#ci").addClass("build_failure");
      } else {
        $("ol#ci").removeClass("build_failure");
      }
    }
  }
});