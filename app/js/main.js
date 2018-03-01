//считывем дату, время и всё такое
const now = new Date();
let today = now.getDate() + 5,
    year = now.getFullYear(),
    month = now.getMonth(),
    monthLength = 33 - new Date(now.getFullYear(), now.getMonth(), 33).getDate(),
    monthStartDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay(),
    pickedDay, pickedTime,
    storage = [];


//выводим календарь месяца
for (let index = 1; index < monthLength+1; index++) {
    let newItem = document.createElement("span");
    if (index < today) newItem.classList.add("disabled");
    if (index == today) newItem.classList.add("picked");
    newItem.innerHTML = index;
    document.querySelector(".calendar").appendChild(newItem);
}

//считываем базу записей
let getStorage = JSON.parse(readStorage());
console.log(getStorage[year][month][today]);

//выводим время
let workingTimes = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function scanBookingTimes(selectedDay) {
    document.querySelector(".times").innerHTML = "";
    workingTimes.forEach(function (elem, index) {
        let newItem = document.createElement("span");
        if (index == 0) newItem.classList.add("picked");
        let intElem = parseInt(elem.replace(/\D+/g, ""));
        if (getStorage[year][month][selectedDay]) {
            if (getStorage[year][month][selectedDay][intElem]) return;
        }
        //if (index == today) newItem.classList.add("today");
        newItem.innerHTML = elem;
        document.querySelector(".times").appendChild(newItem);
    });

    //слушаем клики по времени
    let times = document.querySelectorAll(".times span:not(.disabled)");
    [].forEach.call(times, function (target) {
        target.addEventListener("click", function () {
            if (document.querySelector(".time .picked")) document.querySelector(".time .picked").classList.remove("picked");
            this.classList.add("picked");
            document.querySelector("#selectedTime").innerHTML = this.innerHTML;
        });
    });
}
scanBookingTimes(today);

//передвигаем первый день месяца
document.querySelector(".calendar span:first-child").style.marginLeft = 100 / 7 * (monthStartDay - 1) + "%";

//слушаем клики по датам
let dates = document.querySelectorAll(".calendar span:not(.disabled)");
[].forEach.call(dates, function (target) {
    target.addEventListener("click", function () {
        pickedDay = parseInt(this.innerHTML);
        document.querySelector(".calendar .picked").classList.remove("picked");
        this.classList.add("picked");
        document.querySelector("#selectedDate").innerHTML = `${this.innerHTML}/`;
        scanBookingTimes(pickedDay);
    });
});

//по клику на кнопку записываем в базу
document.querySelector("#addBooking").addEventListener("click", () => {
    writeStorage();
});

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
    xhr.send(null);
    if (file) {
        return file;
    } else { return ""; }
}

//отправляем запись в расписание
function writeStorage() {
    let data = {
        year: parseInt(document.querySelector("#selectedYear").innerHTML),
        month: parseInt(document.querySelector("#selectedMonth").innerHTML),
        day: parseInt(document.querySelector("#selectedDate").innerHTML),
        time: parseInt(document.querySelector("#selectedTime").innerHTML.replace(/\D+/g, ""))
    };
    console.log(data);
    let url = "http://server.lime82.ru/booking.php";
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('data=' + JSON.stringify(data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) return;
        
        console.log(xhr.responseText);
        
    };
}