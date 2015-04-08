--[[
    Скрипт выполняется после звонка и передает
    данные на сервер, который должен высвободить Tserver
]]

local http = require "socket.http"
local ltn12 = require"ltn12"

node_server = "http://127.0.0.1:8888" -- адрес node.js сервера

local reqbody =""

local ipt = session:getVariable("dialed_ip") -- ip tserver
local cause = session:getVariable("hangup_cause") -- причина завершения звонка
local billsec = session:getVariable("billsec") -- длительность звонка

dat = env:serialize()            
freeswitch.consoleLog("INFO","Here's everything:\n" .. dat .. "\n")
--${duration}","${billsec}"

if ipt then session:consoleLog("info",string.format("Tserver=%s",ipt)); end
if cause then session:consoleLog("info",string.format("Cause=%s",cause)); end
if billsec then session:consoleLog("info",string.format("Billsec=%s",billsec)); end

if ipt then
    if not cause then cause="FAIL" end
    if not cause then billsec=0 end

    reqbody = "ip=" .. ipt .."&cause=" .. cause .."&billsec=" .. billsec
    b, c, h = http.request {
          method = "POST",
          url = node_server .. "/set-call?" .. reqbody,
    }
end
