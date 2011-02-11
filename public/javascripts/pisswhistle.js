var PissWhistle = {
  handlers: {},
  globalHandlers: [],
  messages: [],
  stream_name: null,

  initialize: function(stream_name) {
    this.messages = [];
    this.stream_name = stream_name || this.streamNameFromUrl();
    $(window).resize(this.resizePanels);
  },

  resizePanels: function() {
    $("#content").height($(window).height()-1); // stops flicker?
    $.each($(".fluid"), function(i, panel) {
      $(panel).resizePanel();
      if ($(panel).attr("id") && Display.panels_scrolling[$(panel).attr("id")] == 0) {
        $(panel).scrollToBottom();
      }
    });
    $("#content").height(""); // not sure why this is necessary either
  },

  scrollPanelsToBottom: function() {
    $(".fluid").each(function(i, panel){
      $(panel).scrollToBottom();
    });
  },

  send: function(data) {
    var data_with_user = $.extend(data, {'user':this.user});
    if (this.check_and_reconnect()) {
      setTimeout(function(){
        this.connection.send(data_with_user);
      },500);
    }
    else {
      this.connection.send(data_with_user);
    }
  },

  is_new_message: function(data) {
    var messageIds = $.map(this.messages, function(m) { return m._id['$oid']} );
    if ($.inArray(data._id['$oid'], messageIds) > -1) {
      return false;
    } else {
      this.messages.push(data);
      return true;
    }
  },

  process: function(data, historical) {
    if (historical || this.is_new_message(data)) {
      $.each((this.handlers[data.type] || []).concat(this.globalHandlers), function(i, handler) {
        try {
          handler.process(data, historical);
        } catch(err) {
          console.log("Error handling message", err, data);
        }
      });
    } else {
      console.log("ignoring message");
    }
    this.resizePanels();
  },

  addHistoryLink: function(type, panel) {
    var self = this;

    var listElement = $.li("", {"class":"history_link"});
    var link = $.a("view earlier messages",{href:"#"});
    link.click(function() {
      var earliest_timestamp = $("."+ type + " time").first().attr("title");
      self.connection.loadHistory(self.stream_name, type, earliest_timestamp, function(messages) {
        $($.makeArray(messages).reverse()).each(function(index, message) {
          self.process(message, true);
        });
        $(".history_link", panel).remove();
        self.addHistoryLink(type, panel);
      });
      return false;
    });
    listElement.append(link);

    $(panel).prepend(listElement);
  },

  loadMessages: function(type) {
    var self = this;
    this.connection.loadMessages(this.stream_name, type, function(messages) {
      $(messages).each(function(index, message) {
        self.process(message);
      })
    });
  },

  loadStreams: function(callback) {
    this.connection.loadStreams(this.stream_name, callback);
  },

  addHandler: function(handler) {
    if (handler.respondTo == Base.allMessages) {
      this.globalHandlers.push(handler);
    } else {
      var self = this;
      $.each(handler.respondTo, function(i, type) {
        if (self.handlers[type] == null) {
          self.handlers[type] = [handler];
        } else {
          self.handlers[type].push(handler);
        }
      });
    }
  },

  display_error: function(message) {
    $('#chat').text("ERROR: " + message);
  },

  streamNameFromUrl: function() {
    return $(document.location.pathname.split("/")).last()[0];
  },

  connect: function() {
    this.connection.create(this.stream_name);
    test_connecting = setInterval('PissWhistle.connection.ensureReadyStateReached()', 1000);
    // for now poll, perhaps require elegant notification of restart from websocket server?
    setTimeout('PissWhistle.check_and_reconnect()',10000);
  },

  check_and_reconnect: function() {
    if (!this.connection.is_connected()) {
      console.log("reconnecting...");
      this.connect();
      return true;
    }
    else {
      setTimeout('PissWhistle.check_and_reconnect()',10000);
      return false;
    }
  },

  connection: {
    stream_host: window.location.hostname,
    stream_port: 5032,
    // stream_host: 'pisswhistle.gofreerange.com', // override, useful for debugging
    oauth: {
      token: $.cookie('oauth_token'),
      client_identifier: "K7U2x3qk8VuMtySA",
      client_secret: "A8FrX7wO1uDrNZ4op1sQ4UVKIfafiIuP"
    },
    latestHeartbeat: null,
    acceptableLag: 10,

    create: function(stream_name) {
      var self = this;
      if (self.socket) {
        self.socket.close();
        self.socket = null;
      }
      this.ensureAuthenticated(function(token) {
        self.socket = new WebSocket('ws://'+self.stream_host+':' + self.stream_port + '/' + stream_name + '/client?oauth_token=' + token);
        self.socket.onopen = self.onopen;
        self.socket.onmessage = self.onmessage;
        self.socket.onclose = self.onclose;
        self.socket.onerror = self.onerror;
      })
    },

    onopen: function(m){
      document.title = "PissWhistle"
      console.log("Connection opened");
    },

    onerror: function(m) {
      console.log("Websocket Error", m);
    },

    send: function(object){
      if (this.socket) {
        var result = this.socket.send(JSON.stringify(object))
        console.log("result of sending", result);
      }
    },

    onmessage: function(m) {
      if (m.data) {
        var data = JSON.parse(m.data);
        if (data["error"]) {
          clearInterval(test_connecting);
          console.log(data["error"]);
        } else if (data["heartbeat"]) {
          PissWhistle.connection.updateHeartbeat(data["heartbeat"]);
        } else {
          PissWhistle.process(data);
        }
      }
    },

    updateHeartbeat: function(timestamp) {
      this.latestHeartbeat = timestamp;
    },

    onclose: function(m) {
      console.log("connection closed")
      this.socket=null;
    },

    ensureReadyStateReached: function() {
      // testing http://dev.w3.org/html5/websockets/#dom-websocket-readystate
      if (this.socket.readyState != 1) {
        // NOTE: If this is 0 it could stay in connecting for a while, would this affect the browser's performance.
        // console.log(this.socket.readyState);
        console.log("ERROR: Can't connect to backend for some reason....")
        document.title = "PissWhistle (not connected)"
      }
      clearInterval(test_connecting);
    },

    is_connected: function() {
      var now = new Date().getTime()/1000;
      var x = this.latestHeartbeat + this.acceptableLag;
      console.log("latest heartbeat", this.latestHeartbeat);
      console.log("acceptable lag", this.acceptableLag);
      console.log("comparing", x, now);
      return x > now;
    },

    loadMessages: function(stream_name, type, callback) {
      var self = this;
      this.ensureAuthenticated(function(token) {
        $.getJSON('http://'+self.stream_host+':' + self.stream_port+'/' + stream_name + '/messages', {type: type, oauth_token: token}, callback);
      })
    },

    loadHistory: function(stream_name, type, earliest_timestamp, callback) {
      var self = this;
      this.ensureAuthenticated(function(token) {
        $.getJSON('http://'+self.stream_host+':' + self.stream_port+'/' + stream_name + '/messages', {type: type, since:earliest_timestamp, oauth_token: token}, callback);
      })
    },

    loadStreams: function(stream_name, callback) {
      var self = this;
      this.ensureAuthenticated(function(token) {
        $.ajax({
          url: 'http://'+self.stream_host+':' + self.stream_port+'/streams?oauth_token=' + token,
          dataType: 'json',
          success: callback
        })
      })
    },

    authenticated: function() {
      return (this.oauth.token != null);
    },

    ensureAuthenticated: function(callback) {
      if (this.authenticated()) {
        console.log("already authenticated");
        callback(this.oauth.token);
      } else {
        this.getAuthenticated(callback);
      }
    },

    getAuthenticated: function(callback) {
      var match = window.location.search.match("code=(.*)")
      if (match) {
        authorization_code = match[1];
        this.getAccessCode(authorization_code, callback);
      } else {
        this.getAuthorizationCode();
      }
    },

    getAuthorizationCode: function() {
      console.log("getting authorization code");
      current_location = window.location
      window.location = 'http://'+this.stream_host+':' + this.stream_port+'/oauth/authorize?client_id=' + this.oauth.client_identifier + '&redirect_uri=' + current_location;
    },

    getAccessCode: function(authorizationCode, callback) { 
      console.log("getting access token");
      var self = this;
      $.post('http://'+this.stream_host+':' + this.stream_port+'/oauth/access_token', {
        client_id: self.oauth.client_identifier,
        redirect_uri: window.location.href.split("?")[0],
        client_secret: self.oauth.client_secret,
        grant_type: "authorization_code",
        code: authorization_code
      }, function(data) {
        self.oauth.token = data.access_token;
        $.cookie('oauth_token', self.oauth.token, {expires: 365});
        window.history.pushState(null, "without code", window.location.pathname);
        callback(self.oauth.token);
      }, "json")
    }
  }
}
