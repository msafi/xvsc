# find-word-at-cursor

This extension lets you quickly find the next word in the document that matches the current word under your cursor. It also works with a highlighted selection.

This extension provides the same functionality as IntelliJ's [Find Word At Caret](https://www.jetbrains.com/help/idea/finding-word-at-caret.html).

<table>
	<thead>
		<tr>
			<th>Find word at cursor</th>
			<th>Find selection</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><img src="demoFiles/wordDemo.gif"/></td>
      <td><img src="demoFiles/selectionDemo.gif"/></td>
		</tr>
	</tbody>
</table>

## Extension Settings

This extension adds two new commands:

* `findWordAtCursor.next`: moves the caret to the next word or selection under it
* `findWordAtCursor.previous`: moves the caret to previous word or selection under it

On my Mac system, I've mapped these two commands to:

* `cmd+ctrl+down` for `findWordAtCursor.next`
* `cmd+ctrl+up` for `findWordAtCursor.previous`

Feel free to create a similar mapping in your system.