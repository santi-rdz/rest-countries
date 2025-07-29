const themeBtn = document.querySelector(".themeBtn");

let isDark = localStorage.getItem("isDark") || false;
if (isDark === "true") document.body.classList.add("dark");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  isDark = document.body.classList.contains("dark");
  localStorage.setItem("isDark", isDark);
});
