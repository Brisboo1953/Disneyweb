//agarrar la apiii//
const BASE_URL = "https://api.disneyapi.dev/character";


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
