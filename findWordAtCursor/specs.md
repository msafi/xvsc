# Specs

## Concepts

### Needle

The text for which we search the rest of the document.

### Selection

Can be a single character (called position) or multiple characters (called range).

## Cases

#### #1

It has two behaviors, seeking the next target forward. Or seeking the next target back.

#### #2

It doesn't do anything if it can't find an active text editor

#### #3

It doesn't do anything if the user has triggered it while having a multiline selection

#### #4

If the user is making a multi-character selection, the needle will be the entire selection, as long as it does not span multiple lines. Else, the selection is a single character. In that case, we use...

```js
document.getWordRangeAtPosition(end, /\w+/g)
```

...to get the range of the word under the user's cursor.

#### #5

If we can't find a range, which happens when the user triggers seeking while the cursor is positioned on empty whitespace, we will simply return.

#### #6

Starting from the line at which the user has their cursor, we loop through the rest of the lines in the document either forward or back depending on whether the user triggered the `next` or `previous` command.

#### #7

The first line we process is the line on which the user cursor currently is because the current line may contain occurrences of the needle farther ahead or behind in the line itself.

#### #8

We loop through the lines either forward or back. If we are looping forward, we'll want to reach up to the last line in the document, so our condition would be `i < document.lineCount`. If we are looping back, we want to reach as far back as the first line in the document, so our condition would be `i >= 0`.

#### #9