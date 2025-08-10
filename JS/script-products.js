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
  const rect = image.getBoundingClientRect(); // Obtengo la ubicacion de la imagen seleccionada
  const imageWidth = image.offsetWidth; // El ancho de la imagen seleccionada
  const imageHeight = image.offsetHeight; // El alto de la imagen seleccionada
  const hintWidth = hint.offsetWidth; // El ancho de la "lupa"
  const hintHeight = hint.offsetHeight; // El alto de la "lupa"

  // 2. Calculamos la posición del cursor relativa a la imagen
  const x = e.clientX - rect.left; // Obtengo la ubicacion horizontal al respecto de la pagina, pero le resto la ubicacion horizontal de la imagen seleccionada para que sea relativa a ella
  const y = e.clientY - rect.top; // Obtengo la ubicacion vertical al respecto de la pagina, pero le resto la ubicacion vertical de la imagen seleccionada para que sea relativa a ella

  // 3. Calculamos la posición ideal del recuadro gris (hint)
  let hintX = x - hintWidth / 2; // Divido el ancho de la "lupa" por 2 y se lo resto a la ubicacion horizontal del cursor para que quede centrado
  let hintY = y - hintHeight / 2; // Divido el alto de la "lupa" por 2 y se lo resto a la ubicacion alto del cursor para que quede centrado

  // 4. **La clave:** Restringimos la posición del recuadro para que no se salga de la imagen
  hintX = Math.max(0, Math.min(hintX, imageWidth - hintWidth));
  hintY = Math.max(0, Math.min(hintY, imageHeight - hintHeight));
  // Yo
  // El HintX/Y interno llama a la variable superior
  // imageHeight - hintHeight/imageHeight - hintHeight le pone un limite invisible al borde izquierdo superior, para que el borde derecho inferior no salga de la imagen. Si no se hace la resta, la caja podra salir de la imagen.

  // Gemini
  // Se usa Math.min para poner un tope MÁXIMO (el recuadro no puede ir más a la derecha que 'imageWidth - hintWidth').
  // Se usa Math.max para poner un tope MÍNIMO (el recuadro no puede ir más a la izquierda que 0).
  // La resta (imageWidth - hintWidth) calcula la posición 'left' máxima que puede tener la esquina del recuadro para que su borde derecho no se salga de la imagen. Lo mismo para height.

  // 5. Aplicamos la posición ya restringida al recuadro
  hint.style.left = `${hintX}px`; // Se mueve la lupa horizontalmente
  hint.style.top = `${hintY}px`; // Se mueve la lupa verticalmente

  // 6. Configuramos y movemos el fondo de la caja de zoom basándonos en la posición restringida
  const ratioX = displayBox.offsetWidth / hintWidth; // Se calcula cuanto mas grande, horizontalmente, es la caja externa que la lupa
  const ratioY = displayBox.offsetHeight / hintHeight; // Se calcula cuanto mas grande, verticalmente, es la caja externa que la lupa
  displayBox.style.backgroundImage = `url(${image.src})`; // Se pone la imagen seleccionada en la caja externa
  displayBox.style.backgroundSize = `${imageWidth * ratioX}px ${
    imageHeight * ratioY
  }px`; // Agrando la imagen la cantidad de veces que la caja es mas grande que la lupa
  const bgPosX = -(hintX * ratioX); // Se multiplica la ubicacion horizontal por el radio para que la posicion de la lupa y la caja externa coincidan. Despues, se pasa el numero a negativo para mover la imagen de manera contraria al cursor para hacer que se mueva
  const bgPosY = -(hintY * ratioY); // Se multiplica la ubicacion vertical por el radio para que la posicion de la lupa y la caja externa coincidan. Despues, se pasa el numero a negativo para mover la imagen de manera contraria al cursor para hacer que se mueva
  displayBox.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`; // Se mueve la imagen de fondo dentro de la caja para que coincida con la lupa
});
