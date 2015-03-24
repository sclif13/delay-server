--[[
    Скрипт запрашивает у сервера свободный Tserver, 
    если нет, то отбивает с ошибкой SIP/2.0 503 Service Unavailable
]]

local http = require "socket.http"
local ltn12 = require"ltn12"

local node_server = "http://127.0.0.1:8888" -- адрес node.js сервера

local respbody = {}
local reqbody =""

-- Запрос сервера для звонка
b, c, h = http.request {
    url = node_server .. "/get-server",
    sink = ltn12.sink.table(respbody)
}

local ipt = respbody[1]	-- ip адрес Tserver

if ipt ~= nil then
    if string.match(ipt, '%d+.%d+.%d+.%d+') then
       session:consoleLog("info",string.format("Tserver=%s",ipt));
       session:setVariable("dialed_ip", ipt);       
    else
        session:consoleLog("info",string.format("Tserver=FAIL"));
        session:setVariable("sip_ignore_remote_cause", "true");
        session:hangup("NORMAL_TEMPORARY_FAILURE");
    end
else
	session:consoleLog("info",string.format("Tserver=FAIL"));
	session:setVariable("sip_ignore_remote_cause", "true");
	session:hangup("NORMAL_TEMPORARY_FAILURE");
end

