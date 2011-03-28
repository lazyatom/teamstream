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

    var contentSpan = $.span("", { "class": 'content' });

    contentSpan.prepend($.a(original.repository.name, { href: original.repository.url, target: "_blank"}));

    var pushedAt = this.iso8601(data.original.repository.pushed_at);
    var timestamp = $.time(pushedAt, {"datetime": pushedAt,"class": 'pushed_at timestamp timeago'}).timeago()

    var link = $.a("", { href: original.compare, target: "_blank", "class": "compare_link",
      "title":"View compare diffs"
    });
    link.append(timestamp)
    contentSpan.append(link);

    $.each(original.commits, function(index, commit){
      var div = $.div("", { "class": 'github_commit' });
      div.append($.img("", {
        "src":"http://www.gravatar.com/avatar/" + $.md5(commit.author.email) + "?s=20",
        "title":commit.author.name,
        "class":"github_author_image"
        }));
      div.append($.a(commit.message.split("\n")[0], {href: commit.url, target: "_blank"}));
      contentSpan.append(div);
    });

    return contentSpan;
  },

  timestamp: function(data) {
    return "";
  }
});