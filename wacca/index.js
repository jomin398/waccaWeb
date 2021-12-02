const waccaModule = (function () {
    function wacca() {
        this.main = {
            root: null,
            //outer : 0, inner-base(inner bg) : 1, inner-chr (or song screen):2, inner-score:3 inner-btns:4; 
            displays: []
        }
    }
    const psToRad = function(ps){
        return ps /100*360*Math.PI/180;
    };
    const degToRad = function (degrees) {
        return (degrees * (Math.PI / 180) - Math.PI / 2);
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
    wacca.prototype.drawCircle = function (tEle, size, deg = [0, 0], color, cw = false,stroke) {
        const canvas = tEle;
        const ctx = canvas.getContext("2d");
        const x = Math.floor(canvas.width / 2);
        const y = Math.floor(canvas.height / 2);
        const _size = Math.min(x, y) * size;
        
        ctx.save();
        ctx.beginPath();
        // ctx.moveTo(x, y);
        ctx.arc(x, y, _size, degToRad(deg ? deg[0] : 0), degToRad(deg ? deg[1] : 0), cw,stroke);
        // ctx.closePath();
        if(!stroke){
            ctx.fillStyle = color ? color : 'black';
            ctx.fill();
        }else if(stroke){
            ctx.lineWidth = stroke.lw?stroke.lw:'5';
            ctx.strokeStyle = color ? color : 'black';
            ctx.stroke();
        }
        ctx.restore();
    }
    wacca.prototype.init = function () {
        this.main.root = document.querySelector('body div.main');
        let l = ['.outer','.bg','.display','.gph','.score','.btns'];
        for(i in l){
            this.main.displays.push(this.main.root.querySelector(l[i]));
        }
        this.drawCircle(this.main.displays[0], 1, [0, 360]);
        _p = document.createElement('p');
        _p.innerText = 'initializing...';
        this.main.displays[2].appendChild(_p);
        this.drawCircle(this.main.displays[3], 0.961, [0, 10],'#7cfc00',false,{lw:'15'});
        console.log(psToRad(80))
    }
    return wacca;
})();