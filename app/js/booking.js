//считываем базу записей
let getStorage = JSON.parse(readStorage());

//считывем дату, время и всё такое
const now = new Date();
let today = now.getDate()+1,
    year = now.getFullYear(),
    month = now.getMonth(),
    monthLength = 33 - new Date(now.getFullYear(), now.getMonth(), 33).getDate(),
    monthStartDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay(),
    pickedDay,
    storage = [],
    workingTimes = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

//выводим время
function scanBookingTimes(selectedDay) {
    let timesBlock = qS(".times");
    timesBlock.innerHTML = "";
    workingTimes.forEach(function (elem) {
        let newItem = document.createElement("span");
        let integerElem = parseInt(elem.replace(/\D+/g, ""));
        if (getStorage[year][month][selectedDay]) {
            if (getStorage[year][month][selectedDay][integerElem]) return;
        }
        newItem.innerHTML = elem;
        qS(".times").appendChild(newItem);
    });

    timesBlock.firstChild.classList.add("picked");
    qS("#selectedTime").innerHTML = timesBlock.firstChild.innerHTML;

    //слушаем клики по времени
    let times =  qSA(".times span:not(.disabled)");
    [].forEach.call(times, function (target) {
        target.addEventListener("click", function () {
            if ( qS(".time .picked"))  qS(".time .picked").classList.remove("picked");
            this.classList.add("picked");
            qS("#selectedTime").innerHTML = this.innerHTML;
        });
    });
}

//читаем файл базы
function readStorage() {
    let url = "/booking.json";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function () {
        if (xhr.status == "200") {
            file = xhr.responseText;
        }
    };
    xhr.send();
    if (file) {return file;} else {return "";}
}

//отправляем запись в расписание
function writeStorage() {
    let data = {
        year: parseInt( qS("#selectedYear").innerHTML),
        month: parseInt( qS("#selectedMonth").innerHTML),
        day: parseInt( qS("#selectedDate").innerHTML),
        time: parseInt( qS("#selectedTime").innerHTML.replace(/\D+/g, ""))
    };
    let url = "http://server.lime82.ru/booking.php";
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("data=" + JSON.stringify(data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        if (xhr.responseText == "ЗАНЯТО") {
            console.log("БЛЯ((");
        } else { console.log(xhr.responseText);}
    };
}

// Заменяем заголовки и текст в форме заявки перед открытием
function insertCta(title, button) {
    qS(".ctaTingle form .ctaRequest").value = `${title} | ${button}`;
    qS(".ctaTingle form h3").innerHTML = title;
    let date = qSA(".selected div div")[0].cloneNode(true);
    let time = qSA(".selected div div")[1].cloneNode(true);
    qS(".ctaTingle form div").appendChild(date);
    qS(".ctaTingle form div").appendChild(time);
    qS(".ctaTingle form button").innerHTML = button;
}


//выводим календарь месяца
for (let index = 1; index < monthLength+1; index++) {
    let newItem = document.createElement("span"),
        d = new Date(year, month, index),
        isWeekend = d.getDay() == 0 || d.getDay() == 6;
    if (isWeekend) newItem.classList.add("weekend");
    if (index < today) newItem.classList.add("disabled");
    if (index == today && !isWeekend) {
        newItem.classList.add("picked");
        qS("#selectedDate").innerHTML = `${index}/`;
    }
    if (index > today && !isWeekend && !qS(".calendar .picked")) {
        newItem.classList.add("picked");
        qS("#selectedDate").innerHTML = `${index}/`;
    }
    newItem.innerHTML = index;
    qS(".calendar").appendChild(newItem);
}

//передвигаем первый день месяца
qS(".calendar span:first-child").style.marginLeft = 100 / 7 * (monthStartDay - 1) + "%";

//подгружаем возможные времена для брони
scanBookingTimes(today);

//слушаем клики по датам
let dates =  qSA(".calendar span:not(.disabled):not(.weekend)");
[].forEach.call(dates, function (target) {
    target.addEventListener("click", function () {
        pickedDay = parseInt(this.innerHTML);
        qS(".calendar .picked").classList.remove("picked");
        this.classList.add("picked");
        qS("#selectedDate").innerHTML = `${this.innerHTML}/`;
        scanBookingTimes(pickedDay);
    });
});

let modalCta = new tingle.modal({
    cssClass: ["ctaTingle"],
    onOpen: function () {
        common.formsListener(".tingle-modal .leadData"); // прикручиваем прослушку submit'а текущей формы в модале
    }
});

//по клику на кнопку записываем в базу
qS("#addBooking").addEventListener("click", () => {
    modalCta.setContent(qS(".inlineCtaBlock").innerHTML);
    insertCta("Почти готово! Введите контакты:", "Записаться");
    modalCta.open();
});

let common = sendData(modalCta); // отправляем по аяксу введённые данные
common.callback = function () {
    writeStorage();
    qS(".openButton").click();
}

/*TODO:
- Сделать вывод двух месяцев
- Корректное отображение выбранного месяца
*/