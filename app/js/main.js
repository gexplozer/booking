const now = new Date();
let today = now.getDate() + 5,
    year = now.getFullYear(),
    month = now.getMonth(),
    monthLength = 33 - new Date(now.getFullYear(), now.getMonth(), 33).getDate(),
    monthStartDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay(),
    pickedDay, pickedTime,
    storage = [];

/*console.log(today);
console.log(monthLength);
console.log(monthStartDay);*/

for (let index = 1; index < monthLength+1; index++) {
    let newItem = document.createElement("span");
    if (index < today) newItem.classList.add("disabled");
    if (index == today) newItem.classList.add("today");
    newItem.innerHTML = index;
    document.querySelector(".calendar").appendChild(newItem);
}

let getStorage = JSON.parse(readStorage());
console.log(getStorage[year][month][today]);

let workingTimes = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

workingTimes.forEach(function (elem) {
    let newItem = document.createElement("span");
    let intElem = parseInt(elem.replace(/\D+/g, ""));
    if (getStorage[year][month][today][intElem]) newItem.classList.add("disabled");
    //if (index == today) newItem.classList.add("today");
    newItem.innerHTML = elem;
    document.querySelector(".times").appendChild(newItem);
});


document.querySelector(".calendar span:first-child").style.marginLeft = 100 / 7 * (monthStartDay - 1) + "%";

let dates = document.querySelectorAll(".calendar span:not(.disabled)");
[].forEach.call(dates, function (target) {
    target.addEventListener("click", function () {
        pickedDay = parseInt(this.innerHTML);
        //console.log(pickedDay);
        
    });
});

let times = document.querySelectorAll(".times span:not(.disabled)");
[].forEach.call(times, function (target) {
    target.addEventListener("click", function () {
        pickedTime = parseInt(this.innerHTML.replace(/\D+/g, ""));
        //console.log(pickedTime);
        writeStorage();
    });
});

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

function writeStorage() {
    let data = {
        year: year,
        month: month,
        day: (pickedDay) ? pickedDay : today,
        time: pickedTime
    };
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
/*
server.lime82.ru / booking.php
*/