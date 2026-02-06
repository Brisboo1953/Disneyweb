//agarrar la apiii//
const BASE_URL = "https://api.disneyapi.dev/character";
let errores = 0;
const MAX_ERRORES = 4;
let circuitoA = false;


function mostrarLoader(mostrar) {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = mostrar ? "block" : "none";
  }
}

function mostrarError(mensaje) {
  const errorDiv = document.getElementById("error");
  if (errorDiv) {
    errorDiv.textContent = mensaje;
  }
}

function limpiarError() {
  const errorDiv = document.getElementById("error");
  if (errorDiv) {
    errorDiv.textContent = "";
  }
}

function renderCharacters(personajes) {
  const container = document.getElementById("results");
  if (!container) return;

  container.innerHTML = "";

  if (personajes.length === 0) {
    container.innerHTML = "<p>No se encontraron personajes.</p>";
    return;
  }

  personajes.forEach(personaje => {
    const imagen = personaje.imageUrl
      ? personaje.imageUrl
      : "https://via.placeholder.com/300x400?text=Disney";

    container.innerHTML += `
      <div class="card">
        <img src="${imagen}" alt="${personaje.name}">
        <h3>${personaje.name}</h3>
      </div>
    `;
  });
}

//apiiiii calll//
async function fetchCharacters(page) {
  if (!navigator.onLine) {
    throw new Error("Sin conexión a internet");
  }

  const response = await fetch(`${BASE_URL}?page=${page}`);

  if (!response.ok) {
    throw new Error("Error al consultar la API");
  }

  return await response.json();
}

//randommmm//
async function loadRandomCharacters() {
  try {
    limpiarError();
    mostrarLoader(true);

    const randomPage = Math.floor(Math.random() * 20) + 1;
    const data = await fetchCharacters(randomPage);

    renderCharacters(data.data.slice(0, 14));
  } catch (error) {
    mostrarError("No se pudieron cargar los personajes");
    console.error(error);
  } finally {
    mostrarLoader(false);
  }
}

async function fetchCharacters(page, intentos = 2) {
  if (circuitoA) {
    throw new Error("Servicio no disponible. Intenta más tarde.");
  }

  if (!navigator.onLine) {
    throw new Error("Sin conexión a internet");
  }

  try {
    const response = await fetch(`${BASE_URL}?page=${page}`);

    if (!response.ok) {
      throw new Error("Error en la API");
    }

    errores = 0; 
    return await response.json();

  } catch (error) {
    errores++;

    if (intentos > 0) {
      console.warn("Reintentando petición...");
      return fetchCharacters(page, intentos - 1);
    }

    if (errores >= MAX_ERRORES) {
      circuitoA = true;
      setTimeout(() => {
        circuitoA = false;
        errores = 0;
      }, 10000); 
    }

    throw error;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnLoad");

  if (btn) {
    btn.addEventListener("click", () => {
      loadRandomCharacters();
    });
  }
});
