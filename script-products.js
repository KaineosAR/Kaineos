// ---------------Evento: Interacción dinámica con el logo de Kaineos---------------
const logoKaineos = document.getElementById("logo-kaineos");
logoKaineos.addEventListener("mousemove", (event) => {
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
});

logoKaineos.addEventListener("mouseout", () => {
  logoKaineos.style.transform =
    "perspective(500px) scale(1) rotateX(0deg) rotateY(0deg)"; // Reseteo la transformacion al salir del logo
  logoKaineos.style.setProperty("--shadow-x", `0px`);
  logoKaineos.style.setProperty("--shadow-y", `0px`);
  logoKaineos.style.setProperty("--shadow-diffusion", `0rem`);
});

// ---------------Evento: Selector de imagen activa de producto---------------

const imageNoSelected = document.querySelectorAll(".image-inactive");
const imageSelected = document.getElementById("product-image-selected");
imageNoSelected.forEach((image) => {
  image.addEventListener("click", (event) => {
    const target = event.target;
    const imageSrc = target.getAttribute("src");
    imageSelected.setAttribute("src", imageSrc);
  });
});

// ---------------Evento: Zoom interactivo sobre imagen de producto---------------

const imageContainer = document.getElementById("product-box-image-selected"); // Contenedor donde esta la imagen seleccionada
const image = document.getElementById("product-image-selected"); // Imagen seleccionada
const hint = document.querySelector(".zoom-cursor-hint"); // Recuadro que sigue al cursor, "lupa"
const displayBox = document.querySelector(".zoom-display-box"); // Caja externa que muestra lo que la "lupa" ve

imageContainer.addEventListener("mouseenter", () => {
  // Al entrar, mostramos la pista y la caja de zoom
  hint.style.display = "block";
  displayBox.style.display = "block";
});

imageContainer.addEventListener("mouseleave", () => {
  // Al salir, los ocultamos
  hint.style.display = "none";
  displayBox.style.display = "none";
});

imageContainer.addEventListener("mousemove", (e) => {
  // 1. Obtenemos las dimensiones necesarias de la imagen seleccionada, la "lupa" y la caja externa
  const rect = image.getBoundingClientRect();
  const imageWidth = image.offsetWidth;
  const imageHeight = image.offsetHeight;
  const hintWidth = hint.offsetWidth;
  const hintHeight = hint.offsetHeight;

  // 2. Calculamos la posición del cursor relativa a la imagen
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // 3. Calculamos la posición ideal del recuadro gris (hint)
  let hintX = x - hintWidth / 2;
  let hintY = y - hintHeight / 2;

  // 4. **La clave:** Restringimos la posición del recuadro para que no se salga de la imagen
  hintX = Math.max(0, Math.min(hintX, imageWidth - hintWidth));
  hintY = Math.max(0, Math.min(hintY, imageHeight - hintHeight));

  // 5. Aplicamos la posición ya restringida al recuadro
  hint.style.left = `${hintX}px`;
  hint.style.top = `${hintY}px`;

  // 6. Configuramos y movemos el fondo de la caja de zoom basándonos en la posición restringida
  const ratioX = displayBox.offsetWidth / hintWidth;
  const ratioY = displayBox.offsetHeight / hintHeight;
  displayBox.style.backgroundImage = `url(${image.src})`;
  displayBox.style.backgroundSize = `${imageWidth * ratioX}px ${
    imageHeight * ratioY
  }px`;
  const bgPosX = -(hintX * ratioX);
  const bgPosY = -(hintY * ratioY);
  displayBox.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
});
