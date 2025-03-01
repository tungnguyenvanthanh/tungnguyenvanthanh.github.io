export let BookingWeeklyCalendar = function () {
    let render = (weekContainer, weekHeader, weekData, dotNetHelper) => {
        weekContainer.innerHTML = "";
        weekHeader.innerHTML = "";

        weekData.forEach((day, index) => {
            let weekdayDiv = document.createElement("div");
            weekdayDiv.classList.add("day");
            weekdayDiv.innerHTML = `<span class="weekday">${day.weekday}</span>`;
            weekHeader.appendChild(weekdayDiv);

            let dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            if (day.isToday) {
                dayDiv.classList.add("today");
            }
            if (day.isSelected) {
                dayDiv.classList.add("selected");
            }

            const date = new Date(day.dayText);
            const formattedDate = `${date.getFullYear() }-${date.getMonth() + 1}-${date.getDate() }`;

            dayDiv.innerHTML = `<span class="weekday">${date.getDate()}</span>`;
            dayDiv.onclick = () => dotNetHelper.invokeMethodAsync('OnSelectedDate', formattedDate);
            weekContainer.appendChild(dayDiv);
        });
    }

    return {
        render: (weekContainer, weekHeader, weekData, dotNetHelper) => {
            render(weekContainer, weekHeader, weekData, dotNetHelper);
        }
    };
}();