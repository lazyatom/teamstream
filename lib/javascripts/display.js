var Display = {
  panels_scrolling: {},
  watch_scrolling: function() {
    $("ol.fluid").each(function(i, panel){
      $(panel).scroll(function() {
        panel = $(this);
        pos = panel[0].scrollTop - (panel[0].scrollHeight - panel[0].clientHeight);
        if (pos == 0) {
          Display.panels_scrolling[panel.attr("id")] = 0;
        } else {
          Display.panels_scrolling[panel.attr("id")] = 1;
        }
      })
    });
  },
  scrollPanelsToBottom: function() {
    $(".fluid").each(function(i, panel){
      $(panel).scrollToBottom();
    });
  }
}