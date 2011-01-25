HeHeHe = function() {};

HeHeHe.prototype = {
  respondTo: ['chat'],
  process: function(data) {
    if (data.content.match(/cock/)) {
      var svgns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgns, 'svg'); // don't need to pass in 'true'
      svg.setAttribute('width', '120');
      svg.setAttribute('height', '150');
      
      var circle1 = document.createElementNS(svgns, 'circle');
      circle1.setAttributeNS(null, "cx","30");
      circle1.setAttribute("cy","120");
      circle1.setAttribute("fill","#d5a797");
      circle1.setAttribute("r","20");
      svg.appendChild(circle1);
      
      var circle2 = document.createElementNS(svgns, 'circle');
      circle2.setAttributeNS(null, "cx","90");
      circle2.setAttribute("cy","120");
      circle2.setAttribute("fill","#d5a797");
      circle2.setAttribute("r","20");
      svg.appendChild(circle2);
      
      var ellipse = document.createElementNS(svgns, 'ellipse');
      ellipse.setAttributeNS(null, "cx","60");
      ellipse.setAttribute("cy","70");
      ellipse.setAttribute("rx","20");
      ellipse.setAttribute("ry","60");
      ellipse.setAttribute("fill","#d5a797");
      ellipse.setAttribute("r","20");
      svg.appendChild(ellipse);
      
      var li = $.element('li', '', {'class': 'cock'});
      $('#chat').append(li);
      li.append(svg);
    }
  }
};

$(function() {
  PissWhistle.addHandler(new HeHeHe());
});