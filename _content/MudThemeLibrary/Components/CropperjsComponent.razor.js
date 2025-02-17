export let Cropperjs = function () {
    let dynamicCss = (href) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve(); // Nếu CSS đã được load thì không load lại
                return;
            }

            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => reject(`Failed to load CSS: ${href}`);

            document.head.appendChild(link);
        });
    }

    let init = (imageRef) => {
        let cropper = new Cropper(imageRef, {
            aspectRatio: 1,
            viewMode: 0,
        });

        return cropper;
    }

    let croppedCanvas = (cropper) => {
        let result = cropper["getCroppedCanvas"]();
        if (result instanceof HTMLCanvasElement) {
            return result.toDataURL("image/jpeg");
        }
    }

    let rotate = (cropper, option) => {
        cropper["rotate"](option, undefined);
        return cropper;
    }

    let scaleX = (cropper, option) => {
        cropper["scaleX"](option, undefined);
        return cropper;
    }

    let scaleY = (cropper, option) => {
        cropper["scaleY"](option, undefined);
        return cropper;
    }

    return {
        dynamicCss: (href) => {
            dynamicCss(href);
        },

        init: (imageRef) => {
            return init(imageRef);
        },

        croppedCanvas: (cropper) => {
            return croppedCanvas(cropper);
        },

        rotate: (cropper, option) => {
            return rotate(cropper, option);
        },

        scaleX: (cropper, option) => {
            return scaleX(cropper, option);
        },

        scaleY: (cropper, option) => {
            return scaleY(cropper, option);
        }
    };
}();