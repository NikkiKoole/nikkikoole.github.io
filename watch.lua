local watcher = require 'watcher'

watcher('.', function()
   os.execute("lua main.lua")
end)

