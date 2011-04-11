var world;

module("Chat", {
  setup: function() {
    $("#qunit-fixture").append('<ul id="chat"></ul>');
    world = {
      messageFactory: function(attributes) {
        var defaults = {
          id: '4d7f5e2e5b4f52703c00009c',
          'content': 'blah blah blah',
          timestamp: '2011-03-15T12:32:04Z'
        }
        return $.extend(defaults, attributes);
      },
      messagesFromDom: function() {
        return $("#chat").find("li").map(function(index, el) {
          var content = $(el).find(".content").text();
          var author;
          fromElement = $(el).find(".from").first();
          if (!fromElement.hasClass("no_from_change")) {
            author = fromElement.text();
          }
          var timestamp = $(el).find("time").attr("datetime");
          var humanizedTimestamp = $(el).find("time").text();
          return {
            'content': content,
            'author': author,
            'timestamp': timestamp,
            'humanizedTimestamp': humanizedTimestamp
          }
        })
      },
      chat: new Chat("#chat")
    }
  }
})

test("add one message", function() {
  world.chat.process(world.messageFactory({content: 'blah blah blah'}));
  equals(world.messagesFromDom()[0].content, 'blah blah blah');
})

test("add multiple messages", function() {
  world.chat.process(world.messageFactory({content: 'first message'}));
  world.chat.process(world.messageFactory({content: 'second message'}));

  equals(world.messagesFromDom()[0].content, 'first message');
  equals(world.messagesFromDom()[1].content, 'second message');
})

test("display author name only once when they are the same for consecutive messages", function() {
  world.chat.process(world.messageFactory({user: 'james'}));
  world.chat.process(world.messageFactory({user: 'james'}));

  equals(world.messagesFromDom()[0].author, 'james');
  equals(world.messagesFromDom()[1].author, undefined);
})

test("add multiple messages not in timestamp order", function() {
  world.chat.process(world.messageFactory({content: 'second message', timestamp: '2011-03-15T12:32:01Z'}));
  world.chat.process(world.messageFactory({content: 'first message', timestamp: '2011-03-15T12:32:00Z'}));

  equals(world.messagesFromDom()[0].content, 'first message');
  equals(world.messagesFromDom()[1].content, 'second message');
})

test("include the timestamp of added messages", function() {
  world.chat.process(world.messageFactory({timestamp: '2011-03-15T12:32:04Z'}));
  equals(world.messagesFromDom()[0].timestamp, '2011-03-15T12:32:04Z');
})



// Author display

test("display the author of added messages", function() {
  world.chat.process(world.messageFactory({user: 'james'}));
  equals(world.messagesFromDom()[0].author, 'james');
})

test("display all authors when they are different for multiple messages", function() {
  world.chat.process(world.messageFactory({user: 'james'}));
  world.chat.process(world.messageFactory({user: 'chris'}));

  equals(world.messagesFromDom()[0].author, 'james');
  equals(world.messagesFromDom()[1].author, 'chris');
})

test("ordering and author display is correct when adding multiple messages not in timestamp order", function() {
  world.chat.process(world.messageFactory({user: 'chris', content: 'message three', timestamp: '2011-03-15T12:32:03Z'}));
  world.chat.process(world.messageFactory({user: 'chris', content: 'message four', timestamp: '2011-03-15T12:32:04Z'}));
  world.chat.process(world.messageFactory({user: 'james', content: 'message five', timestamp: '2011-03-15T12:32:05Z'}));

  // historical messages are provided by the PissWhistle class in reversed order, which is a hack that could be removed
  // that behaviour is replicated here, for now.
  world.chat.process(world.messageFactory({user: 'james', content: 'message two', timestamp: '2011-03-15T12:32:02Z'}));
  world.chat.process(world.messageFactory({user: 'james', content: 'message one', timestamp: '2011-03-15T12:32:01Z'}));

  equals(world.messagesFromDom()[0].author, 'james');
  equals(world.messagesFromDom()[1].author, undefined);
  equals(world.messagesFromDom()[2].author, 'chris');
  equals(world.messagesFromDom()[3].author, undefined);
  equals(world.messagesFromDom()[4].author, 'james');
})



// Timestamp display
test("should display the timestamp in a human-friendly format", function() {
  var now = new Date();
  var fiveMinutes = 5 * 60 * 1000;
  var fiveMinutesAgoAsISO = new Date(now - fiveMinutes).toISOString();
  world.chat.process(world.messageFactory({timestamp: $.iso8601(fiveMinutesAgoAsISO)}));
  equals(world.messagesFromDom()[0].humanizedTimestamp, '5 minutes ago');
})

