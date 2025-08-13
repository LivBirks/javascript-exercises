/*
Print Current Window Contents

Write a JavaScript program to print the current window contents.

This JavaScript program defines a function that uses the window.print() method to print the contents of the current browser window. When the function is called, it triggers the print dialog, allowing the user to print the current webpage.

Output:
Click the button to print the current page.
*/
function printCurrentWindow() {
  if (typeof window !== 'undefined' &&
    window.print) {
    // Browser environment
    window.print();
    console.log('Print dialog opened');
  } else {
    // Node.js environment  
    console.log('Print function called (browser print() not available in Node.js)');
  }
}

export default printCurrentWindow;