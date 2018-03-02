function sendData(modalCta) {

	var common = { // объект со всеми методами для отправки оповещений
		weekend: [0,6], // номера выходных дней. 0 - Воскресенье, 6 - Суббота
		workTime: [9,10,11,12,13,14,15,16], // рабочие часы
        
		thankYou: function () { // Говорим спасибо и умираем
			var now = new Date(); // читаем дату
			if (common.weekend.includes(now.getDay()) || !common.workTime.includes(now.getUTCHours()+3)) { // если часы нерабочие или выходной
				var message = `<h3>Ваша заявка принята.</h3>
                                <p>К сожалению, сейчас мы не в офисе.</p>
                                <p>Обязательно перезвоним вам в рабочее время (Пн - Пт с 9:00 до 17:00)</p>`; 
				var timeOut = 20000; } else { 
				message = "<h3>Спасибо! Наш менеджер уже получил вашу заявку и свяжется с вами в течение 10 минут!</h3>"; 
				timeOut = 7000;
			}
			modalCta.open();
			modalCta.setContent(message); // Отправили сообщение юзеру
			setTimeout(function() {modalCta.close();}, timeOut);
			//var yId = "yaCounter45210351";
			//yId.reachGoal('ZAKAZANO');
		},

		sendTelegram: function (data) { // отправляем в телегу
			var url = "/sendTelegram.php";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.send(data);
			common.thankYou(); // Спасибо
			common.callback();
		},

		sendEmail: function (data) { // отправляем почту через php
			var url = "/email.php";
			var xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.send(data);
		},

		formsListener: function (el) { // вешаем прослушку кликов на все ЛИД-формы
			qSA(el).forEach(function (leadData) {
				leadData.addEventListener("submit", function (e) {
					e.preventDefault(); // перехватываем стандартный ответ
					data = new FormData(this); // вместо serialize на jQuery
					data.append("site", window.location.hostname);
					data.append("url", window.location.href); // url
					data.append("pagetitle", qS("title").innerHTML); // url
					common.sendEmail(data);
					common.sendTelegram(data);
				});
			});
		}
	};

	common.formsListener(".leadData");
	return common; // возвращаем наш объект в мир
}