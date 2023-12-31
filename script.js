'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-10-09T23:36:17.929Z',
    '2023-10-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'es-ES', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////

///// FUNCTIONS

///Formatting dates
const formatMovementDate = function (date, locale) {
  //Calculating the days passed, getting it in unix time and converting it to days
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  //Calling the calcDaysPassed, with current date and date passed from object loop
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  //Returning a nice string instead of formated date
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //If not in the range of a nice string, return the date formatted accordingly
  return new Intl.DateTimeFormat(locale).format(date);
};

///Internationalizing numbers
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

///Update UI with current account credentials
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

///Setting a timer for autologout
const startLogOutTimer = function () {
  //Set time to 5 minutes
  let time = 300;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //When 0 seconds, stop the timer and logout
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to get started';
    }
    //Decrease 1s
    time--;
  };

  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer; //Returning the timer so we can clear it out if user switches account
};

//////////////////////////

/////Display the movements on the user interface

//The function will receive an array of movements, and state of sort
const displayMovements = function (acc, sort = false) {
  //Clean the previous data
  containerMovements.innerHTML = '';
  //Sorting movements
  const sortedMovs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; //If sort is true, creating a shallow copy of the movements arrays, so the original will not be mutated by the sort method

  //Creating new html
  sortedMovs.forEach(function (mov, i) {
    //Check if the movement is deposit or withdrawal
    const typeMov = mov > 0 ? 'deposit' : 'withdrawal';

    //Getting date for each movement from the object, and the type of locale from object
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    //Formatting displayed movements
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    //Creating new html row with correspondent data
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${typeMov}">${
      i + 1
    } ${typeMov}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;
    //Insert the new html into the html document
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/// Display Balance
const calcDisplayBalance = function (acc) {
  //Setting an updated balance property in the account object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //Formatting displayed movements
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);

  //Displaying balance
  labelBalance.textContent = `${formattedMov} €`;
};

///Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  //Interest rates came from user object property, computing the interest accumulated for all deposits, bank only pays interest if the interest is at least 1€
  const interest = acc.movements
    .filter(mov => mov > 0) //Getting the value of every deposit
    .map(deposit => (deposit * acc.interestRate) / 100) //Save calculated interest for every deposit
    .filter((int, i, arr) => {
      //Only paying interest if amount at least 1€
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0); //Sum all interest generated
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

/////////////////////////////////////////////////

///Computing user names

///Creating a new username for each user object, taking the list of objects from an array, and processing each at a time
const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner //saving and manipulating the new object property
      .toLowerCase()
      .split(' ')
      //Looping over the array created, taking the first char of each word, and creating a new string, it will return a string with the user name and store it at the user object as username
      .map(name => name.charAt(0))
      .join('');
  });
};

createUserNames(accounts);

console.log(account1, account2);

/////////////////////////////////////////////////

///// Event handler

let currentAccount, timer; //Variables that need to be on the parent scope
///Login
btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //Prevent the reload of the page, triggered by the html form submit
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //If the introduced account exists and checks with the correct pin number (with optional chaining)
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0] //Getting the first name of the owner
    }`;
    containerApp.style.opacity = 100; //Hide the default dashboard before the logged user data loads

    ///Display Current time

    const now = new Date();
    //Creating an object for getting the formatted options we want from the Intl
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //Focus out of the textbox

    //Starting the timer for logout
    if (timer) clearInterval(timer); //If there was a timer already, clear it
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

///Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //Clean html input fields
  inputTransferAmount.value = inputTransferTo.value = '';

  //Check if sender accounts has enough funds and it sends positive money
  if (
    amount > 0 && //(&& short circuiting, if true continue)
    receiverAcc && //Check if the receiver account exists
    currentAccount.balance >= amount && // Check if the sender amount holds enough funds
    receiverAcc.username !== currentAccount.username
  ) {
    //Subtract the amount from the sender balance
    currentAccount.movements.push(-amount);
    //Add amount to the reciever balance
    receiverAcc.movements.push(amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
  }
  updateUI(currentAccount);
  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

///Delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Calculate index to delete
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete the account at the index previusly determined
    accounts.splice(index, 1); //Selected index to start removing and the number of removed elements

    //Clean html fields
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = 'Login to get started';

    //Hide UI
    containerApp.style.opacity = 0;
  }
});

///Request loans
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //Rounding the value with floor method
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Creating a little delay for approving the loan
    setTimeout(() => {
      //Add loan to balance
      currentAccount.movements.push(amount);

      //Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Clean html input field
      inputLoanAmount.value = '';

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();

      updateUI(currentAccount);
    }, 1500);
  }
});

///Sorting movements
let isSorted = false; //For stablishing a flip trigger condition
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !isSorted);
  isSorted = !isSorted;
});
