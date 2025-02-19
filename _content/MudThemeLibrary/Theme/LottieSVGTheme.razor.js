export let LottieSVG = function () {
    let init = (el, jsonUrl, loop, speed) => {
        if (el === null) {
            return;
        }

        el.innerHTML = "";
        var animate = lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: loop,
            autoplay: true,
            path: jsonUrl
        });

        animate.setSpeed(speed);
    }

    return {
        init: (el, jsonUrl, loop, speed) => {
            init(el, jsonUrl, loop, speed);
        }
    };
}();