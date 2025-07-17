
# Web Component Naming

Naming things is one of the biggest problems in computer science.  Picking good names for web components falls clearly in this problem space. A succesful component may be used to years or longer.  The name should make it clear what the component does and how it might be used.

The history of web components suggest an important naming convesions, two or more words separate by a dash. We can take advantage of this to make our HTML use of the component clearer.  In this spirit the consensus of the DLD team in Summer 2025 is to start a component name using the standard element you're extending along with descriptive word or phrase.

Our `textarea` extending element that presents a table view of CSV text content starts with `textarea` as the prefix in the name. It then adds `csv`, the data it is presenting to manage. Thus the element should be named `textarea-csv`. Our A to Z list element that wraps a UL list follows this approach too, `ul-a-to-z-list`. When you see the markup below it looks like standard HTML and you can see what is being extended.

`textarea-csv` example:

~~~html
<textarea-csc>
    <textarea>A,B
one,two
three,four
    </textarea>
</textarea-csv>
~~~

`ul-a-to-z-list` example:

~~~html
<ul-a-to-z-list>
    <uL>
        <li>A item</li>
        <li>B item</li>
        <li>Z item</li>
    </ul>
</ul-a-to-z-list>
~~~

