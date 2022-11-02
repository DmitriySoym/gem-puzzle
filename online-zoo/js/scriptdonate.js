/*----menu burger------*/

const menuBurgerActive = document.querySelector(".burgermenu");

const naveActive = document.querySelector(".nav");

const headerLogo = document.querySelector(".header__logo");

const headerwrapper = document.querySelector(".headerwrapper");

const designedby = document.querySelector(".designedby");

const burgermenuback = document.querySelector(".burgermenu-back");

menuBurgerActive.addEventListener("click", function () {
  menuBurgerActive.classList.toggle("active");

  designedby.classList.toggle("active");

  naveActive.classList.toggle("active");

  headerLogo.classList.toggle("active");

  headerwrapper.classList.toggle("active");

  burgermenuback.classList.toggle("active");
});

burgermenuback.addEventListener("click", function () {
  if (burgermenuback.classList.contains("active")) {
    burgermenuback.classList.remove("active");

    menuBurgerActive.classList.remove("active");

    designedby.classList.remove("active");

    naveActive.classList.remove("active");

    headerLogo.classList.remove("active");

    headerwrapper.classList.remove("active");
  }
});

/*- donate-- */

const moneySum = document.querySelector(".moneysum");
moneySum.value = 100;

const amount = document.getElementsByName("donate_amount");
console.log(amount);
amount.forEach((el) => {
  el.addEventListener("click", function () {
    moneySum.value = el.value;
  });
});

const min = +amount.min;
const max = +amount.max;

moneySum.addEventListener("input", function () {
  if (moneySum.value > max) {
    moneySum.value = max;
  } else if (moneySum.value < min) {
    moneySum.value = min;
  }

  if (moneySum.value === "25") {
    amount[7].checked = true;
  } else if (moneySum.value === "50") {
    amount[6].checked = true;
  } else if (moneySum.value === "100") {
    amount[5].checked = true;
  } else if (moneySum.value === "250") {
    amount[4].checked = true;
  } else if (moneySum.value === "500") {
    amount[3].checked = true;
  } else if (moneySum.value === "1000") {
    amount[2].checked = true;
  } else if (moneySum.value === "2000") {
    amount[1].checked = true;
  } else if (moneySum.value === "5000") {
    amount[0].checked = true;
  } else {
    amount[7].checked = false;
    amount[6].checked = false;
    amount[5].checked = false;
    amount[4].checked = false;
    amount[3].checked = false;
    amountm[2].checked = false;
    amount[1].checked = false;
    amount[0].checked = false;
  }
});
