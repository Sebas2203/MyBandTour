function Authenticate() {
    // Parámetros de entrada
    let user = document.getElementById("user").value;
    let password = document.getElementById("password").value;

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/Home/AuthenticateUser",  // ✅ corregido
        data: {
            'username': user,
            'password': password
        },
        success: function (response) {
            console.log(response);

            if (response.Status === 200) {
                window.location.replace('/Home/HomePage')
            } else {
                document.getElementById('lblMessage').innerHTML = 'Usuario o Contraseña incorrectos.'
            }
        },
        error: function (error) {  // ✅ corregido
            console.log("Error: " + error);
        }
    });
}
