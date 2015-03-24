--[[
    Скрипт выполняется после звонка и передает
    данные на сервер, который должен высвободить Tserver
]]

local http = require "socket.http"
local ltn12 = require"ltn12"

node_server = "http://127.0.0.1:8888" -- адрес node.js сервера

--local respbody = {}
local reqbody =""

--local cause = "NORMAL_CLEARING"

local ipt = session:getVariable("dialed_ip")
local cause = session:getVariable("bridge_hangup_cause")

session:consoleLog("info",string.format("Tserver=%s",ipt));
session:consoleLog("info",string.format("Cause=%s",cause));

if not cause then cause="FAIL" end

reqbody = "ip=" .. ipt .."&cause=" .. cause
b, c, h = http.request {
          method = "POST",
          url = node_server .. "/set-call?" .. reqbody,
}
