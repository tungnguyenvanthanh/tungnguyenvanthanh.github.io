export let CoCaro = function () {
    let draggableWithConstraints = (element, container) => {
        if (!element || !container) {
            console.error("Draggable element or container is not defined.");
            return;
        }

        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        element.addEventListener("mousedown", function (event) {
            isDragging = true;
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;
        });

        document.addEventListener("mousemove", function (event) {
            if (!isDragging) return;

            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();

            // Tính toán vị trí mới
            let newLeft = event.clientX - containerRect.left - offsetX;
            let newTop = event.clientY - containerRect.top - offsetY;

            // Tính toán giới hạn
            const minLeft = -(elementRect.width - 50); // Đảm bảo 50px vẫn hiển thị bên trái
            const minTop = -(elementRect.height - 50); // Đảm bảo 50px vẫn hiển thị bên trên
            const maxLeft = containerRect.width - 100; // Đảm bảo không vượt quá biên phải
            const maxTop = containerRect.height - 100; // Đảm bảo không vượt quá biên dưới

            // Áp dụng giới hạn
            if (newLeft < minLeft) newLeft = minLeft;
            if (newTop < minTop) newTop = minTop;
            if (newLeft > maxLeft) newLeft = maxLeft;
            if (newTop > maxTop) newTop = maxTop;

            // Cập nhật vị trí phần tử
            element.style.left = newLeft + "px";
            element.style.top = newTop + "px";
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });
    }

    return {
        draggable: (element, container) => {
            draggableWithConstraints(element, container);
        }
    };
}();