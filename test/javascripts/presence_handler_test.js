var world;

module("Presence handler", {
  setup: function() {
    $("#qunit-fixture").append("<div id='presence'></div>");
    world = {
      presence: new Presence("#qunit-fixture #presence"),
      status: new Status("#qunit-fixture #presence")
    };
  }
});

test("should only respond to presence messages", function() {
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

test("given an existing presence, when a new presence is received, should remove the user that has left", function() {
  world.presence.process({type: 'presence', accounts:['alice', 'bob']});
  world.presence.process({type: 'presence', accounts:['alice']});

  var presence = $("#qunit-fixture #presence")
  var accounts = $.map(presence.find("li"), function(item) {
    return $(item).text();
  });

  equals(accounts.length, 1);
  equals(accounts[0], 'alice');
})

test("given an existing presence and status, when new presence is received don't clear status message", function() {

  world.presence.process({type: 'presence', accounts:['alice', 'bob']});
  world.status.process({type: 'status', user:'bob', original:{message:'I am playing at the moment'}});

  world.presence.process({type: 'presence', accounts:['bob']});

  equals($("#qunit-fixture #presence li#bob span.status").text(), " (I am playing at the moment)");
});