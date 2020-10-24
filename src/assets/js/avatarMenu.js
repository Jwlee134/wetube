const avatar = document.querySelector(".header-avatar");
const menu = document.querySelector(".header__menu");

const hideMenu = () => {
  menu.classList.remove("show");
  avatar.classList.remove("shadow");
  menu.classList.add("hide");
  avatar.removeEventListener("click", hideMenu);
  avatar.addEventListener("click", showMenu);
};

const showMenu = () => {
  menu.classList.remove("hide");
  menu.classList.add("show");
  avatar.classList.add("shadow");
  avatar.removeEventListener("click", showMenu);
  avatar.addEventListener("click", hideMenu);
  document.addEventListener("click", (event) => {
    if (event.target.id !== "avatar" && event.target.id !== "content") {
      menu.classList.add("hide");
      avatar.classList.remove("shadow");
      avatar.addEventListener("click", showMenu);
    }
  });
};

const init = () => {
  avatar.addEventListener("click", showMenu);
};
init();
