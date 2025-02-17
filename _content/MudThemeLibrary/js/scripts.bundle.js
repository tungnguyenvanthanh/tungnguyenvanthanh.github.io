function loadScript(url, location) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false; // Đảm bảo tải theo thứ tự
        script.onload = () => resolve(url);
        script.onerror = () => reject(new Error(`Failed to load ${url}`));

        switch (location) {
            case "head":
                document.head.appendChild(script);
                break;
            case "body":
                document.body.appendChild(script);
                break;
            default:
                break;
        }
    });
}

function loadCSS(url, location) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve(url);
        link.onerror = () => reject(new Error(`Failed to load ${url}`));

        switch (location) {
            case "before":
                document.head.insertBefore(link, document.head.firstChild);
                break;
            case "after":
                document.head.appendChild(link);
                break;
            default:
                break;
        }
    });
}

// Danh sách file JS cần tải
const scriptsToLoadHead = [
    "_content/MudThemeLibrary/js/jquery/jquery-3.7.1.js",
    "_content/MudThemeLibrary/js/jquery/jquery-ui.js",
];

const scriptsToLoadBody = [
    "_content/MudBlazor/MudBlazor.min.js",
    "_content/CurrieTechnologies.Razor.SweetAlert2/sweetAlert2.min.js",
    "_content/MudThemeLibrary/plugins/lottie/lottie.min.js",
    "_content/MudThemeLibrary/plugins/cropperjs/cropper.js",
];

const stylesToLoad = [
    "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
    "https://use.fontawesome.com/releases/v5.14.0/css/all.css",
    "_content/MudBlazor/MudBlazor.min.css",
    "_content/MudThemeLibrary/plugins/cropperjs/cropper.css",
    "_content/MudThemeLibrary/css/app.css",
    "_content/MudThemeLibrary/css/spacing.css",
];

// Tải các file CSS theo thứ tự
(async function () {
    for (let style of stylesToLoad.reverse()) { // reverse() đảo ngược mảng stylesToLoad
        await loadCSS(style, "before");
        console.log(`${style} loaded`);
    }
})();

// Tải các file theo thứ tự
(async function () {
    for (let script of scriptsToLoadHead) {
        await loadScript(script, "head");
        console.log(`${script} loaded`);
    }
    for (let script of scriptsToLoadBody) {
        await loadScript(script, "body");
        console.log(`${script} loaded`);
    }
})();
