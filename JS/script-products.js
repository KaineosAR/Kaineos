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

// ---------------Evento: Zoom interactivo sobre imagen de producto---------------
const imageContainer = document.getElementById("product-box-image-selected"); // Contenedor donde esta la imagen seleccionada
const image = document.getElementById("product-image-selected"); // Imagen seleccionada
const hint = document.querySelector(".zoom-cursor-hint"); // Recuadro que sigue al cursor, "lupa"
const displayBox = document.querySelector(".zoom-display-box"); // Caja externa que muestra lo que la "lupa" ve

// 1. Encapsulamos la lógica en funciones con nombre
const handleZoomMouseEnter = () => {
  // Al entrar, mostramos la pista y la caja de zoom
  hint.style.display = "block";
  displayBox.style.display = "block";
};
const handleZoomMouseLeave = () => {
  // Al salir, los ocultamos
  hint.style.display = "none";
  displayBox.style.display = "none";
};
const handleZoomMouseMove = (e) => {
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
};

// 2. Creamos la lógica para detectar la capacidad de hover
const zoomHoverQuery = window.matchMedia("(hover: hover)");
const handleZoomHoverChange = (event) => {
  if (event.matches) {
    // Si el dispositivo puede hacer hover, añadimos los eventos de zoom
    imageContainer.addEventListener("mouseenter", handleZoomMouseEnter);
    imageContainer.addEventListener("mouseleave", handleZoomMouseLeave);
    imageContainer.addEventListener("mousemove", handleZoomMouseMove);
  } else {
    // Si no, los quitamos para que no interfieran en móvil
    imageContainer.removeEventListener("mouseenter", handleZoomMouseEnter);
    imageContainer.removeEventListener("mouseleave", handleZoomMouseLeave);
    imageContainer.removeEventListener("mousemove", handleZoomMouseMove);
    // Y nos aseguramos de que todo esté oculto por si acaso
    handleZoomMouseLeave();
  }
};

// 3. Ejecutamos la comprobación al cargar la página y cuando cambie la capacidad de hover
zoomHoverQuery.addEventListener("change", handleZoomHoverChange);
handleZoomHoverChange(zoomHoverQuery);

// ---------------Evento: Pagination dots---------------
// --- 1. Conocer la cantidad de imágenes y agarrar los elementos ---
const mainImage = document.getElementById("product-image-selected");
const thumbnails = document.querySelectorAll(".image-inactive");
const paginationDots = document.querySelectorAll(".pagination-dot");
const imageCounter = document.getElementById("image-counter");
const totalImages = thumbnails.length;

// Una variable para recordar siempre en qué imagen estamos.
let currentImageIndex = 0;

// --- 2. La función "cerebro" que actualiza todo ---
// Esta función centraliza toda la lógica. Le dices a qué imagen ir, y ella se encarga de todo.
function updateGallery(newIndex) {
  // newIndex es el índice de la imagen a la que queremos ir
  if (newIndex === currentImageIndex) return; // No hacer nada si es la misma imagen
  const isMobileView =
    !window.matchMedia("(hover: hover)").matches && window.innerWidth < 1000;
  if (isMobileView) {
    // --- Lógica de deslizamiento para la vista móvil ---
    const oldIndex = currentImageIndex;
    const direction =
      newIndex > oldIndex || (newIndex === 0 && oldIndex === totalImages - 1)
        ? 1
        : -1;
    const transitionDuration = 300; // Volvemos a una transición más suave

    mainImage.style.transition = `transform ${
      transitionDuration / 1000
    }s ease-in-out`;
    mainImage.style.transform = `translateX(${-direction * 100}%)`;
    // El setTimeout() es necesario para que el cambio no sea inmediato, sino que dure un tiempo
    setTimeout(() => {
      mainImage.style.transition = "none";
      mainImage.src = thumbnails[newIndex].src;
      mainImage.style.transform = `translateX(${direction * 100}%)`;
      mainImage.offsetWidth; // Forzamos un "reflow" para que el navegador registre la nueva posición
      mainImage.style.transition = `transform ${
        transitionDuration / 1000
      }s ease-in-out`;
      mainImage.style.transform = "translateX(0)";
    }, transitionDuration);
  } else {
    // --- Lógica de cambio instantáneo para la vista de escritorio ---
    mainImage.src = thumbnails[newIndex].src;
  }

  // --- Actualizaciones comunes para ambas vistas ---
  // B. Actualizar el contador
  imageCounter.textContent = `${newIndex + 1}/${totalImages}`;

  // C. Actualizar los puntos de paginación
  paginationDots.forEach((dot) => {
    dot.classList.remove("active");
  });
  if (paginationDots[newIndex]) {
    paginationDots[newIndex].classList.add("active");
  }

  // D. Actualizar la miniatura activa
  thumbnails.forEach((thumb) => {
    thumb.classList.remove("active");
  });
  if (thumbnails[newIndex]) {
    thumbnails[newIndex].classList.add("active");
  }

  // Actualizamos nuestra variable de estado.
  currentImageIndex = newIndex;
}

// --- 3. Añadir los eventos a las miniaturas y los puntos ---
// Hacemos que las miniaturas llamen a nuestra función "cerebro".
thumbnails.forEach((thumbnail, index) => {
  // Cambiamos "click" por "mouseenter" para que la imagen cambie al pasar el cursor por encima.
  thumbnail.addEventListener("mouseenter", () => {
    updateGallery(index);
  });
});

// Hacemos que los puntos también llamen a nuestra función "cerebro".
paginationDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    updateGallery(index);
  });
});

// --- 5. Lógica de Swipe para la imagen principal (móvil) ---
const mainImageContainer = document.getElementById(
  "product-box-image-selected"
);
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const swipeThreshold = 50; // Distancia mínima en píxeles para considerar un swipe
  const distance = touchStartX - touchEndX;

  if (distance > swipeThreshold) {
    const nextIndex = (currentImageIndex + 1) % totalImages;
    updateGallery(nextIndex);
  } else if (distance < -swipeThreshold) {
    const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
    updateGallery(prevIndex);
  }
};

function setupSwipeListeners() {
  const isMobileView =
    !window.matchMedia("(hover: hover)").matches && window.innerWidth < 1000;
  if (isMobileView) {
    mainImageContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    mainImageContainer.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
  } else {
    mainImageContainer.removeEventListener("touchstart", handleTouchStart);
    mainImageContainer.removeEventListener("touchend", handleTouchEnd);
  }
}

// ---------------Evento: Inicializar en 0 todo---------------
document.addEventListener("DOMContentLoaded", () => {
  // 1. Se establece el estado inicial de la galería sin animaciones.
  mainImage.src = thumbnails[0].src;
  if (paginationDots[0]) paginationDots[0].classList.add("active");
  if (thumbnails[0]) thumbnails[0].classList.add("active");
  imageCounter.textContent = `1/${totalImages}`;
  currentImageIndex = 0;

  // 2. Se configuran los listeners de swipe y se añade un listener para el redimensionamiento.
  // Esto asegura que la funcionalidad de swipe se active/desactive si el usuario cambia el tamaño de la ventana.
  setupSwipeListeners();
  window.addEventListener("resize", setupSwipeListeners);
});

// ---------------Evento: Modal(caja expandida de imagen)---------------
// Seleccionamos todos los elementos del modal que acabamos de crear
const modal = document.getElementById("fullscreen-modal");
const modalImage = document.getElementById("modal-image");
const modalCounter = document.getElementById("modal-image-counter");
const closeModalBtn = document.getElementById("modal-close-btn");
const prevModalBtn = document.getElementById("modal-prev-btn");
const nextModalBtn = document.getElementById("modal-next-btn");

// Función para abrir el modal
function openModal(index) {
  modal.classList.remove("hidden");
  updateModalContent(index);
  document.body.style.overflow = "hidden"; // Evita que se haga scroll en la página de fondo
}

// Función para cerrar el modal
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = ""; // Restaura el scroll
}

// Función para actualizar el contenido del modal (imagen y contador)
function updateModalContent(index) {
  // Esta función solo actualiza lo visual del modal, no el estado.
  modalImage.src = thumbnails[index].src;
  modalCounter.textContent = `${index + 1}/${totalImages}`;
}

// Función para mostrar la imagen siguiente
function showNextImage() {
  // Usamos el operador de módulo (%) para crear un bucle infinito
  // Gemini: El "bucle infinito" significa que, gracias al operador módulo (%), el resultado de la operación siempre estará dentro del rango de índices válidos (de 0 a 5 en nuestro ejemplo). Nunca se pasará de largo ni dará un número negativo, creando un ciclo perfecto y sin fin para tu galería.
  const nextIndex = (currentImageIndex + 1) % totalImages;
  updateGallery(nextIndex); // 1. Actualizamos la galería principal (que actualiza el estado)
  updateModalContent(nextIndex); // 2. Y luego actualizamos el modal para que coincida
}

// Función para mostrar la imagen anterior
function showPrevImage() {
  const prevIndex = (currentImageIndex - 1 + totalImages) % totalImages;
  // Gemini: + totalImages es un "truco de seguridad" matemático para evitar índices negativos cuando vas hacia atrás desde la primera imagen. Se asegura de que el número que entra al operador % sea siempre positivo, garantizando que el bucle funcione perfectamente en ambas direcciones. Para la navegación "hacia adelante", no tiene ningún efecto práctico, pero para la navegación "hacia atrás desde el inicio", es absolutamente esencial.
  updateGallery(prevIndex); // 1. Actualizamos la galería principal (que actualiza el estado)
  updateModalContent(prevIndex); // 2. Y luego actualizamos el modal para que coincida
}

// ---------------Evento: Abrir y cerrar el modal (caja expandida de imagen)---------------
// Abrir el modal al hacer clic en la imagen principal
mainImage.addEventListener("click", () => {
  openModal(currentImageIndex);
});

// Cerrar el modal con el botón 'X'
closeModalBtn.addEventListener("click", closeModal);

// Cerrar el modal al hacer clic fuera de la imagen (solo en dispositivos con hover)
modal.addEventListener("click", (event) => {
  const canHover = window.matchMedia("(hover: hover)").matches;
  if (!canHover) return; // Esta lógica no se aplica en dispositivos táctiles
  // Si el clic fue sobre la imagen o un control, no hacemos nada.
  // Dejamos que sus propios eventos (si los tienen) se encarguen.
  if (
    event.target.closest("#modal-image") ||
    event.target.closest(".modal-control")
  ) {
    return;
  } else {
    // Si la condición anterior es falsa (el clic fue en el fondo),
    // entonces ejecutamos la lógica para cerrar el modal.
    closeModal();
  }
});

// ---------------Evento: Navegacion con el teclado---------------
nextModalBtn.addEventListener("click", showNextImage);
prevModalBtn.addEventListener("click", showPrevImage);
// ArrowRight/Left y Escape son estandares W3C
document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("hidden")) {
    // Solo si el modal está abierto
    if (event.key === "ArrowRight") {
      showNextImage();
    } else if (event.key === "ArrowLeft") {
      showPrevImage();
    } else if (event.key === "Escape") {
      closeModal();
    }
  }
});
