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

let items = document.querySelectorAll(".pets__items");
let currentItem = 0;
let isEnabled = true;

function changeCurrentItem(n) {
  currentItem = (n + items.length) % items.length;
}

function hideItem(direction) {
  isEnabled = false;
  items[currentItem].classList.add(direction);
  items[currentItem].addEventListener("animationend", function () {
    this.classList.remove("activeslide", direction);
  });
}

function showItem(direction) {
  items[currentItem].classList.add("nextslide", direction);
  items[currentItem].addEventListener("animationend", function () {
    this.classList.remove("nextslide", direction);
    this.classList.add("activeslide");
    isEnabled = true;
  });
}

function nextItem(n) {
  hideItem("to-left");
  changeCurrentItem(n + 1);
  showItem("from-right");
}

function previousItem(n) {
  hideItem("to-right");
  changeCurrentItem(n - 1);
  showItem("from-left");
}

const btnleft = document
  .querySelector(".prew")
  .addEventListener("click", function () {
    if (isEnabled) {
      previousItem(currentItem);
    }
    changeCurrentItem(currentItem);
  });

const btnright = document
  .querySelector(".next")
  .addEventListener("click", function () {
    if (isEnabled) {
      nextItem(currentItem);
    }
    changeCurrentItem(currentItem);
  });

const slideItem = document.querySelectorAll(".slideitem");
console.log(slideItem);

/*------testimonials slider-----*/

const testimonialsslide = document.querySelector(".scrollfortes");

const testimonials = document.querySelector(".testimonials__items");

function slidingTestimonials() {
  if (window.matchMedia("(min-width: 1440px)").matches) {
    switch (testimonialsslide.value) {
      case "0":
        testimonials.style.left = "0";
        break;
      case "1":
        testimonials.style.left = "-297px";
        break;
      case "2":
        testimonials.style.left = "-594px";
        break;
      case "3":
        testimonials.style.left = "-891px";
        break;
      case "4":
        testimonials.style.left = "-1188px";
        break;
      case "5":
        testimonials.style.left = "-1486px";
        break;
      case "6":
        testimonials.style.left = "-1783px";
        break;
      case "7":
        testimonials.style.left = "-2080px";
        break;
    }
  } else {
    switch (testimonialsslide.value) {
      case "0":
        testimonials.style.left = "0";
        break;
      case "1":
        testimonials.style.left = "-323px";
        break;
      case "2":
        testimonials.style.left = "-646px";
        break;
      case "3":
        testimonials.style.left = "-969px";
        break;
      case "4":
        testimonials.style.left = "-1292px";
        break;
      case "5":
        testimonials.style.left = "-1615px";
        break;
      case "6":
        testimonials.style.left = "-1938px";
        break;
      case "7":
        testimonials.style.left = "-2261px";
        break;
    }
  }
}
testimonialsslide.addEventListener("input", slidingTestimonials);
const popup = document.querySelector(".popup");
const popupBody = document.querySelector(".popup__body");
const popupClose = document.querySelector(".popup__close");

testimonials.addEventListener("click", function (event) {
  const testimonial = event.target.closest(".testimonials__item");
  if (testimonial) {
    testimonial.classList.add("open");
    popup.classList.add("open");
  }

  popupClose.onclick = () => {
    testimonial.classList.remove("open");
    popup.classList.remove("open");
  };

  popupBody.onclick = () => {
    testimonial.classList.remove("open");
    popup.classList.remove("open");
  };

  popup.onclick = () => {
    testimonial.classList.remove("open");
    popup.classList.remove("open");
  };
});
