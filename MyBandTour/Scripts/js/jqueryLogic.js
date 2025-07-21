function Authenticate() {
    //parametros de entrada
    let user = document.getElementById("user").value;
    let password = document.getElementById("password").value;


    $.ajax({
        type: "POST",
        dataType: "json",
        URL: "/Home/AuthenticateUser",
        data: { parametro: valor },
        success: function (response) {
        },
        Error: function (error) {
            console.log("Error: " + error);
        }
    }
}