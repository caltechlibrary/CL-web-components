Write an A to Z web component call `a-to-z-ul` who's innerHTML contains HTML5 UL list. That list will be used to structure our links between our A to Z menu and the contents of the list.
 
The web component will be in a file called "a_to_z_ul.js". Three example HTML files will demonstate the web component. The first example HTML with a short UL list. The second example HTML file with a long UL list demonostrating how the optional "back to the menu" anchor will work. The third HTML file that include two separate `a-to-z-ul` lists on the same page. One will be short and one will be long. The goal is to demonstrate that each A to Z UL list functions independently.

The A to Z index should use a "menu" element for UL list navigate. Each menu's LI elements should contain anchors element representing the alphabetical starting letters found in the UL list. That menu's li's anchor will link into the UL list to the where the list's items start with the same alphabetical character. 
 
The A to Z web component use all the same attributes supported by HTML5 UL elements. In addition there is an optional attribute called "long". If "long" is true then an anchor element iss added after the UL list that will take you back to the menu.

The web component should use HTML templates for structure and CSS. 
 
The UL items should be taken form the `a-to-z-ul` innerHTML. The `a-to-z-ul` web component will need to detect when the alphabetical starting letters changes. For each new letter it needs to insert a new li that has a heading and identifying the alphabetical section it is starting. The heading should contain an anchor that links back to the menu. 

The `a-to-z-ul` menu's items should not contain bullets. The Letter section headings don't need bullets. The UL list's menu items should inherit the bullets from the page. 

 The `a-to-z-ul` web component may exist multiple times on a page. 

 The `a-to-z-ul` web component should be implemented as an ES6 module.

--

NOTE: The following is prompts added after the initial prompt generated code.

When you click on the letter in the menu the browser should center the virtial scroll so that section of the list is visible.

The innerHTML of `a-to-z-ul` is a UL list not a list of text one per line.

Update the HTML examples to use innerHTML UL elements

The back to menu link should scroll the menu into view.
