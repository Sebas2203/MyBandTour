function Authenticate() {
    // Parámetros de entrada
    let user = document.getElementById("user").value;
    let password = document.getElementById("password").value;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/BandTour/AuthenticateUser",
        data: {
            'username': user,
            'password': password
        },
        success: function (response) {
            console.log(response);

            if (response.Status === 200) {
                window.location.replace('/BandTour/Inicio')
            } else {
                document.getElementById('lblMessage').innerHTML = 'Usuario o Contraseña incorrectos.'
            }
        },
        error: function (error) {
            console.log("Error: " + error);
        }
    });
}

function SelectorFechaHora() {
    const input = document.getElementById("txtFechaHora").value;
    const boton = document.getElementById("btnConfirmarFecha");
    if (input != null) {
        boton.style.display = "block";
    } else {
        boton.style.display = "none";
    }
}

function BotonConfirmarFecha() {
    const boton = document.getElementById("btnConfirmarFecha");
    boton.innerHTML = "✔️";
    boton.style.border = "none";
    boton.style.backgroundColor = "transparent";
}

function PreviewImage() {
    const input = document.getElementById("imgFile");
    const uploadedImage = input.files[0];
    const previewContainer = document.getElementById("previewContainer");
    const preview = document.getElementById("preview");
    console.log(uploadedImage.name);

    if (uploadedImage && uploadedImage.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            previewContainer.style.display = "block"; // Show container
        };
        reader.readAsDataURL(uploadedImage);
    } else {
        preview.src = "";
        previewContainer.style.display = "none"; // Hide container
        alert("Archivo no válido. Por favor seleccione un archivo con formato de imagen.");
        input.value = "";
        uploadedImage = null;
    }
}

function SubirImagenConcierto() {
    let fileInput = document.getElementById('imgFile');
    let file = fileInput.files[0];

    if (!file) {
        alert("Por favor selecione una imagen.");
        return;
    }

    var formData = new FormData();
    formData.append("imageFile", file);

    fetch('/BandTour/SubirImagen', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            alert("Archivo subido con exito: " + result);
        })
        .catch(error => {
            console.error("Error subiendo la imagen:", error);
        });
}


function AgregarConcierto() {
    let banda = document.getElementById("txtBanda").value.trim();
    let genero = document.getElementById("txtGenero").value.trim();
    let fechaHora = document.getElementById("txtFechaHora").value.trim();
    let pais = document.getElementById("txtPais").value.trim();
    let direccion = document.getElementById("txtDireccion").value.trim();
    let imagenInput = document.getElementById("imgFile");
    let imagenBanner = imagenInput.files[0]; // Sostiene la imagen

    // Revisar campos vacios
    if (!banda || !genero || !fechaHora || !pais || !direccion || !imagenBanner) {
        alert("Por favor complete todos los campos antes de continuar.");
        return;
    }

    let BannerFileName = imagenBanner.name;
    let BannerURL = "/Content/img/" + BannerFileName;

    SubirImagenConcierto();

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/BandTour/AgregarConcierto_DB",
        data: {
            'nombre_Banda': banda,
            'nombre_Genero': genero,
            'fechaHora_Concierto': fechaHora,
            'nombre_Pais': pais,
            'direccion': direccion,
            'poster_URL': BannerURL
        },
        success: function (response) {
            console.log("Datos de concierto guardados", response);
            alert("Datos del concierto fueron guardados exitosamente.");

            if (response.Status === 200) {
                window.location.replace('/BandTour/Inicio')
            } else {
                document.getElementById('lblMessage').innerHTML = 'Usuario o Contraseña incorrectos.';
            }
        },
        error: function (error) {
            console.log("Error: " + error);
        }
    });
}

//------------------- Parte Sebas ------------------//

//listar conciertos
function ListarConciertos() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "/BandTour/ListarConciertos",
        data: {},
        success: function (respuesta) {
            console.log(respuesta);

            let cuerpoTabla = document.getElementById("listaConciertosTabla");
            cuerpoTabla.innerHTML = ""; // limpiar tabla antes de llenar

            for (let i = 0; i < respuesta.Lista.length; i++) {
                let fila = cuerpoTabla.insertRow();

                let idConcierto = fila.insertCell(0);
                idConcierto.innerHTML = respuesta.Lista[i].id_Concierto;

                let nombreConcierto = fila.insertCell(1);
                nombreConcierto.innerHTML = respuesta.Lista[i].nombre_Banda;

                let genero = fila.insertCell(2);
                genero.innerHTML = respuesta.Lista[i].id_Genero;

                let fechaC = fila.insertCell(3);
                fechaC.innerHTML = respuesta.Lista[i].Fecha;

                // Celda para el botón eliminar
                let acciones = fila.insertCell(4);
                acciones.innerHTML = `<button onclick="EliminarConcierto(${respuesta.Lista[i].id_Concierto})" class="btn btn-danger btn-sm">Eliminar</button>`;
            }
        },
        error: function (error) {
            console.error('Error', error);
        }
    });
}

//eliminar concierto 
function EliminarConcierto(id) {
    if (!confirm("¿Estás seguro que quieres eliminar este concierto?")) {
        return;
    }

    $.ajax({
        type: "POST",
        url: "/BandTour/EliminarConcierto",
        data: { id_Concierto: id },
        success: function (respuesta) {
            if (respuesta.resultado === 1) {
                alert("Concierto eliminado correctamente.");
                ListarConciertos(); // refrescar tabla
            } else {
                alert("No se pudo eliminar el concierto.");
            }
        },
        error: function (error) {
            console.error("Error al eliminar", error);
            alert("Error en la solicitud.");
        }
    });
}




//buscar concierto
//function buscarConciertos() {
//    const nombre = $("#txtBuscarConcierto").val();
//    const pais = $("#txtBuscarConcierto").val();

//    $.ajax({
//        url: '/BandTour/BuscarConciertos',
//        type: 'POST',
//        data: { nombre_Banda: nombre, pais: pais },
//        success: function (response) {
//            if (response.success && response.resultado === 1) {
//                console.log("Conciertos encontrados:", response.conciertos);
//                // Render results to the page

//            } else if (response.resultado === -1) {
//                alert("No se encontraron conciertos.");
//            } else {
//                alert("Ocurrió un error.");
//            }
//        },
//        error: function () {
//            alert("Error en la solicitud AJAX.");
//        }
//    });
//}

function buscarConciertos() {
    const nombre = $("#txtBuscarConcierto").val().trim();
    const pais = $("#txtBuscarConcierto").val();

    if (nombre === "") {
        alert("Por favor ingrese un nombre para buscar.");
        return;
    }

    $.ajax({
        url: '/BandTour/BuscarConciertos',
        type: 'POST',
        dataType: "json",
        data: { nombre_Banda: nombre, pais: pais },
        success: function (response) {
            let contenedor = document.querySelector(".grid-container");
            contenedor.innerHTML = ""; // limpiar antes

            if (response.success && response.resultado === 1 && response.conciertos.length > 0) {
                // Por si hay varios, solo mostramos el primero
                let concierto = response.conciertos[0];

                let card = document.createElement("div");
                card.classList.add("card");

                // Fecha
                //let divFecha = document.createElement("div");
                //divFecha.classList.add("date");
                //let fecha = new Date(concierto.Fecha);
                //let opcionesFecha = { month: 'short', day: '2-digit' };
                //divFecha.innerHTML = fecha.toLocaleDateString("es-ES", opcionesFecha).replace(" ", "<br>");
                //card.appendChild(divFecha);


                // Imagen - asumimos que nombre_Banda viene y la imagen se basa en eso
                let img = document.createElement("img");
                img.src = "/Content/img/" + obtenerNombreImagen(concierto.nombre_Banda);
                img.alt = concierto.nombre_Banda;
                card.appendChild(img);

                // Nombre banda
                let h3 = document.createElement("h3");
                h3.textContent = concierto.nombre_Banda;
                card.appendChild(h3);

                // Lugar 
                let p = document.createElement("p");
                p.textContent = concierto.direccion || concierto.lugar || "";
                card.appendChild(p);

                contenedor.appendChild(card);

            } else if (response.resultado === -1 || (response.conciertos && response.conciertos.length === 0)) {
                contenedor.innerHTML = "<p>No se encontraron conciertos para ese nombre.</p>";
            } else {
                contenedor.innerHTML = "<p>Ocurrió un error al buscar el concierto.</p>";
            }
        },
        error: function () {
            alert("Error en la solicitud AJAX.");
        }
    });
}

// función helper para obtener nombre imagen igual que en controlador
function obtenerNombreImagen(nombreBanda) {
    return nombreBanda.toLowerCase().replace(/ /g, '') + ".jpg";
}



//cargar las cartas de los conciertos
function CargarCartasConciertos() {
    $.ajax({
        type: "GET",
        url: "/BandTour/ListarConciertosParaCartas",
        dataType: "json",
        success: function (respuesta) {
            let contenedor = document.querySelector(".grid-container");
            contenedor.innerHTML = ""; // limpiar antes

            respuesta.Lista.forEach(concierto => {
                // Crear el div card
                let card = document.createElement("div");
                card.classList.add("card");

                // Fecha
                let divFecha = document.createElement("div");
                divFecha.classList.add("date");
                divFecha.innerHTML = concierto.fecha;
                card.appendChild(divFecha);

                // Imagen
                let img = document.createElement("img");
                img.src = "/Content/img/" + concierto.imagen;
                img.alt = concierto.nombre_Banda;
                card.appendChild(img);

                // Nombre banda
                let h3 = document.createElement("h3");
                h3.textContent = concierto.nombre_Banda;
                card.appendChild(h3);

                // Lugar 
                let p = document.createElement("p");
                p.textContent = concierto.lugar;
                card.appendChild(p);

                contenedor.appendChild(card);
            });
        },
        error: function (error) {
            console.error("Error al cargar conciertos", error);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    CargarCartasConciertos();
});



