module("Utilities autolink()");

test("should convert a URL into an HTML anchor tag", function() {
  span = $.span('http://www.example.com/');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'http://www.example.com/');
  equals(anchor.attr('target'), '_blank');
  equals(anchor.text(), 'http://www.example.com/');
});

test("should convert a URL with an HTTPS scheme into an HTML anchor tag", function() {
  span = $.span('https://www.secure.com/');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'https://www.secure.com/');
});

test("should convert a URL with an FTP scheme into an HTML anchor tag", function() {
  span = $.span('ftp://www.files.com/');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'ftp://www.files.com/');
});

test("should convert all URLs into HTML anchor tags", function() {
  span = $.span('http://www.example1.com/ http://www.example2.com/ http://www.example3.com/');
  span.autolink();
  anchors = span.children('a')
  equals(anchors.size(), 3);
});

test("should leave text surrounding URLs unchanged", function() {
  span = $.span('Lorem ipsum dolor sit amet http://www.example.com/ consectetur adipiscing elit');
  span.autolink();
  ok(new RegExp('^Lorem ipsum dolor sit amet <a').exec(span.html()));
  ok(new RegExp('\/a> consectetur adipiscing elit$').exec(span.html()));
});

test("should convert a URL with a path containing an '@' into an HTML anchor tag", function() {
  span = $.span('http://www.mail-archive.com/puppet-users@googlegroups.com/msg09156.htm');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'http://www.mail-archive.com/puppet-users@googlegroups.com/msg09156.htm');
});

test("should convert a URL with a query string containing an '@' into an HTML anchor tag", function() {
  span = $.span('http://example.com/?email=chris@seagul.co.uk');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'http://example.com/?email=chris@seagul.co.uk');
});

test("should convert a URL without a query string surrounded by parentheses into an HTML anchor tag", function() {
  span = $.span('(http://www.example.com/somepath/)');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'http://www.example.com/somepath/');
});

test("should convert a URL with a query string surrounded by parentheses into an HTML anchor tag", function() {
  span = $.span('(http://example.com/blah?query=1)');
  span.autolink();
  anchor = span.children('a').first();
  equals(anchor.attr('href'), 'http://example.com/blah?query=1');
});


module("Utilities iso8601()");

test("should convert a chat message datetime string to a string in iso8601 format", function() {
  equals('2011-01-02T10:11:12Z', $.iso8601("2011-01-02T10:11:12+00:00"))
});

test("should convert a datetime string with milliseconds to a string in iso8601 format", function() {
  equals('2011-01-02T10:11:12Z', $.iso8601("2011-01-02T10:11:12.345Z"))
});

test("should convert a github datetime string to a string in iso8601 format", function() {
  equals('2011-01-02T10:11:12Z', $.iso8601("2011/01/02 02:11:12 -0800"))
});


module("Utilities parseDate()");

test("should convert a chat message datetime string to a Date", function() {
  equals(new Date('2011/01/02 10:11:12').valueOf(), $.parseDate("2011-01-02T10:11:12+00:00").valueOf())
});

test("should convert a datetime string with milliseconds to a Date", function() {
  equals(new Date('2011/01/02 10:11:12').valueOf(), $.parseDate("2011-01-02T10:11:12.345Z").valueOf())
});

test("should convert a github datetime string to a Date", function() {
  equals(new Date('2011/01/02 10:11:12').valueOf(), $.parseDate("2011/01/02 02:11:12 -0800").valueOf())
});