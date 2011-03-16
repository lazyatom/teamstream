var Debug = function Debug() {}

$.extend(Debug.prototype, {
  respondTo: Base.allMessages,

  process: function(data) {
    console.log(data);
  }
})