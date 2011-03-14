$.element = function(element, content, options) {
  attributes = [];

  if (typeof(options) == "string") {
    var m;
    var o;

    if (m = options.match(/(\.)([-\w]+)/)) {
      o = { 'class' : m[2] }
    } else if (m = options.match(/(\#)([-\w]+)/)) {
      o = { 'id' : m[2] }
    };

    options = o;
  }

  for(key in options) {
    attributes.push(key + '="'+ options[key] +'"')
  }

  var el = $('<' + element + ' ' + attributes.join(" ") + " />");
  el.text(content);
  return el;
}

$(["div", "span", "ul", "ol", "li", "a", "p", "time"]).each(function () {
  var element = this;
  $[element] = function() {
    return $.element(element, arguments[0], arguments[1]);
  }
});

$.fn.resizePanel = function() {
  var panel = this;
  var fixedSiblings = $(panel).siblings(".fixed");
  var reductionInHeight = 0;
  $.each(fixedSiblings, function(i, sibling) {
    reductionInHeight = reductionInHeight + $(sibling).height();
  })
  var parent = $(panel).parent();
  $(panel).height($(parent).height() - reductionInHeight);
}

$.fn.scrollToBottom = function() {
  var panel = this;
  var endPos = panel[0].scrollHeight - panel[0].clientHeight;
  panel[0].scrollTop = endPos;
}

$.fn.prependAndShow = function(message) {
  var container = this;
  container.prepend(message);
}

$.fn.autolink = function () {
  return this.each( function(){
    var html = linkify($(this).html(), { callback: function(text, href) {
      return href ? '<a href="' + href + '" title="' + href + '" target="_blank">' + text + '</a>' : text;
    }});
    $(this).html(html);
  });
}
