const productos =
[
{
    nombre: "Americano",
    categoria: "cafe",
    precio: 2500

},
{
    nombre: "Espresso",
    categoria:"cafe",
    precio: 4500
},
{
    nombre:"Doppio",
    categoria:"cafe",
    precio:1230

},
{
    nombre:"Latte",
    categoria:"cafe",
    precio:5670

},
{
    nombre:"Flat White",
    categoria:"cafe",
    precio:6000

},
{
    nombre:"Medialuna",
    categoria:"productos",
    precio:2300

},
{
    nombre:"Croissant",
    categoria:"productos",
    precio:3500

},
{
    nombre:"rellena de pastelera",
    categoria:"productos",
    precio:4700

},
{
    nombre: "rellena de dulce de leche",
    categoria:"productos",
    precio:5000
    
}
]

const listaCafes = document.querySelector("#lista-cafes");
const listaProductos = document.querySelector("#lista-productos");

const formatoPrecio = new Intl.NumberFormat("es-AR");

//el siguiente bloque recupera los favoritos guardados:
let favoritos=[];
try{
    const favoritosGuardados = JSON.parse(localStorage.getItem("favoritos"));

    if (Array.isArray(favoritosGuardados)){
        favoritos = favoritosGuardados;
    }
}catch(error){
    favoritos= [];

}

productos.forEach((producto) => {
    const item = document.createElement("li");

    item.textContent = `${producto.nombre} - $${formatoPrecio.format(producto.precio)}`;

    if(favoritos.includes(producto.nombre)){
        item.classList.add("favorito");

    }

item.addEventListener("click", () => {
  if (favoritos.includes(producto.nombre)) {
    favoritos = favoritos.filter((nombre) => nombre !== producto.nombre);
  } else {
    favoritos.push(producto.nombre);
  }

  item.classList.toggle("favorito");
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
});

    if(producto.categoria==='cafe'){
        listaCafes.append(item);

    }else{
        listaProductos.append(item);

    }

});

// Conectamos los botones definidos en HTML
const botonesFiltro = document.querySelectorAll("[data-filtro]");
const seccionesMenu = document.querySelectorAll("#menu-cafeteria section");

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoriaElegida = boton.dataset.filtro;

    seccionesMenu.forEach((seccion) => {
      const mostrarTodo = categoriaElegida === "todos";
      const coincide = seccion.dataset.categoria === categoriaElegida;

      seccion.hidden = !mostrarTodo && !coincide;
    });
  });
});

const formulario = document.querySelector("#form-contacto");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const email = document.querySelector("#email").value.trim();
    const mensaje = document.querySelector("#mensaje").value.trim();

    let formularioValido = true;
    document.querySelector("#error-nombre").textContent = nombre.length<3 ? "Ecribi al menos tres caracteres." : "";

    document.querySelector("#error-email").textContent = 
        !email.includes("@") || !email.includes(".")
        ? "Ingresá un email valido."
        : "";

    document.querySelector("#error-mensaje").textContent =
    mensaje.length<5 ? "Escribi un mensaje de al menos 5 caracteres." : "";

    formularioValido =
        nombre.length>=3 &&
        email.includes("@") &&
        email.includes(".") &&
        mensaje.length>=5;
    
    if(formularioValido){
        document.querySelector("#respuesta-formulario").textContent =
            `Gracias, ${nombre}! Recibimos tu mensaje.`;
        
        formulario.reset();
    }else{
        document.querySelector("#respuesta-formulario").textContent = ""; 
    }

});

async function cargarCotizacion() {
    const elementoCotizacion = document.querySelector("#cotizacion-dolar");

    try{
        const respuesta = await
        fetch("https://dolarapi.com/v1/dolares/oficial");
        
        if(!respuesta.ok){
            throw new Error("No se pudo obtener la cotizacion.");
        }
        
        const datos = await respuesta.json();
        elementoCotizacion.textContent =
        `Dolar oficial (venta): $${formatoPrecio.format(datos.venta)}`;
        elementoCotizacion.classList.remove("cargando");
    }catch(error){
        elementoCotizacion.textContent = 
        "No pudimos cargar la cotización. El menú sigue disponible.";
        elementoCotizacion.classList.remove("cargando");
        elementoCotizacion.classList.add("error");

    }
}

cargarCotizacion();