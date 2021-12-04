/**
 * @classdesc touch Module.
 * @class
 * @hideconstructor
 */
const touchModule = (function () {
    function touch() { }
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
    touch.prototype.genTouchArea = function (r, p, slices, lw, hm, wm) {
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
            "px'>" +style+ svg,
            "</svg>"
        ].join('');
        return svg;
    }
    return touch;
})();