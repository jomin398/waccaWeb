/**
 * @classdesc touch Module.
 * @class
 * @hideconstructor
 */
const touchModule = (function() {
  function touch() {}
  /**
   * @alias genTouchArea
   * @memberof touchModule
   * @param {number} r Radius
   * @param {number} p padding
   * @param {number} slices circle slices
   * @param {number} lw line stroke width
   * @param {number} hm result height config
   * @param {number} wm result width config
   * @returns {string} svg string.
   */
  touch.prototype.genTouchArea = function(r, p, slices, lw, hm, wm) {
    var innerRadius = r - lw;
    var style = [
            '<style>',
            '@keyframes opacity { ',
            '0% {opacity: 0} ',
            '100% {opacity: 1} ',
            '}',
            ' path{ ',
            'animation: 2s opacity ease-in',
            '} ',
            '@keyframes opacity { ',
            '0% {opacity: 0} ',
            '100% {opacity: 1} ',
            '}',
            '</style>'
        ].join('');
    var svg = "";

    for (var i = 0; i < slices; i++) {

      var p1 = {
        x: Math.cos(Math.PI * 2 / slices * i) * r + r + p,
        y: Math.sin(Math.PI * 2 / slices * i) * r + r + p
      };

      var p2 = {
        x: Math.cos(Math.PI * 2 / slices * (i + 1)) * r + r + p,
        y: Math.sin(Math.PI * 2 / slices * (i + 1)) * r + r + p
      };

      var p4 = {
        x: Math.cos(Math.PI * 2 / slices * i) * innerRadius + r + p,
        y: Math.sin(Math.PI * 2 / slices * i) * innerRadius + r + p
      };

      var p3 = {
        x: Math.cos(Math.PI * 2 / slices * (i + 1)) * innerRadius + r + p,
        y: Math.sin(Math.PI * 2 / slices * (i + 1)) * innerRadius + r + p
      };
      svg += [
                "<path d='M ",
                p1.x + " " + p1.y + " A " + r + " " + r + " 0 0 1 ",
                p2.x + " " + p2.y + " L ",
                p3.x + " " + p3.y + " A ",
                innerRadius + " " + innerRadius + " 0 0 0 ",
                p4.x + " " + p4.y + " z",
                "' fill='green' stroke='black' class='key' ",
                "id='" + i,
                "'/>"
            ].join('');
    };

    svg = [
            "<svg height='",
            (r * 2 + p * 2) - (hm ? hm : 0),
            "px' width='",
            (r * 2 + p * 2) - (wm ? wm : 0),
            "px'>" + style + svg,
            "</svg>"
        ].join('');
    return svg;
  };
  touch.prototype.appendEvent = function(cbf, finCbf) {
    var keys = [].slice.call(document.querySelectorAll('.touchArea .key'), 0);
    var keyboard = document.querySelector('.touchArea');
    var touches = [];
    var db = {
      tst: null,
      ted: null,
      move: []
    };

    function isKey(key) {
      return keys.indexOf(key) >= 0;
    }

    function updateKeys() {
      keys.forEach(function(key) {
        key.classList.remove("down");
      });
      touches.forEach(function(touch) {
        if (isKey(touch.key))
          touch.key.classList.add("down");
      });
    }

    function getTouchIndex(id) {
      for (var i = 0; i < touches.length; i++) {
        if (touches[i].id === id) {
          return i;
        }
      }
      return -1;
    }

    function touchStart(evt) {
      evt.preventDefault();
      var changedTouches = evt.changedTouches;
      for (var i = 0; i < changedTouches.length; i++) {
        var key = changedTouches[i].target;
        var data = { id: changedTouches[i].identifier, key: key };
        if (isKey(key)) {
          touches.push(data);
          db.tst = data;
          if (cbf) {
            cbf(key.id);
          }
        }
      }
      updateKeys();
    }

    function touchEnd(evt) {
      evt.preventDefault();
      var changedTouches = evt.changedTouches;
      for (var i = 0; i < changedTouches.length; i++) {
        var key = changedTouches[i].target;
        var index = getTouchIndex(changedTouches[i].identifier);
        if (index >= 0) {
          if (isKey(key)) {
            if (cbf) {
              cbf(null, Array.from(new Set(db.move)));
            } else {
              console.log('tend:', db.tst.key.id);
            }
          }
          touches.splice(index, 1);
        }
      }
      updateKeys();
      touches = [];
      db.tst = null;
      db.move = [];
    }

    function touchMove(evt) {
      evt.preventDefault();
      var changedTouches = evt.changedTouches;
      for (var i = 0; i < changedTouches.length; i++) {
        var touch = changedTouches[i];
        var index = getTouchIndex(touch.identifier);
        if (index >= 0) {
          var key = document.elementFromPoint(touch.pageX, touch.pageY);
          if (isKey(key)) {
            touches[index].key = key;
            db.move.push(key.id);
            if (cbf) {
              cbf(key.id);
            } else {
              console.log('tck at:', key.id);
            }
          }
        }
      }
      updateKeys();
    }

    keyboard.addEventListener("touchstart", touchStart, false);
    keyboard.addEventListener("touchmove", touchMove, false);
    keyboard.addEventListener("touchend", touchEnd, false);
    if (finCbf) {
      finCbf();
    }
  };

  return touch;
})();