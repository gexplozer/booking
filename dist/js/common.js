function sendData(e){var n={weekend:[0,6],workTime:[9,10,11,12,13,14,15,16],thankYou:function(){var t=new Date;if(n.weekend.includes(t.getDay())||!n.workTime.includes(t.getUTCHours()+3))var a="<h3>Ваша заявка принята.</h3>\n                                <p>К сожалению, сейчас мы не в офисе.</p>\n                                <p>Обязательно перезвоним вам в рабочее время (Пн - Пт с 9:00 до 17:00)</p>",i=2e4;else a="<h3>Спасибо! Наш менеджер уже получил вашу заявку и свяжется с вами в течение 10 минут!</h3>",i=7e3;e.open(),e.setContent(a),setTimeout(function(){e.close()},i)},sendTelegram:function(e){var t=new XMLHttpRequest;t.open("POST","/sendTelegram.php",!0),t.send(e),n.thankYou(),n.callback()},sendEmail:function(e){var n=new XMLHttpRequest;n.open("POST","/email.php",!0),n.send(e)},formsListener:function(e){qSA(e).forEach(function(e){e.addEventListener("submit",function(e){e.preventDefault(),data=new FormData(this),data.append("site",window.location.hostname),data.append("url",window.location.href),data.append("pagetitle",qS("title").innerHTML),n.sendEmail(data),n.sendTelegram(data)})})}};return n.formsListener(".leadData"),n}