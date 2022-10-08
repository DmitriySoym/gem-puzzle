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

/*-----slider pets-----*/
