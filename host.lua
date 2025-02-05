--os.execute("cd docs &&  python -m SimpleHTTPServer 8080")

-- Function to check if a port is in use
function is_port_in_use(port)
    local handle = io.popen("lsof -i:" .. port)
    local result = handle:read("*a")
    handle:close()
    return result ~= ""
end

local port = 8080

if is_port_in_use(port) then
    print("Port " .. port .. " is already in use.")
    -- Optionally, kill the process using the port
    os.execute("kill $(lsof -t -i:" .. port .. ")")
    print("Terminated the process using port " .. port)
end

os.execute("cd docs && python3 -m http.server " .. port)

--os.execute("cd docs &&  python3 -m http.server 8080")
