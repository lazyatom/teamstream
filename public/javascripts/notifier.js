var Notifier = {
  initialize: function() {
    if (Notifier.hasSupport()) {
      Notifier.checkPermissionGranted();
    }
  },
  hasSupport: function() {
    if (window.webkitNotifications) {
      return true;
    } else {
      return false;
    }
  },
  askToAllowNotifications: function() {
    window.webkitNotifications.requestPermission(Notifier.checkPermissionGranted);
  },
  checkPermissionGranted: function() {
    if (window.webkitNotifications.checkPermission() == 0) {
      $("#notifications").text("| on");
      PissWhistle.addHandler(new DesktopNotifications());
    }
    else {
      $("#notifications").text("| off");
      $("#notifications").click(function() {
        Notifier.askToAllowNotifications();
        return false;
      });
    }
  },
  notify: function(title, body) {
    var popup = window.webkitNotifications.createNotification(
        "http://" +  window.location.hostname + "/favicon.ico", title, body
    );
    popup.show();
    setTimeout(function() {
      popup.cancel();
    },4000);
  }
}
