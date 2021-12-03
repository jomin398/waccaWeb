const waccaModule = (function() {
  function wacca() {
    this.main = {
      root: null,
      //outer : 0, inner-base(inner bg) : 1, inner-chr (or song screen):2, inner-score:3 inner-btns:4; 
      displays: []
    }
  }
  const psToRad = function(ps) {
    return ps / 100 * 360;
  };
  const degToRad = function(degrees) {
    return (degrees * (Math.PI / 180) - Math.PI / 2);
  };
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
   * 
   * @param {HTMLElement} tEle 
   * @param {number} size float number; 1 =100; 
   * @param {array} deg degress array 
   * @param {string} color color string|hex vaule;
   * @param {boolean} cw draw counterClockwize?
   * @param {Object} stroke stroke option obj.
   * @param {string} stroke.lw line width.
   */
  wacca.prototype.drawCircle = function(tEle, size, deg = [0, 0], color, cw = false, stroke) {
    const canvas = tEle;
    const ctx = canvas.getContext("2d");
    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);
    const _size = Math.min(x, y) * size;

    ctx.save();
    ctx.beginPath();
    // ctx.moveTo(x, y);
    ctx.arc(x, y, _size, degToRad(deg ? deg[0] : 0), degToRad(deg ? deg[1] : 0), cw, stroke);
    // ctx.closePath();
    if (!stroke) {
      ctx.fillStyle = color ? color : 'black';
      ctx.fill();
    } else if (stroke) {
      ctx.lineWidth = stroke.lw ? stroke.lw : '5';
      ctx.strokeStyle = color ? color : 'black';
      ctx.stroke();
    }
    ctx.restore();
  }
  /**
   * 
   * @param {number} ps percentage
   * @param {string} color color string or hex vaule  
   * @param {*} lw linewidth 
   */
  wacca.prototype.drawPbar = (ps, color, lw) => {
    ps = ps ? ps : 0;
    color = color ? color : '#7cfc00'; //lime color
    lw = lw ? lw : 15;

    this.drawCircle(this.main.displays[3], 0.961, [0, psToRad(ps)], color, false, { lw: lw });
  }
  wacca.prototype.initCheck = async function(){
        (() => {
          const debugDisplay = document.createElement('div');
          debugDisplay.className = 'debugDispWrapper';
          l = ['mConsole','console','netWork'];
          for (i in l){
            e = document.createElement('div');
            e.className = l[i];
            debugDisplay.appendChild(e);
          }
          debugDisplay.querySelector('.console').innerText = 'Wacca Console : Success!';
          debugDisplay.querySelector('.netWork').innerText = 'Network : initializing...';
          this.main.displays[2].querySelector('.display').appendChild(debugDisplay);
        })();
        
        mConsole.l('log init...', '%c%s', 'color:green', 'done.');
        this.drawPbar()
        await sleep(1000);
        mConsole.update = false;
        mConsole.l('begin checking...');
        
       
  };
  wacca.prototype.init = async function() {
    this.main.root = document.querySelector('body div.main');
    let l = ['.outer', '.bg', '.displayWrap', '.gph', '.score', '.btns'];
    for (i in l) {
      this.main.displays.push(this.main.root.querySelector(l[i]));
    }
    this.drawCircle(this.main.displays[0], 1, [0, 360]);
    const display = document.createElement('div');
    display.className = 'display';
    this.main.displays[2].appendChild(display);
    
    this.initCheck();
  }
  return wacca;
})();