// node.js
// moment.js http://momentjs.com/docs
/*  Обрабатываются запросы
    get-server - выдается ip Tserver с наименьшим временем nexttimecall
    и количеством успешных звонков не больше random значения от Cmin до Cmax
    set-server - обрабатывает запрос от Freeswitch о завершении звонка
    get-all - показывает существующуй массив Tserver
    clear-all - сбрасывает массив
*/

var http = require("http");
var url = require("url");
var moment = require('moment');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'password',
  database : 'DSERVER'
});


var tserverArray = [];

// ip - адрес Tserver
// nexttimecall - время следующего звонка
// count - количество удачных совершенных звонков
// status - статус линии (занята 1, не занята 0 )
// timer - совокупное время удачных звоков

var start_time; // время запуска


tserverArray = [{ip:'192.168.88.230', nexttimecall: 1000, count:0, status:0, timer:0},]
            /*  {ip:'192.168.88.231', nexttimecall: 303, count:0, status:0, timer:0},
                {ip:'192.168.88.232', nexttimecall: 405, count:0, status:0, timer:0},
                {ip:'192.168.88.233', nexttimecall: 709, count:0, status:0, timer:0},
                {ip:'192.168.88.234', nexttimecall: 589, count:0, status:0, timer:0},
                {ip:'192.168.88.235', nexttimecall: 444, count:0, status:0, timer:0},
                {ip:'192.168.88.236', nexttimecall: 533, count:0, status:0, timer:0},
                {ip:'192.168.88.254', nexttimecall: 1, count:0, status:0, timer:0}] */

//Минимальное и максимальное значение для random при удачном звонке
var Amin = 60;
var Amax = 120;
//Минимальное и максимальное значение для random при неудачном звонке
var Bmin = 30;
var Bmax = 50;
//Минимальное и максимальное значение для random количества удачных звонков
var Cmin = 15;
var Cmax = 20;


var tserver = {};

tserverArray.forEach(function(value){
 tserver[value.ip] = value;
});

function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    switch (pathname) {
        case '/get-server':
            getTserver(request,response);
            break;
        case '/set-call':
            setCall(request,response);
            break;
        case '/clear-all':
            clearTserver(request,response);
            break;
        case '/get-all':
            getAll(request,response);
            break;
        default:
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("None!");
            response.end();
            break;
    }
  }

  http.createServer(onRequest).listen(8888);
  console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Server has started.");

}


function insertdb() {
    for(t in tserver) {
        connection.query('INSERT INTO tserver SET ?', { db_start_time: start_time, 
                                                        db_ip: tserver[t].ip, 
                                                        db_timer: 0, 
                                                        db_count: 0}, function(err, result) {
            if (err) throw err;
            //console.log(result.insertId);
        });
    }
}

//main
start_time = moment().format('YYYY-MM-DD HH:mm:ss');

connection.connect(function(err) {
  if (err) {
    console.error(moment().format('YYYY-MM-DD HH:mm:ss') + ': error connecting: ' + err.stack);
    return;
  }

  console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': MYSQL connected as id ' + connection.threadId);
});


insertdb();
start();
//end main

function clearTserver(request, response) {

    for(t in tserver) {
        tserver[t].nexttimecall = 0;
        tserver[t].count = 0;
        tserver[t].status = 0;
        tserver[t].timer = 0;
    }

    console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Database clear!");
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("Database clear!");
    response.write("<br><p><a href='/get-all'>get-all</a></p>");
    response.end();

    start_time = moment().format('YYYY-MM-DD HH:mm:ss');
    insertdb();
}


function getTserver(request,response) {

    //Сортируем по времени следующего звонка
    tserverArray.sort(function(a,b){
        return a.nexttimecall - b.nexttimecall
    });

    response.writeHead(200, {"Content-Type": "text/plain"});

    var C = Math.floor((Math.random() * (Cmax - Cmin)) + Cmin); //Вычисляем random Count

    for(t in tserverArray) {
        if (tserverArray[t].status == 0 
            && tserverArray[t].count <= C 
            && tserverArray[t].nexttimecall <= moment().unix()) {
            tserverArray[t].status = 1;        // Занимаем линию
            response.write(tserverArray[t].ip); // Выдаем IP
            break;
        }
    }    

    response.end();
}

//Ответ Fs после звонка
function setCall(request,response) {

	var ntc = 0; // nexttimecall

    if (request.method == 'POST') {
        var query = url.parse(request.url,true).query;
        tserver[query.ip].status = 0;
        if (query.cause == "NORMAL_CLEARING" && query.billsec > 0) {
        	tserver[query.ip].count += 1;
        	tserver[query.ip].timer += parseInt(query.billsec, 10);
            updatedb(query.ip, tserver[query.ip].count, tserver[query.ip].timer); // Обновляем статистику в MYSQL
            //Вычисляем время следующего звонка
            ntc = Math.floor((Math.random() * (Amax - Amin)) + Amin);
            tserver[query.ip].nexttimecall = moment().unix() + ntc;
            console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Good uuid " + query.uuid);
            console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Next time call " + ntc + "s at "  
            	+ moment(tserver[query.ip].nexttimecall,'X').format('YYYY-MM-DD HH:mm:ss'));
        } else {
        	ntc = Math.floor((Math.random() * (Bmax - Bmin)) + Bmin);
            tserver[query.ip].nexttimecall = moment().unix() + ntc;
            console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Bad uuid " + query.uuid);
            console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ": Next time call " + ntc + "s at "
            	+ moment(tserver[query.ip].nexttimecall,'X').format('YYYY-MM-DD HH:mm:ss'));
        }
    }

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end();
}

// Вывод основного массива
function getAll(request,response) {

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<table border='1'><tr><td>ip</td><td>nexttimecall</td><td>count</td><td>status</td><td>timer</td></tr>");
    for(t in tserver) {
        response.write("<tr><td>"+ tserver[t].ip +"</td> \
                            <td>"+ moment(tserver[t].nexttimecall,'X').format('YYYY-MM-DD HH:mm:ss') +"</td> \
                            <td>"+ tserver[t].count +"</td> \
                            <td>"+ tserver[t].status +"</td> \
                            <td>"+ tserver[t].timer +"</td></tr>");
    }
    response.write("</table>");
    response.write("<br><p><a href='/clear-all'>clear-all</a></p>");
    response.end();
}

// Обновляем значение счетчиков 
function updatedb(ip, count, timer) {
    m_qyery = "UPDATE tserver SET db_timer = "+ timer +", db_count = "+ count +" \
    WHERE db_ip = '"+ ip +"' AND db_start_time = '" + start_time + "'";
    connection.query(m_qyery);
}
