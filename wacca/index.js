const waccaModule = (function() {
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
  const psToRad = function(ps) {
    return ps / 100 * 360;
  };
  const degToRad = function(degrees) {
    return (degrees * (Math.PI / 180) - Math.PI / 2);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function ucFirst(str) {
    return str.replace(/^[a-z]/, function(m) { return m.toUpperCase() });
  }
  const tM = new touchModule();
  const getStatusMsg = (code) => {
    switch (code) {
      case 0:
        code = 'initializing...';
        break;
      case 1:
        code = 'Waiting';
        break;
      case 2:
        code = 'Success!';
        break;
      default:
        break;
    }
    return code;
  };

  const mkm = (msg, bool) => {
    mConsole.l(msg ? msg : '', '%c%s', bool ? 'color:#7cfc00;' : 'color:#e80000', bool ? 'done.' : 'faild.');
  };

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
  wacca.prototype.drawPbar = function(tele, ps, color, lw) {
    ps = ps ? ps : 0;
    color = color ? color : '#7cfc00'; //lime color
    lw = lw ? lw : 10;

    this.drawCircle(tele, 0.975, [0, psToRad(ps)], color, false, { lw: lw });
  };
  wacca.prototype.genTouchArea = tM.genTouchArea;
  wacca.prototype.addTouchEvent = tM.appendEvent;
  wacca.prototype.initCheck = async function() {


    // mConsole.l('log init...', '%c%s', 'color:#7cfc00;', 'done.');

    await sleep(1000);
    mConsole.setUpdate(false);
    mConsole.l('begin checking...');
    this.main.displays[2].querySelector('.warnWrap').style.display = 'block';
    l = ['console', 'touch', 'network'];
    this.main.status.console = 2;
    timer = null;
    let loadDone = false;
    for (i in l) {

      let t = ucFirst(l[i]);

      let p = 5;
      mConsole.l(t, ' check...');
      await sleep(2000);
      this.main.displays[6].querySelector('.' + l[i]).innerText = t + ' : ' + getStatusMsg(this.main.status[l[i]]);
      if (i == 0) {
        this.drawPbar(this.main.displays[3], p);
      } else {
        this.drawPbar(this.main.displays[3], p += 2);
      }
    }
    mConsole.deb(false);

    timer = setInterval(() => {
      if (!loadDone) {
        mConsole.l(getStatusMsg(0) + '...');
        setTimeout(() => {
          mConsole.l('initializing');
        }, 1000)
        setTimeout(() => {
          mConsole.l('initializing...');
        }, 2000)
      } else {
        clearTimeout(timer);
      }
    }, 3000);
    //close warn after 2s.
    (() => {
      setTimeout(() => {
        this.main.displays[2].querySelector('.warnWrap').classList.add('cl');
        setTimeout(() => {
          this.main.displays[2].querySelector('.warnWrap.cl').style.display = 'none';
        }, 1000)
      }, 2000)
    })();


  };
  wacca.prototype.btnTouchHandler = function(a, b) {
    if (a) {
      console.log('clicked:', a)
    }
    if (b) {
      // console.log('move to:', b)
    }
  }
  wacca.prototype.init = async function() {
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

    let debugDisplay = this.main.displays[6]; //display.querySelector('.debugDispWrapper');
    (() => {

      debugDisplay = debugDisplay ? debugDisplay : document.createElement('div');
      debugDisplay.className = 'debugDispWrapper';
      let l = ['mConsole', 'console', 'touch', 'network'];
      for (i in l) {
        e = document.createElement('div');
        e.className = l[i];
        if (i != 0) {
          e.innerText = ucFirst(l[i]) + ' : ' + getStatusMsg(0);
        }
        debugDisplay.appendChild(e);
      };
      display.appendChild(debugDisplay);
      this.main.displays.push(debugDisplay);
      mkm('log init...', true);
      this.drawPbar(this.main.displays[3], 2);
    })();

    this.addTouchEvent(this.btnTouchHandler, () => {
      this.main.status.touch = 2;
    });

    this.initCheck();
  }
  return wacca;
})();