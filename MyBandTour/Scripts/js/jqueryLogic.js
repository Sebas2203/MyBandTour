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

