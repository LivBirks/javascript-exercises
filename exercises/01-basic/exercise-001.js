/* 
Write a JavaScript program to display the current day and time in the following format.  
Sample Output : 
Today is : Tuesday 
Current time is : 10 PM : 30 : 38
*/
function getCurrentDayAndTime() {
  // Get the date/time now
  const now = new Date();
  // Get the day of the week
  const options = { weekday: 'long' };
  const dayOfTheWeek = new Intl.DateTimeFormat('en-GB', options).format(
    now,
  );
  //construct day variable to return
  const day = `Today is : ${dayOfTheWeek}`;
  // Get the hour of the day (24 hour)
  const hour24 = now.getHours();
  // Convert 24 hour to 12 hour, 0 is falsy so you can use || to use 12 instead of 0
  const hour12 = hour24 % 12 || 12;
  // Set the period to AM or PM depending on the value of hour24
  const period = hour24 >= 12 ? 'PM' : 'AM';
  // Get the minutes and seconds and make sure single digits are padded
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  // construct time variable to return
  const time = `Current time is : ${hour12} ${period} : ${minutes} : ${seconds}`;
  return { day, time };
}

getCurrentDayAndTime()
export default getCurrentDayAndTime;
