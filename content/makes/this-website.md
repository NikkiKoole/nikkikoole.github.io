---
timestamp=1665305048
date='09 Oct 2022'
title='this website'
---


**This website**

So I've been building this website, the one you are looking at **right now**.
It's all completely static, but I felt like that.

Off course as soon as I decided to build a static website, I've looked at some of the options out there, there are just way too many ;) and all of them have something about them I don't like. So I ended up making my own.

![xkcs](https://imgs.xkcd.com/comics/standards_2x.png)

My personal projects are mostly done in Lua, so I decided on using that for this tool too.

**The requirements:**
  
* simple to add a new post
* not a single page app thing website, but just good old html with links
* flexible enough to add some custom scripts here and there
* simple to deploy live
* not having to install all sorts of libraries to get going

I found a few pieces of code that will help:

[liluat](https://github.com/FSMaxB/liluat)  
This is a template engine,
with it I can add templates into some html string, and like that churn out a bunch of html that is filled in.


    {{ code }}
    {{= expression }}
    {{include: 'templates/file'}}

or in the context of this site:
I take this: 
    
    <head>
	    <title>{{= title}} | made with ♥ by Mipolai</title>
        {{include: 'templates/headcss.template'}}
	</head>

and it turns into:
 
    <head>
		<title>this website | made with ♥ by Mipolai</title>
                
    <meta charset="UTF-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/favi/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favi/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favi/favicon-16x16.png">
    <link rel="manifest" href="/assets/favi/site.webmanifest">
    <link rel="mask-icon" href="/assets/favi/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#00aba9">
    <meta name="theme-color" content="#ffffff">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Mipolai is Nikki Koole, I'm building many apps and trying to stay sane.">

    <link async rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/agate.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
    <!-- and it's easy to individually load additional languages -->
    <script async src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/lua.min.js"></script>
    <script>hljs.highlightAll();</script>

    <link rel="stylesheet" href="/normalize.css">
    <link rel="stylesheet" href="/style.css">
    <script src="/calendar.js"></script>

	</head>

note how it filled in the title of this specific page and it took another template (headcss) and filled that in place. 

next on the list of handy pieces of code is:
[markdown lua](https://github.com/mpeterv/markdown)

Markdown makes the process of writing html __much__ easier, I just write like a person and html comes out.

I write this: 

    Markdown makes the process of writing html __much__ easier, I just write like a person and html comes out.

And it becomes:   

    <p>Markdown makes the process of writing html <strong>much</strong> easier, I just write like a person and html comes out.</p>

Ok so templating and markdown are sorted, the only thing left is something that handles [frontmatter](https://jekyllrb.com/docs/front-matter/) I found:
[toml](https://github.com/jonstoler/lua-toml)
which is pretty good.

with it i can write a little block at the beginning of a markdown document
    
    ---
    timestamp=1665244111
    date='08 Oct 2022'
    title='preparing app work'
    ---

This blocks contains (meta)data I like to use on the page, you dont want to see it as text but instead you want to be able to use the data. think thumbs, tags, dateof publishing etc
