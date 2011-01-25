var world = null;

module("Fluid dock badge test", {
  setup: function() {
    window.fluid = {};
    world = {
      originalWindowTitle: document.title = 'window-title',
      unreadMessageCount:  new UnreadMessageCount()
    };
  }
});

test("should only respond to chat messages", function() {
  equals(world.unreadMessageCount.respondTo[0], 'chat');
  equals(world.unreadMessageCount.respondTo.length, 1);
});

test("should not prepend a count of new messages when we're on the window", function() {
  world.unreadMessageCount.process({type: 'chat'});
  
  equals(window.fluid.dockBadge, '');
})

test("should prepend a count of new messages when we move away from the window", function() {
  $(window).blur();
  world.unreadMessageCount.process({type: 'chat'});
  world.unreadMessageCount.process({type: 'chat'});
  
  equals(window.fluid.dockBadge, '2');
});

test("should not prepend a count of new messages when we move away and then come back to the window", function() {
  $(window).blur();
  $(window).focus();
  world.unreadMessageCount.process({type: 'chat'});
  
  equals(window.fluid.dockBadge, '');
})

test("should clear any count of new messages when the window is focused", function() {
  $(window).blur();
  world.unreadMessageCount.process({type: 'chat'});
  $(window).focus();
  
  equals(window.fluid.dockBadge, '');
})

test("reset count of new messages when we leave the window a second time", function() {
  $(window).blur();
  world.unreadMessageCount.process({type: 'chat'});
  $(window).focus();
  $(window).blur();
  world.unreadMessageCount.process({type: 'chat'});
  
  equals(window.fluid.dockBadge, '1');
})

test("should only count messages that arrive since we left the window", function() {
  world.unreadMessageCount.process({type: 'chat'});
  $(window).blur();
  world.unreadMessageCount.process({type: 'chat'});
  
  equals(window.fluid.dockBadge, '1');
})