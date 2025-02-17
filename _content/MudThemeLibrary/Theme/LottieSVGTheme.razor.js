export let LottieSVG = function () {
    let init = (el, jsonUrl, loop) => {
        if (el === null) {
            return;
        }

        el.innerHTML = "";
        lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: loop,
            autoplay: true,
            path: jsonUrl
        });
    }

    return {
        init: (el, jsonUrl, loop) => {
            init(el, jsonUrl, loop);
        }
    };
}();