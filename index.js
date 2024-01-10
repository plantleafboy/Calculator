const display = document.querySelector('#digit-display');
const squareButtons = document.querySelector('#square-buttons');
const otherButtons = document.querySelector('#other-buttons');
const equalsButton = document.querySelector('#equals-button');
const deleteButton = document.querySelector('#delete-button');
const clearButton = document.querySelector('#clear-button');
const keySound = document.querySelector('#key-sound');
const keySounds = []

for (let i = 1; i <= 4; i++) {
  const soundFile = `./keynoises/Key${i}.m4a`;
  keySounds.push(soundFile);
  
}
console.log(keySounds);

let operator = null;
let num1 = null;
let num2 = null;
let newEntryFlag = true;
let prevEntry = null

let prev_operations = [];
const operandFuncs = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  'x': (x, y) => x * y,
  '/': (x, y) => x / y,
  '%': (x, y) => x % y
};
const operands = ['x', '-', '+', '/', '%'];
const regex = new RegExp(`(${operands.map(operand => `\\${operand}`).join('|')})`, 'g'); //from chatgpt

let squareKeys = Array.from(squareButtons.children);
  squareKeys.forEach((key) => {
    key.setAttribute('class', 'num-key')
    key.addEventListener('click', () => playSound());
  });
let digits = squareKeys.filter(key => !isNaN(key.textContent));
let nonDigits = squareKeys.filter(key => isNaN(key.textContent));
let operatorArray = squareKeys.filter(key =>(operands.includes(key.textContent)));

function operate(num1, num2, operator) {
  console.log(num1, num2, operator);
  const intResult =  operandFuncs[operator](num1, num2);
  prevEntry = intResult;
  const strResult = intResult.toFixed(4).replace(/\.?0+$/, '');
  display.textContent = strResult; 
}

  function fillDisplay(character) {
    display.textContent += `${character}`;
  }

function playSound() {
  keySound.src = keySounds[Math.floor(Math.random() * (keySounds.length))];
  // keySound.play();

  const audio = new Audio(keySounds[Math.floor(Math.random() * (keySounds.length))]);
  
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
  });

  if (audio.paused) {
    audio.play().catch(error => {
      // Handle any errors that occur during playback
      console.error('Error playing sound:', error);
    });
  } else {
  // If audio is already playing, reset the current time
  audio.currentTime = 0;
  }
}
  
  

function clearPress() {
  operatorArray.forEach((button) => button.classList.remove('toggleOperator'));
}

function initKeypad() {
  //add keypad functionality 

  operatorArray.forEach((item) => {
    item.addEventListener('click', (event) => {
      if (operator === null) { //no currently selected operator
        console.log('1');
        operator = event.target.textContent;
        num1 = parseFloat(display.textContent);
        event.target.classList.add('toggleOperator');
      }
      else if (operator == event.target.textContent){ //deselect current operator
        console.log('option2')
        event.target.classList.remove('toggleOperator');
        operator = null;
        num1 = null;
      }
      else { //select a different operator + deselect currently chosen one
        console.log("option3")
        clearPress();
        event.target.classList.add('toggleOperator');
        operator = event.target.textContent;
        }
      });
    });

  nonDigits.forEach((item) => {
    if (item.textContent != '.' && item.textContent !== '=') {
      item.style.backgroundColor = 'tan'
    };
  });

  digits.sort((a, b) => {
    if (parseFloat(a.textContent) > parseFloat(b.textContent)) {
      return 0;
    }
    return -1;
  });

  digits.forEach((digit, index) => {
    digit.addEventListener('click', (event) => {
      if (operator === null) {
        fillDisplay(event.target.textContent);
        console.log('fill display 1');
      }
       else {
        if (newEntryFlag) {
          display.textContent = '';
          newEntryFlag = false;
        }
        fillDisplay(event.target.textContent);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initKeypad());
clearButton.addEventListener('click', () => {
  display.textContent = ''
  operatorArray.forEach((button) => button.classList.remove('toggleOperator'));
  operator = null;
  num1 = null;
  num2 = null;
  display.textContent = '';
  newEntryFlag = true;  
});
equalsButton.addEventListener('click', () => {
  // const tokens = display.textContent.split(regex);
  // console.log(tokens);
  keySound.src = `./keynoises/Enter Key.m4a`
  keySound.play();

  num2 = parseFloat(display.textContent);
  operatorArray.forEach((button) => button.classList.remove('toggleOperator'));
  operate(num1, num2, operator);
  num1 = num2 = operator = null;
  newEntryFlag = true;
});

deleteButton.addEventListener('click', () => {
  newContent = display.textContent.slice(0, -1);
  display.textContent = newContent;
});