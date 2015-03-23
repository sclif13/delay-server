// node.js
// moment.js

var http = require("http");
var url = require("url");

var tserver = [];

tserver['192.168.88.230'] = {ip:'192.168.88.230', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.231'] = {ip:'192.168.88.231', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.232'] = {ip:'192.168.88.232', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.233'] = {ip:'192.168.88.233', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.234'] = {ip:'192.168.88.234', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.235'] = {ip:'192.168.88.235', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.236'] = {ip:'192.168.88.236', nexttimecall: 0, count:0, status:0}
tserver['192.168.88.254'] = {ip:'192.168.88.254', nexttimecall: 0, count:0, status:0}


function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    switch (pathname) {
        case '/get-tserver':
            getTserver(request,response);
            break;
        case '/set-call':
            setCall(request,response);
            break;
        case '/clear-tserver':
            clearTserver(request,response);
            break;
        case '/get-all':
            getAll(request,response);
            break;
        default:
            break;
        /*
	    response.writeHead(200, {"Content-Type": "text/plain"});
	    response.write("None");
	    response.end();
        */
    }
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

start()


function clearTserver(request, response) {

    tserver['192.168.88.230'] = {ip:'192.168.88.230', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.231'] = {ip:'192.168.88.231', nexttimecall: 0, count:0, status:0}   
    tserver['192.168.88.232'] = {ip:'192.168.88.232', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.233'] = {ip:'192.168.88.233', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.234'] = {ip:'192.168.88.234', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.235'] = {ip:'192.168.88.235', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.236'] = {ip:'192.168.88.236', nexttimecall: 0, count:0, status:0}
    tserver['192.168.88.254'] = {ip:'192.168.88.254', nexttimecall: 0, count:0, status:0}

    console.log("Database clear!");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Database clear!");
    response.end(); 
 
}

function getTserver(request,response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    for(t in tserver) {
        response.write("Ha" + tserver[t].ip + "\n");
    }
    response.end();
}

function setCall(request,response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    for(t in tserver) {
        response.write("Ha" + tserver[t].ip + "\n");
    }
    response.end();
}

function getAll(request,response) {

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<table border='1'><tr><td>ip</td><td>nexttimecall</td><td>count</td><td>status</td></tr>");
    for(t in tserver) {
        response.write("<tr><td>"+ tserver[t].ip +"</td> \
                            <td>"+ tserver[t].nexttimecall +"</td> \
                            <td>"+ tserver[t].count +"</td> \
                            <td>"+ tserver[t].status +"</td></tr>");
    }
    response.write("</table>");
    response.end();
}

/*
function setSuccessTime(request, response) {
	keeper.lastSuccess = new Date;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("" + keeper.lastSuccess);
    response.end();	
}

function setFailTime(request, response) {
	keeper.lastFail = new Date;
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("" + keeper.lastFail);
    response.end();	
}

function getSuccessTime(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("" + keeper.lastSuccess);
    response.end();	

}

function getFailTime(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("" + keeper.lastFail);
    response.end();	

}
*/