var world;

module("Status handler", {
  setup: function() {
    $("#qunit-fixture").append("<div id='presence'></div>");
    world = {
      status: new Status("#qunit-fixture #presence"),
      presence: new Presence("#qunit-fixture #presence")
    };
  }
});

test("should only respond to status messages", function() {
  equals(world.status.respondTo[0], 'status');
  equals(world.status.respondTo.length, 1);
});

test("given an existing presence messages, when a new status is received, should add it next to the user", function() {
  world.presence.process({type: 'presence', accounts:['alice', 'bob']});
  world.status.process({type: 'status', user:'alice', original:{message:'I am playing at the moment'}});

  var statuses_for_accounts = $.map($("#qunit-fixture #presence ol li"), function(item) {
    if ($(".status", item).length > 0) {
      return $(".status", item).text();
    }
  });

  equals(statuses_for_accounts.length, 1);
  equals(statuses_for_accounts[0], ' (I am playing at the moment)')
})

test("Given a presence and status for a user, when a new status is received remove old and set new one", function() {
  world.presence.process({type: 'presence', accounts:['alice', 'bob']});
  world.status.process({type: 'status', user:'alice', original:{message:'I am playing at the moment'}});

  world.status.process({type: 'status', user:'alice', original:{message:'Working on Teamstream'}});

  var statuses_for_accounts = $.map($("#qunit-fixture #presence ol li"), function(item) {
    if ($(".status", item).length > 0) {
      return $(".status", item).text();
    }
  });

  equals(statuses_for_accounts.length, 1);
  equals(statuses_for_accounts[0], ' (Working on Teamstream)')
});