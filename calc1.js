const inp = document.querySelector("input"),
  div_btns = document.querySelector(".buttons_div");

let stringToCalc = "";

div_btns.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (stringToCalc == "") {
      cleanInput();
    }

    inp.value += btn.textContent;
    inp.value = checkInput(inp.value);
    stringToCalc = inp.value;

    if (btn.textContent == "=") {
      //Формирование строки для расчётов
      stringToCalc = stringToCalc
        .replace(/(\+|\-|\*|\/)/g, (op) => (op = " " + op + " ")) //обернуть знаки пробелами для функции
        .replace(/(\s(\*|\/|\+|\-)\s$|\-$)/g, ""); //не учитывать знак.если он в конце строки и дальше числа нет
      inp.value = calcFromStr(stringToCalc);
      stringToCalc = "";
    } else if (btn.textContent == "C") {
      cleanInput();
    }
  });
});

function cleanInput() {
  inp.value = stringToCalc = "";
}

function checkInput(str) {
  if (str.length < 30) {
    return str // Замены:
      .replace(/\d{6,}/g, (num) => num.slice(0, 6)) //ограничить число 6 знаками
      .replace(/^((\*|\/|\+|\-|0))/g, "") //не начинается со знака * / + 0 -
      .replace(/(\+|\-|\*|\/)+/g, (op) => op.slice(0, 1)) //нельзя ввести более 1 знакa
      .replace(/(\+|\-|\*|\/)0\d/g, (num) => num.slice(0, 1) + num.slice(2)) //число не может начинаться с 0
      .replace(/=/g, "");
  } else {
    return str.slice(0, 30);
  }
}

function calcFromStr(strToCalc) {
  let arrToCalc = strToCalc.split(" ");
  function calc(operation, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == operation) {
        let mult;
        let prev = +arr[i - 1];
        let next = +arr[i + 1];
        let local_math = {
          "+": (a, b) => +a + +b,
          "-": (a, b) => +a - +b,
          "*": (a, b) => +a * +b,
          "/": (a, b) => {
            if (b == 0) {
              arr[0] = "На ноль делить нельзя!";
              return arr;
            }
            return +a / +b;
          },
        };
        mult = local_math[operation](prev, next);
        if (arr[0] != "На ноль делить нельзя!") {
          arr.splice(i - 1, 2);
          arr[i - 1] = "" + mult;
        }
      }
    }
    return arr;
  }
  function makeOperation(regexp, str, arr) {
    if (strToCalc.match(regexp)) {
      str.match(regexp).forEach((op) => {
        arr.forEach((elem) => {
          if (elem == op && arr.length > 1) {
            calc(elem, arr);
          }
        });
      });
    }
  }
  makeOperation(/\*|\//g, strToCalc, arrToCalc);
  makeOperation(/\+|\-/g, strToCalc, arrToCalc);
  let res = +arrToCalc[0];
  if (isNaN(res)) {
    res = arrToCalc[0];
    return res;
  } else {
    res = ("" + res.toFixed(2)).replace(/\.00|0$/g, ""); //Чтоб не было результата как 1.00
    return res;
  }
}
