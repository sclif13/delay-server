--[[
    Скрипт выполняется после звонка и передает
    данные на сервер, который должен высвободить Tserver
]]

local http = require "socket.http"
local ltn12 = require"ltn12"

node_server = "http://127.0.0.1:8888" -- адрес node.js сервера

local reqbody =""

local ipt = session:getVariable("dialed_ip")
local cause = session:getVariable("hangup_cause")


--dat = env:serialize()            
--freeswitch.consoleLog("INFO","Here's everything:\n" .. dat .. "\n")

session:consoleLog("info",string.format("Tserver=%s",ipt));
session:consoleLog("info",string.format("Cause=%s",cause));

if ipt then
    if not cause then cause="FAIL" end

    reqbody = "ip=" .. ipt .."&cause=" .. cause
    b, c, h = http.request {
          method = "POST",
          url = node_server .. "/set-call?" .. reqbody,
    }
end
