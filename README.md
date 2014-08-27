``` d
import std.stdio;
import std.file;
import std.algorithm;
import std.conv;
import std.string;

```
 This program is documented in a literate fashion.
 In this case we prefix all lines that belong to the doc with a '//'
 I might change that behaviour and will atleast make it optional.
``` d

string docLinePrefix = "//";

```
 The whole idea offcourse is to document this program and write it at the same time.
 When you're reading this _nicely_ formatted it means it worked.
 We'll see how it goes!
``` d

void main(string args[])
{
	if (args.length < 2)
	{
		writeln("Program expects a source file!");
	}else{
```
 I open the file and read it in in lines.
``` d
		auto sourceFile = File(args[1]).byLine();
		
```
 Before I start reading these lines like crazy, what will I do?
 I have two states: documentation or code.
 For every line I care if it is documentation.
``` d
		bool isDocumentation(string line)
		{
			return startsWith(stripLeft(line), docLinePrefix);
		}
```
 If it is documentation I want to get a cleaned up string to write.
``` d
		string cleanDocString(string line)
		{
			return stripLeft(line)[docLinePrefix.length .. $];
		}
		
```
 And I have opened a file to write to.
``` d
		auto destFile = File("output.md", "w");
```
 In the output file I need to write all code surrounded by a github markdown d code tags.
``` d
		string code_open_tag = "``` d";
		string code_close_tag = "```";
```
 that means I'll have to remember state too.
``` d
		bool wasWritingDoc = true;
    
		foreach(line; sourceFile){
			
			if (isDocumentation(to!string(line)))
			{
				if (! wasWritingDoc){
```
 Then we were writing code, so I'll have to close the code tag.
``` d
					destFile.writeln(code_close_tag);
				}
				destFile.writeln(cleanDocString(to!string(line)));
				wasWritingDoc = true;
			}else{
				if (wasWritingDoc){
```
 Then we need to open a code tag
``` d
					destFile.writeln(code_open_tag);
				}
				destFile.writeln(line);
				wasWritingDoc = false;
			}
		}
```
 when we are done and we were writing code then we close the code tag.
``` d
		if (! wasWritingDoc){
			destFile.writeln(code_close_tag);
		}
		
	}
}
```
