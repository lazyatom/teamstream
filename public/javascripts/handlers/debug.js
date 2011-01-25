var Debug = function Debug() {}

Debug.prototype = new Base;
Debug.prototype.constructor = Debug;

$.extend(Debug.prototype, {
  respondTo: Base.allMessages,

  process: function(data) {
    console.log(data);
  }
})