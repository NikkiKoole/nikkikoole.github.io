#!/usr/bin/env lua

os.setlocale("C")
local now = os.time()

local markdown = require 'libs.markdown'
local toml = require 'libs.toml'
local inspect = require 'libs.inspect'
local liluat = require 'libs.liluat'

local destination ='docs/'
function printGreen(...)
   io.write("\x1B[32m")
   print(...)
   io.write("\x1B[m\x1B[K")
end
function  printPink(...)
   io.write("\x1B[35m")
   print(...)
   io.write("\x1B[m\x1B[K")
end
function  printYellow(...)
   io.write("\x1B[93m")
   print(...)
   io.write("\x1B[m\x1B[K")
end

function scandir(directory)
   local i, t, popen = 0, {}, io.popen
   local pfile = popen('ls -a "' .. directory .. '"') -- no joy on windows
   for filename in pfile:lines() do
      i = i + 1
      t[i] = filename
   end
   pfile:close()
   return t
end

function ends_with(str, ending)
   return ending == "" or str:sub(- #ending) == ending
end

function split(str, delimiter)
   local result = {}
   for match in (str .. delimiter):gmatch("(.-)" .. delimiter) do
      table.insert(result, match);
   end
   return result;
end

function readAll(file)
   local f = assert(io.open(file, "rb"))
   local content = f:read("*all")
   f:close()
   return content
end

function readSource(source)
   local firstIndex = (string.find(source, '---\n', 1))
   local secondIndex = (string.find(source, '---\n', 4))
   local frontmatter = nil

   if firstIndex and secondIndex then
      frontmatter = string.sub(source, firstIndex, secondIndex + 3)
      frontmatter = string.gsub(frontmatter, '---\n', '')
      frontmatter = toml.parse(frontmatter)
      source = string.sub(source, secondIndex + 4)
   end

   return markdown(source), frontmatter
end

function writePost(path, data)
   local file = io.open(path, "w")
--   print(path)
   file:write(data)
   file:close()
end

if arg then
   if arg[1] == 'post' then

      local answer
      repeat
         io.write("ok, you want a new post, should it be (a)app, (b)blog, (c)stuff, (d)makes post ? ")
         io.flush()
         answer = io.read()
      until answer == "a" or answer == "b" or answer == "c" or answer=="d"

      if not arg[2] then
         print('you forgot to write a new name')
      else
         local frontmatter =
         "---\n" ..
             "timestamp=" .. os.time() .. "\n" ..
             "date=" .. (os.date("'%d %h %Y'")) .. "\n" ..
	    "title='" .. arg[2] .. "'\n" ..
	    "draft=true" ..
             "---\n"
         local prefix = 'content/'
         if answer == 'a' then prefix = prefix .. 'apps/' end
         if answer == 'b' then prefix = prefix .. 'blog/' end
         if answer == 'c' then prefix = prefix .. 'stuff/' end
         if answer == 'd' then prefix = prefix .. 'makes/' end
         
         local path = prefix .. arg[2]:gsub(' ', '-') .. '.md'
         print('creating ' .. path)
         writePost(path, frontmatter)
      end
   end
end


local writtenFileCount = 0

function getMonthIndex(month)
   local months = { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" }
   for i = 1, 12 do
      if month == months[i] then return i end
   end
   return -1
end

function frontMatterDateToTimestamp(date)
   local s = date
      local p="(%d+) (%a+) (%d+)"
      local day,month,year=s:match(p)
      local monthIndex = getMonthIndex(month)
     -- print(day, month,year)
     return  os.date("%Y-%m-%d", os.time({year=year, day=day, month=monthIndex}))
end

local gatheredSitemapData = {}

function makeSitemapFromGatheredData(prefix)
    table.sort(gatheredSitemapData, function(left, right)
      return left.priority > right.priority
   end)

 for i=1, #gatheredSitemapData do
    local loc =  gatheredSitemapData[i].loc:gsub("index", "")
    gatheredSitemapData[i].loc = prefix..loc
 end


 local result = ''
 
 result = result .. '<?xml version="1.0" encoding="UTF-8"?>\n'
result = result .. '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for i=1, #gatheredSitemapData do
   result = result .. '<url>\n'
      result = result ..'  <loc>'..gatheredSitemapData[i].loc..'</loc>\n'
      result = result ..'  <lastmod>'..gatheredSitemapData[i].lastmod ..'</lastmod>\n'
      result = result ..'  <priority>'..gatheredSitemapData[i].priority ..'</priority>\n'
   result = result .. '</url>\n'
end

   result= result .. '</urlset>\n' 

 --  print(result)
   writePost(destination..'/sitemap2.xml', result)
  
   printPink('written an sitemap file with '..#gatheredSitemapData .. ' items in it.')
end

function doSimple(template, content, values, valueStorage)
   local t = readAll('templates/' .. template .. '.template')
   local firstPathPart = split(content, '/')[1]
   local source = readAll('content/' .. content .. '.md')
   local html, frontmatter = readSource(source)
   values.frontmatter = frontmatter
   values.appleId = frontmatter and frontmatter.appleId
   values.structuredJSON = frontmatter and frontmatter.structuredJSON
   values.html = html
   values.firstPathPart = firstPathPart
   if (frontmatter and frontmatter.title) then
      values.title = frontmatter.title
   end

   if (valueStorage) then
      table.insert(valueStorage, values)
   end

   -- todo sitemap stuff WIP

   if frontmatter and (  not frontmatter.draft or frontmatter.draft == false) then
      table.insert(gatheredSitemapData, {loc=content, lastmod=frontMatterDateToTimestamp(frontmatter.date), priority=frontmatter.score})
      frontMatterDateToTimestamp(frontmatter.date)
      printPink(frontmatter.title .. ' => sitemap, score: '..frontmatter.score)
   end
  
   
   
   local compiled_template = liluat.compile(t)
   local rendered_template = liluat.render(compiled_template, values)
   writePost(destination .. content .. '.html', rendered_template)
   writtenFileCount = writtenFileCount + 1
   printGreen(destination .. content .. '.html')
end

function doBunch(dir)
   local files = scandir('content/' .. dir)
   local result = {}

   for _, file in ipairs(files) do
      if (file ~= 'index.md') then
         if ends_with(file, '.md') then
            local content = file:gsub('.md', '')
            doSimple('general', dir .. '/' .. content, { path = content .. '.html', test='123' }, result)
         end
      end
   end

   table.sort(result, function(left, right)
      return left.frontmatter.timestamp > right.frontmatter.timestamp
   end)

   local list = {}
   for _, post in ipairs(result) do
      if not post.frontmatter.draft then
         table.insert(list, { title = post.frontmatter.title, path = post.path, frontmatter = post.frontmatter })
      end
   end

   return list
end

local list = doBunch('makes')
doSimple('collection', 'makes/index', { title = "Makes", posts = list })

local list = doBunch('apps')
doSimple('collection', 'apps/index', { title = "Apps", posts = list })

local list = doBunch('blog')
doSimple('collection', 'blog/index', { title = "Blog", posts = list })

local list = doBunch('stuff')
doSimple('collection', 'stuff/index', { title = "Stuff", posts = list })

doSimple('general', 'about/index', { title = "About" })
doSimple('general-canonical', 'index', { title = 'Mipolai makes apps', canon="\"https://mipolai.com/\""})
doSimple('general-canonical-nikki', 'nikki', { title = 'Nikki', canon="\"https://nikkikoole.com/\""})



printYellow('Done!, written ' .. writtenFileCount .. ' files in ' .. (os.time() - now) .. ' seconds.')
makeSitemapFromGatheredData( 'https://mipolai.com/')

