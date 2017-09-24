# [Find-Jump](https://marketplace.visualstudio.com/items?itemName=mksafi.find-jump)

Find-Jump is like AceJump for IntelliJ IDEs, which is in turn inspired by AceJump for Emacs.

Find-Jump is slightly different, however. While the other AceJump solutions can jump to a word
given a single letter, Find-Jump works better when you type a sequence of characters so that it can narrow down the location to where you want to jump. I made it this way because I believe this provides a better overall experience.

![](https://raw.githubusercontent.com/msafi/xvsc/master/findJump/demoFiles/demo.gif)

## How to use Find-Jump

First you need to bind the `findJump.activate` command to a keyboard shortcut. I bind it to `ctrl+;`.

When you activate Find-Jump, you'll see a blinking red light in the status bar indicating that Find-Jump is active and is receiving your input (see gif above). Now you can start typing the characters to where you want to jump. Usually 3 to 5 characters should be enough to narrow down the location, but your own workflow may vary.

A few things to note:

* The jump character is always a single letter. Sometimes the jump character needs to be pressed with the SHIFT key, which would be indicated on the jump location like `⇧z`
* You cannot press ESC to exit Find-Jump (due to VS Code limitation)
* Pressing the arrow keys, backspace, or the enter key will exit Find-Jump
* You cannot edit what you've typed into the Find-Jump prompt (due to VS Code limitation)
* While Find-Jump is active, you can press the activation keybinding again to reset Find-Jump and start over. This somewhat makes up for the inability to edit

## Find-Jump settings

Find-Jump adds these commands:

* `findJump.activate`: which activates Find-Jump
* `findJump.activateWithSelection`: like `findJump.activate` but will make a selection from the current cursor position to the new cursor position

**Note** No keybinding is provided by this extension. You have to create one yourself.

## Checkout my other VS Code projects

They're listed and described [here](https://github.com/msafi/xvsc#projects-in-this-repo).

## To discuss stuff

Tweet at [@msafi](https://twitter.com/msafi)

## Issues, questions, etc

https://github.com/msafi/xvsc/issues
