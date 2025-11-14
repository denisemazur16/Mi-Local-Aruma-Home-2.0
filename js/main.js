document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".btnHamburguesa");
    const nav = document.querySelector("header nav");
    const links = nav ? nav.querySelectorAll("a") : [];
  
    if (btn && nav) {
      btn.addEventListener("click", () => {
        nav.classList.toggle("nav--abierta");
        btn.setAttribute("aria-expanded", nav.classList.contains("nav--abierta") ? "true" : "false");
      });
    }
  
    links.forEach((a) =>
      a.addEventListener("click", () => {
        if (nav.classList.contains("nav--abierta")) {
          nav.classList.remove("nav--abierta");
          btn && btn.setAttribute("aria-expanded", "false");
        }
      })
    );
  
    const header = document.querySelector("header");
    const toggleHeaderShadow = () => {
      if (!header) return;
      if (window.scrollY > 10) header.classList.add("header--scrolled");
      else header.classList.remove("header--scrolled");
    };
    toggleHeaderShadow();
    window.addEventListener("scroll", toggleHeaderShadow);
  
    const path = location.pathname.split("/").pop();
    links.forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("link-activo");
      }
    });
  });

function validateform(){
  const nombre = document.getElementById("fname").value
  const apellido = document.getElementById("lname").value
  const email = document.getElementById("mail").value
  const celular = document.getElementById("numero").value
  const comentarios = document.getElementById("coment").value

  if(!nombre || nombre.length < 3){
    alert("El nombre ingresado no es válido")
    return false
  }

  if(!apellido || apellido.length < 3){
    alert("El apellido ingresado no es válido")
    return false
  }

  if(!email || email.length < 3){
    alert("El mail ingresado no es válido")
    return false
  }
  
  if(!celular || celular.length < 10){
    alert("El número de celular ingresado no es válido")
    return false
  }

  return true
}
