module("PissWhistle handlers");

test("should only invoke handlers that respond to the type of the data being processed", function() {
  var handler1Buffer = '';
  var handler2Buffer = '';
  var handler3Buffer = '';

  var handler1 = {
    respondTo: ['message'],
    process:   function(data) { handler1Buffer = data.content; }
  };
  var handler2 = {
    respondTo: ['message'],
    process:   function(data) { handler2Buffer = data.content; }
  }
  var handler3 = {
    respondTo: ['not-message'],
    process:   function(data) { handler3Buffer = data.content; }
  }
  PissWhistle.addHandler(handler1);
  PissWhistle.addHandler(handler2);
  PissWhistle.addHandler(handler3);

  PissWhistle.initialize();

  var data = {
    id: 'abc',
    type:    'message',
    content: 'testContent'
  };

  PissWhistle.process(data);

  equals(handler1Buffer, 'testContent');
  equals(handler2Buffer, 'testContent');
  equals(handler3Buffer, '');
});

test("should invoke global handlers for all messages regardless of type", function() {
  var handlerBuffer = '';

  var globalHandler = {
    respondTo: Base.allMessages,
    process:   function(data) { handlerBuffer = handlerBuffer + data.content; }
  }
  PissWhistle.addHandler(globalHandler);

  PissWhistle.initialize();

  PissWhistle.process({id: 'abc', type:'message',     content: 'good'})
  PissWhistle.process({id: 'def', type:'not-message', content: 'times'})

  equals(handlerBuffer, 'goodtimes');
})

test("should ignore messages that have already been received", function() {
  var handlerBuffer = '';

  PissWhistle.addHandler({
    respondTo: ['message'],
    process:   function(data) { handlerBuffer = handlerBuffer + data.content }
  });

  PissWhistle.initialize();

  var message = {id: 'abc', type: 'message', content: 'hello'};
  PissWhistle.process(message);
  PissWhistle.process(message);

  equals(handlerBuffer, 'hello');
})

module("PissWhistle connection management", {
  setup: function() {
    $("#qunit-fixture").append('<div id="disconnected" style="display: none"></div>');
  }
});

test("should not show the disconnect message when the connection is connected", function() {
  PissWhistle.connection = {
    is_connected : function() { return true }
  }
  PissWhistle.check_connection()

  ok($("#disconnected:visible").length == 0)
});

test("should show disconnected message when the connection isn't connected", function() {
  PissWhistle.connection = {
    is_connected : function() { return false }
  }
  PissWhistle.check_connection()

  ok($("#disconnected:visible").length > 0)
});

test("should not show disconnected message when the connection is re-connected", function() {
  var connected = false;
  PissWhistle.connection = {
    is_connected : function() { return connected }
  }
  PissWhistle.check_connection();
  connected = true;
  PissWhistle.check_connection();

  ok($("#disconnected:visible").length == 0)
});

