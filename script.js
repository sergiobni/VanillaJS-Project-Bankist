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
displayMovements(account1.movements);

/// Display Balance
const calcDisplayBalance = function (movements) {
  //Calculating balance
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  //Displaying balance
  labelBalance.textContent = `${balance} €`;
};
calcDisplayBalance(account1.movements);

///Display Summary
const calcDisplaySummary = function (movements) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  //Established a policy of 1,2% interest, computing the interest accumulated for all deposits, bank only pays interest if the interest is at least 1€
  const interest = movements
    .filter(mov => mov > 0) //Getting the value of every deposit
    .map(deposit => (deposit * 1.2) / 100) //Save calculated interest for every deposit
    .filter((int, i, arr) => {
      //Only paying interest if amount at least 1€
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0); //Sum all interest generated
  labelSumInterest.textContent = `${interest}€`;
};

calcDisplaySummary(account1.movements);
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
