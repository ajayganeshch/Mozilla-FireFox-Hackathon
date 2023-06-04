const crypto = window.crypto;

("use strict");

let account1 = {
  name: "Ajay Ganesh",
  cardNumber: "1230 4586 7889",
  cvv: "098",
};

let account2 = {
  name: "Naga",
  cardNumber: "0813 6496 0723",
  cvv: "789",
};

let account3 = {
  name: "Sri Ram G B",
  cardNumber: "0813 6496 0723",
  cvv: "702",
};

let flag = [0, 1, 2, 3, 4]; // failed , done, pending,cut from first account but not credited in 2nd acc,invalid details

let accounts = [account1, account2, account3]; // As this was a demo we are storing all received in one array

// Add ID To All :

accounts.map(mov=>{mov.name.split(" ")})
let publicArray = []; // Main array to store all tokens public

let privateArray = []; // Main array to store all tokens private

let signal; // True or false signal

// Basic We will check CVV contains 3 digits or not :

/*
let cvvCheck = function (cvvRec) {
  let checkArrObj = cvvRec.length ? 0 : 1; // length method will work on arrays only

  // console.log(checkArrObj);

  let ansIs =
    checkArrObj == 1
      ? cvvRec.cvv.length === 3
      : cvvRec.forEach((ele) => {
          ele.cvvCheck = ele.cvv.length === 3;
        });

  console.log(cvvRec);
};

cvvCheck(accounts); // If all accounts given at a time
cvvCheck(account1); // if only for one account it want to check
*/

// Check card number contains total 3 parts and each contains 4 parts

// Optional :
/*
let cardCheck = function (numberRec) {
  let hasValidCardNumber;

  if (Array.isArray(numberRec)) {
    // console.log(numberRec);
    numberRec.forEach((mov) => {
      let cardNumbers = mov.cardNumber.split(" ");
      // console.log(cardNumbers);
      hasValidCardNumber = cardNumbers.every(
        (cardNumber) => cardNumber.length === 4
      );
      mov.cardCheck = hasValidCardNumber;
    });
  } else {
    let cardNumbers = numberRec.cardNumber.split(" ");
    // console.log(cardNumbers);
    console.log(cardNumbers);
    hasValidCardNumber = cardNumbers.every(
      (cardNumber) => cardNumber.length === 4
    );
    // console.log(hasValidCardNumber);
  }

  if (hasValidCardNumber) {
    console.log("Valid card number found!");
  } else {
    console.log("No valid card number found.");
  }
};

cardCheck(accounts);

cardCheck(account1);

console.log(accounts);
*/

// Name just check entered without Alpha Numeric

// This only done if all info not repeated

// Function to validate Name input
function nameCheck(input) {
  let name = input.value;
  let nameFormat = /^[A-Za-z]+$/;

  if (!nameFormat.test(name)) {
    input.setCustomValidity("Name should only contain alphabetic characters.");
  } else {
    input.setCustomValidity("");
  }
}

// Function to add hyphens after every 4 digits in the card number

function cardNumberFor(input) {
  let value = input.value.replace(/\D/g, "");
  let newValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      newValue += "-";
    }
    newValue += value[i];
  }
  input.value = newValue;
}

// Function to validate CVV input
function cvvCheck(input) {
  let cvv = input.value;
  let cvvFormat = /^[0-9]{3}$/;

  if (!cvvFormat.test(cvv)) {
    input.setCustomValidity("CVV should be 3-digit number.");
  } else {
    input.setCustomValidity("");
  }
}

// Event listeners for input fields
document.getElementById("card-number").addEventListener("input", function () {
  cardNumberFor(this);
});

document.getElementById("cvv").addEventListener("input", function () {
  cvvCheck(this);
});

document.getElementById("name").addEventListener("input", function () {
  nameCheck(this);
});

document
  .querySelector(".buttonOnSubmit")
  .addEventListener("click", function (e) {
    // e.preventDefault();
  });
// After modification :

console.log(accounts);

// Encryption Algo Done IN NPCI

let mixtureOfAll;
let idLen;
let encryptedToken;
let decryptedToken;

function encryptData(cardDetails, cvv, name, id, flag, key) {
  // Combine the data into a single string
  mixtureOfAll = cardDetails + cvv + name + id + flag;
  idLen = id.length;
  // console.log(mixtureOfAll);

  encryptedToken = "";

  for (let i = 0; i < mixtureOfAll.length; i++) {
    let charCode =
      mixtureOfAll.charCodeAt(i) + key.charCodeAt(i % key.charCodeAt[i]);
    // console.log("The charcodeAt : ", mixtureOfAll.charCodeAt(i));
    encryptedToken += String.fromCharCode(charCode);
  }

  // Convert the encrypted token to Base64 for encoding
  const base64TokenGen = btoa(encryptedToken);

  return base64TokenGen;
}

// cardDetails, cvv, name, id, flag, key

// Random Key
// const keyMain = Math.random().toString(36);

const keyMain = "ajayganesh";

console.log(keyMain);

const encrypted1 = encryptData("123", "123", "ganesh", "1234", "0", keyMain);
console.log(encrypted1);

const decrypted1 = decryptData(encrypted1, keyMain);
console.log(decrypted1);

// console.log(encryptData("123", "ajay", "12", "1"));

// Date , time , location // After Will add // Some Things Need To Added :

// Send public key to client

// Client Decodes using his key

function decryptData(encryptedToken, key) {
  const base64Revoke = atob(encryptedToken);

  decryptedToken = "";

  for (let i = 0; i < base64Revoke.length; i++) {
    let charCode =
      base64Revoke.charCodeAt(i) - key.charCodeAt(i % key.charCodeAt[i]);
    decryptedToken += String.fromCharCode(charCode);
  }

  // Extract the id and flag values from the decrypted token
  const id = decryptedToken.slice(-idLen - 1, -1);
  const flagAfterDec = decryptedToken.slice(-1);

  return { id, flagAfterDec };
}

// Client also receive signal success or fail

// If fail cancel and if not accept

// Final Ans :
