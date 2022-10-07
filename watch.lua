local watcher = require 'watcher'

watcher('content/', function()
   os.execute("lua main.lua")
end)
