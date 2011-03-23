var Github = function Github(panel) {
  this.panel = $(panel);
}

Github.prototype = new Base;
Github.prototype.constructor = Github;

$.extend(Github.prototype, {
  respondTo: ['github'],

  messageContent: function(data) {
    var original = data.original;
    var number_of_commits = original.commits.length;
    var contentSpan = $.span(": ", { "class": 'content' });
    contentSpan.prepend($.a(original.repository.name, { href: original.repository.url, target: "_blank"}));
    if (original.commits.length == 1) {
      number_of_commits = number_of_commits + " commit";
    } else {
      number_of_commits = number_of_commits + " commits";
    }
    var link = $.a(number_of_commits, { href: original.compare, target: "_blank" });
    contentSpan.append(link);
    contentSpan.append(" pushed ");
    var pushedAt = this.iso8601(data.original.repository.pushed_at);
    var timestamp = $.time(pushedAt, {"datetime": pushedAt,"class": 'pushed_at timestamp timeago'}).timeago()
    contentSpan.append(timestamp);

    $.each(original.commits, function(index, commit){
      var div = $.div("' by " + commit.author.name, { "class": 'github_commit' });
      div.prepend($.a(commit.message.split("\n")[0], {href: commit.url, target: "_blank"}));
      div.prepend("'");
      contentSpan.append(div);
    });

    return contentSpan;
  },

  timestamp: function(data) {
    return "";
  }
});