// ---------------Evento: Interacción dinámica con el logo de Kaineos---------------
const logoKaineos = document.getElementById("logo-kaineos");
// Funcion para hacer el evento
const handleLogoMouseMove = (event) => {
  const shadowFactor = 0.4; // Factor de desplazamiento de sombra, cuanto más alto, más se aleja del objeto
  const logoHeight = logoKaineos.clientHeight; // Agarro el height del logo dentro del evento para que no se rompa si cambia el tamaño de la ventana
  const logoWidth = logoKaineos.clientWidth; // Agarro el width del logo dentro del evento para que no se rompa si cambia el tamaño de la ventana
  const { layerX, layerY } = event; // Agarro las coordenadas del mouse dentro del logo
  // rotateY() → rota el elemento alrededor del eje Y (vertical), lo que produce un giro visual horizontal.
  // rotateX() → rota alrededor del eje X (horizontal), lo que genera un giro vertical.
  const yRotation = ((layerX - logoWidth / 2) / logoWidth) * 30;
  // logoWidth / 2 se calcula el centro horizontal del logo
  // layerX - logoWidth / 2 se calcula la distancia del mouse al centro horizontal del logo
  // / logoWidth // Se normaliza entre -0.5 y 0.5 en relación al ancho del logo, luego se multiplica por 30 para obtener grados de rotación
  // - es negativo, o sea, es a la izquierda. Si es positivo, es a la derecha
  // Lo mismo para el eje Y, pero con layerY y logoHeight
  const xRotation = ((layerY - logoHeight / 2) / logoHeight) * -30;
  const shadowX = yRotation * -1 * shadowFactor; // Multiplico por -1 para que la sombra se mueva en la dirección opuesta al mouse
  const shadowY = xRotation * 1 * shadowFactor; // Multiplico por 1 para que la sombra se mueva en la dirección del mouse
  const string = `perspective(500px) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
  logoKaineos.style.transform = string; // Aplico la transformacion al logo, le paso la variable al CSS
  logoKaineos.style.setProperty("--shadow-x", `${shadowX}px`);
  logoKaineos.style.setProperty("--shadow-y", `${shadowY}px`);
  logoKaineos.style.setProperty("--shadow-diffusion", `1rem`);
};
// Funcion para cerrar el evento
const handleLogoMouseOut = () => {
  logoKaineos.style.transform =
    "perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)"; // Reseteo la transformacion al salir del logo
  logoKaineos.style.setProperty("--shadow-x", `0px`);
  logoKaineos.style.setProperty("--shadow-y", `0px`);
  logoKaineos.style.setProperty("--shadow-diffusion", `0rem`);
};
// Creamos un objeto media query para detectar la capacidad de hover. Tiene 1 valor, o true o false, ¿A que corresponde? A si puede o no hacer hover.
const hoverQuery = window.matchMedia("(hover: hover)");
// Creamos una función que decide si AÑADIR o QUITAR el evento dependiendo de si puede o no hacer hover
const handleHoverChange = (event) => {
  if (event.matches) {
    // Si puede hacer hover, se añade el evento
    logoKaineos.addEventListener("mousemove", handleLogoMouseMove);
    logoKaineos.addEventListener("mouseout", handleLogoMouseOut);
  } else {
    // Si no puede hacer hover, se quita el evento
    logoKaineos.removeEventListener("mousemove", handleLogoMouseMove);
    logoKaineos.removeEventListener("mouseout", handleLogoMouseOut);
    // Reseteamos el estilo por si acaso quedó "pegado" de una vista anterior, recomendado por Gemini
    handleLogoMouseOut();
  }
};
// Añadimos un listener que se dispara solo cuando la capacidad de hover cambia. Le dice a hoverQuery que cuando cambie de estado le avise.
// El addEventListener le dice a hoverQuery "Avisame cuando tu estado cambie de true a false o viceversa. ¿Cambiaste? Bueno, llamo a la funcion para que ella te pregunte tu estado nuevamente y cambie el estado.
hoverQuery.addEventListener("change", handleHoverChange);
// Ejecutamos la funcion una vez al cargar la página para establecer el estado inicial. if (event.matches) se convierte en if (hoverQuery.matches).
// Abro la pagina y mando hoverQuery a handleHoverChange. En la funcion le preguntan con matches, ¿Podes? ¿Si?, bueno, activa los cambios. ¿No podes? Bueno, lo dejamos todo como esta. 
handleHoverChange(hoverQuery);

// ---------------Evento: Navegación interna ajustada con compensación del header fijo---------------
document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  // Seleccionamos todos los enlaces del nav que apunten a secciones internas (href que empiece con "#")
  link.addEventListener("click", (event) => {
    // A cada uno le agregamos un evento al hacer clic
    event.preventDefault();
    // Cancelamos el comportamiento por defecto del navegador (el salto automático)
    const targetID = link.getAttribute("href").slice(1);
    // Obtenemos el ID del destino, quitando el "#". Ejemplo: "#product" → "product"
    const target = document.getElementById(targetID);
    // Buscamos el elemento con ese ID en el documento
    const headerHeight = document.querySelector("header").offsetHeight;
    // Calculamos la altura del header fijo en píxeles
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    // Calculamos la posición real del destino, restando la altura del header
    /*target.getBoundingClientRect().top: Obtiene la distancia (en píxeles) desde el borde superior del viewport (pantalla visible) hasta el elemento destino (target).
      window.pageYOffset: Devuelve la cantidad de píxeles que la página ya ha sido desplazada desde arriba.
      headerHeight: Se refiere a la altura del header fijo.*/
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
    // Realizamos el scroll manualmente hasta la posición ajustada, con efecto suave
  });
});

// ---------------Evento: Despliegue y repliegue del nav---------------
const menuButton = document.getElementById("button-menu");
const openMenu = document.getElementById("open-menu");
const closeMenu = document.getElementById("close-menu");
const navLinks = document.getElementById("nav-links");
const allLinksInMenu = document.querySelectorAll("#nav-links li a");
function openOrCloseMenu() {
  menuButton.classList.toggle("button-menu-pasive");
  menuButton.classList.toggle("button-menu-active");
  openMenu.classList.toggle("menu-switch");
  closeMenu.classList.toggle("menu-switch");
  navLinks.classList.toggle("nav-links-open");
  navLinks.classList.toggle("nav-links-close");
}
// Me lo pidio Gemini, segun el es "Programacion defensiva"
const closeAll = () => {
  if (navLinks.classList.contains("nav-links-open")) {
    openOrCloseMenu();
  }
};
menuButton.addEventListener("click", () => {
  openOrCloseMenu();
});
allLinksInMenu.forEach((link) => {
  link.addEventListener("click", () => {
    closeAll();
  });
});
