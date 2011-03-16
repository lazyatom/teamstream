var world = null;

module("Github handler", {
  setup: function() {
    $("#stream").remove();
    world = {
      panel: $('<div id="stream"></div>'),
      
      sampleMessage: {
        "pusher":{
          "name":"floehopper",
          "email":"james@floehopper.org"
        }, 
        "repository":{
          "name":"hashblue", 
          "created_at":"2010/02/15 08:51:03 -0800", 
          "has_wiki":true, 
          "private":true, 
          "watchers":2, 
          "fork":false, 
          "url":"https://github.com/freerange/some_project", 
          "pushed_at":"2010/11/16 05:30:00 -0800", 
          "open_issues":0, 
          "has_downloads":true, 
          "has_issues":true, 
          "homepage":"", 
          "forks":1, 
          "organization":"freerange", 
          "description":"Doing awesome things", 
          "owner":{
            "name":"freerange", 
            "email":"lets@gofreerange.com"
          }
        }, 
        "forced":false, 
        "after":"a4ab62e4af9e16cbea3d5170d2fc995b589a28f1", 
        "ref":"refs/heads/master", 
        "commits":[{
          "added":[], 
          "modified":["test/unit/contact_test.rb"], 
          "author":{
            "name":"James Mead", 
            "username":"floehopper", 
            "email":"james@floehopper.org"
          }, 
          "timestamp":"2010-11-15T04:40:00-08:00", 
          "removed":[], 
          "url":"https://github.com/freerange/some_project/commit/a4ab62e4af9e16cbea3d5170d2fc995b589a28f1", 
          "id":"a4ab62e4af9e16cbea3d5170d2fc995b589a28f1", 
          "message":"Fixed incorrectly named context."
        },{
          "added":[], 
          "modified":["app/models/contact.rb"], 
          "author":{
            "name":"James Adam", 
            "username":"lazyatom", 
            "email":"james@lazyatom.com"
          }, 
          "timestamp":"2010-11-14T03:25:00-08:00", 
          "removed":[], 
          "url":"https://github.com/freerange/some_project/commit/70d2fc995b589a28f1a4ab62e4af9e16cbea3d51", 
          "id":"70d2fc995b589a28f1a4ab62e4af9e16cbea3d51", 
          "message":"Did some stuff\n\nIt was complicated"
        }],
        "compare":"https://github.com/freerange/some_project/compare/1a5719e...a4ab62e", 
        "before":"1a5719e2d6815e4220e3887c1c6dc01ad1278cd7"
      }
    };
    world.github = new Github(world.panel),
    
    // useful for debugging
    // $("body").append(world.panel);

    world.github.process({type:'github',original:world.sampleMessage});
  }
});

test("should only respond to github messages", function() {
  equals(world.github.respondTo[0], 'github');
  equals(world.github.respondTo.length, 1);
});

test("should display github messages in the given panel", function() {
  equals(world.panel.find("li").length, 1);
});

test("should include a link to open the repository in a new window", function() {
  link = world.panel.find("li a[href=https://github.com/freerange/some_project]");
  equals(link.attr('target'), '_blank');
})

test("should include a link to the compare url for the pushed commits in a new window", function() {
  link = world.panel.find("li a[href=https://github.com/freerange/some_project/compare/1a5719e...a4ab62e]");
  equals(link.attr('target'), '_blank');
})

test("should show when the push happened", function() {
  equals(world.panel.find(".pushed_at").attr("datetime"), "2010-11-16T13:30:00Z");
})

test("should link the first line of the commit message to open each commit in a new window", function() {
  var commit_1 = world.panel.find("li a[href=https://github.com/freerange/some_project/commit/a4ab62e4af9e16cbea3d5170d2fc995b589a28f1]");
  equals(commit_1.attr('target'), '_blank');
  equals(commit_1.text(), "Fixed incorrectly named context.");

  var commit_2 = world.panel.find("li a[href=https://github.com/freerange/some_project/commit/70d2fc995b589a28f1a4ab62e4af9e16cbea3d51]")
  equals(commit_2.attr('target'), '_blank');
  equals(commit_2.text(), "Did some stuff");
})