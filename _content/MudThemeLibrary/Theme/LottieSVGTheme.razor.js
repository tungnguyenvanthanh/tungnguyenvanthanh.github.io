export let LottieSVG = function () {
    let init = (el, jsonUrl, loop, speed) => {
        if (el === null) {
            return;
        }

        el.innerHTML = "";

        try {
            var animate = lottie.loadAnimation({
                container: el,
                renderer: 'svg',
                loop: loop,
                autoplay: true,
                path: jsonUrl
            });

            animate.setSpeed(speed);
        } catch (e) {
            setTimeout(() => {
                init(el, jsonUrl, loop, speed);
            }, 2000)
        }
    }

    return {
        init: (el, jsonUrl, loop, speed) => {
            init(el, jsonUrl, loop, speed);
        }
    };
}();