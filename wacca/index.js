const waccaModule = (function () {
  function wacca() {
    this.main = {
      root: null,
      //outer : 0, inner-base(inner bg) : 1, inner-chr (or song screen):2, inner-score:3 inner-btns:4; 
      displays: [],
      status: {
        console: 0,
        touch: 0,
        network: 0
      }
    }
  }
  const psToRad = function (ps) {
    return ps / 100 * 360;
  };
  const degToRad = function (degrees) {
    return (degrees * (Math.PI / 180) - Math.PI / 2);
  };
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const tM = new touchModule()
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
  wacca.prototype.drawCircle = function (tEle, size, deg = [0, 0], color, cw = false, stroke) {
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
  wacca.prototype.drawPbar = function (tele, ps, color, lw) {
    ps = ps ? ps : 0;
    color = color ? color : '#7cfc00'; //lime color
    lw = lw ? lw : 10;

    this.drawCircle(tele, 0.975, [0, psToRad(ps)], color, false, { lw: lw });
  };
  wacca.prototype.genTouchArea = tM.genTouchArea;
  wacca.prototype.addTouchEvent = tM.appendEvent;
  wacca.prototype.initCheck = async function () {
    (() => {
      const debugDisplay = document.createElement('div');
      debugDisplay.className = 'debugDispWrapper';
      l = ['mConsole', 'console', 'touch', 'netWork'];
      for (i in l) {
        e = document.createElement('div');
        e.className = l[i];
        debugDisplay.appendChild(e);
      };
      getStatusMsg = (code) => {
        switch (code) {
          case 0:
            code = 'initializing...';
            break;
          case 1:
            code = 'Success!';
            break;
          default:
            break;
        }
        return code;
      }
      this.main.status.console = 1;
      debugDisplay.querySelector('.console').innerText = 'Console : ' + getStatusMsg(0);
      debugDisplay.querySelector('.touch').innerText = 'Touch : ' + getStatusMsg(0);
      debugDisplay.querySelector('.netWork').innerText = 'Network : ' + getStatusMsg(0);
      this.main.displays[2].querySelector('.display').appendChild(debugDisplay);
    })();
    const debugDisplay = this.main.displays[2].querySelector('.display .debugDispWrapper');
    mkm = (msg, bool) => {
      mConsole.l(msg ? msg : '', '%c%s', bool ? 'color:#7cfc00;' : 'color:#e80000', bool ? 'done.' : 'faild.');
    }
    mkm('log init...', true)
    // mConsole.l('log init...', '%c%s', 'color:#7cfc00;', 'done.');
    this.drawPbar(this.main.displays[3], 2);
    await sleep(1000);
    mConsole.update = false;
    mConsole.l('begin checking...');
    mConsole.l('Console check...');
    await sleep(1000);
    this.main.status.console = 1;
    mkm('Console check...', this.main.status.console != 0)
    debugDisplay.querySelector('.console').innerText = 'Console : ' + getStatusMsg(this.main.status.console);
    this.drawPbar(this.main.displays[3], 5);
    await sleep(2000);
    mConsole.l('Touch check...');
    await sleep(1000);
    mkm('Touch cheack...', this.main.status.touch != 0)
    debugDisplay.querySelector('.touch').innerText = 'Touch : ' + getStatusMsg(this.main.status.touch);
    debugDisplay.querySelector('.netWork').innerText = 'Network : ' + getStatusMsg(this.main.status.network);
    this.drawPbar(this.main.displays[3], 8);
    await sleep(1000);
    mConsole.l('NetWork check...');
    debugDisplay.querySelector('.netWork').innerText = 'Network : Waiting';
  };
  wacca.prototype.btnTouchHandler = function (a, b) {
    if (a) {
      console.log('clicked:', a)
    }
    if (b) {
      // console.log('move to:', b)
    }
  }
  wacca.prototype.init = async function () {
    this.main.root = document.querySelector('body div.main');
    let l = ['.outer', '.bg', '.displayWrap', '.gph', '.score', '.touchArea'];
    for (i in l) {
      this.main.displays.push(document.querySelector(l[i]));
    }
    this.drawCircle(this.main.displays[0], 1, [0, 360]);
    const display = document.createElement('div');
    display.className = 'display';
    this.main.displays[2].appendChild(display);
    this.main.displays[5].innerHTML = this.genTouchArea(180, 10, 12, 30, 4);
    this.addTouchEvent(this.btnTouchHandler, () => {
      this.main.status.touch = 1;
    });
    this.initCheck();
  }
  return wacca;
})();