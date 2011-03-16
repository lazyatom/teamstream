var world;

module("Presence handler", {
  setup: function() {
    $("#qunit-fixture").append("<div id='presence'></div>");
    world = {
      presence: new Presence("#qunit-fixture #presence")
    };
  }
});

test("should only respond to chat messages", function() {
  equals(world.presence.respondTo[0], 'presence');
  equals(world.presence.respondTo.length, 1);
});

test("should add a list of accounts to the pane", function() {
  world.presence.process({type: 'presence', accounts:['alice', 'bob']});

  var presence = $("#qunit-fixture #presence");
  var accounts = $.map(presence.find("li"), function(item) {
    return $(item).text();
  });
  equals(accounts.length, 2);
  equals(accounts[0], 'alice');
  equals(accounts[1], 'bob');
})

test("given an existing message, when a new message is received, should replace the list of accounts", function() {
  world.presence.process({type: 'presence', accounts:['alice', 'bob']});
  world.presence.process({type: 'presence', accounts:['alice']});

  var presence = $("#qunit-fixture #presence")
  var accounts = $.map(presence.find("li"), function(item) {
    return $(item).text();
  });
  equals(accounts.length, 1);
  equals(accounts[0], 'alice');
})