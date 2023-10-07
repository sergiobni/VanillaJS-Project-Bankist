'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////Display the movements on the user interface

//The function will receive an array of movements
const displayMovements = function (movements) {
  //Clean the previous data
  containerMovements.innerHTML = '';
  //Creating new html
  movements.forEach(function (mov, i) {
    //Check if the movement is deposit or withdrawal
    const typeMov = mov > 0 ? 'deposit' : 'withdrawal';
    //Creating new html row with correspondent data
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${typeMov}">${
      i + 1
    } ${typeMov}</div>
    <div class="movements__value">${mov}</div>
  </div>`;
    //Insert the new html into the html document
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/// Display Balance
const calcDisplayBalance = function (acc) {
  //Setting an updated balance property in the account object
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //Displaying balance
  labelBalance.textContent = `${acc.balance} €`;
};

///Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //Interest rates came from user object property, computing the interest accumulated for all deposits, bank only pays interest if the interest is at least 1€
  const interest = acc.movements
    .filter(mov => mov > 0) //Getting the value of every deposit
    .map(deposit => (deposit * acc.interestRate) / 100) //Save calculated interest for every deposit
    .filter((int, i, arr) => {
      //Only paying interest if amount at least 1€
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0); //Sum all interest generated
  labelSumInterest.textContent = `${interest}€`;
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

console.log(account1, account2, account3);

/////////////////////////////////////////////////

///// Event handler

///Login
let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault(); //Prevent the reload of the page, triggered by the html form submit
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //If the introduced account exists and checks with the correct pin number (with optional chaining)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0] //Getting the first name of the owner
    }`;
    containerApp.style.opacity = 100; //Hide the default dashboard before the logged user data loads

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //Focus out of the textbox

    updateUI(currentAccount);
  }
});

const updateUI = function (acc) {
  //Display movements
  displayMovements(currentAccount.movements);

  //Display balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount);
};

///Transfers

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
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
  }
  updateUI(currentAccount);
});
