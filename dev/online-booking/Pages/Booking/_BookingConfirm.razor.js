export let BookingConfirm = function () {
    let loadPayPalScript = (paypalClientKey, dotNetHelper) => {
        if (document.getElementById("paypal-sdk")) {
            // Nếu SDK đã load thì không load lại
            if (paypal) {
                dotNetHelper.invokeMethodAsync("OnHandlePaymentInitAsync");
                return;
            }
        }

        let script = document.createElement("script");
        script.id = "paypal-sdk";
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientKey}&currency=USD`;
        script.onload = () => {
            console.log("PayPal SDK loaded.");
            dotNetHelper.invokeMethodAsync("OnHandlePaymentInitAsync");
        };

        document.body.appendChild(script);
    }

    let payment = (amount, dotNetHelper) => {
        if (!paypal) {
            console.error("PayPal SDK not loaded!");
            return;
        }

        let container = document.getElementById("paypal-button-container");

        if (!container) {
            return;
        }

        paypal.Buttons({
            createOrder: (data, actions) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: { value: amount }
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    dotNetHelper.invokeMethodAsync("OnHandlePaymentSuccessAsync", details);
                });
            }
        }).render('#paypal-button-container');
    }

    return {
        loadPayPalScript: (paypalClientKey, dotNetHelper) => {
            loadPayPalScript(paypalClientKey, dotNetHelper);
        },
        payment: (amount, dotNetHelper) => {
            payment(amount, dotNetHelper);
        }
    };
}();