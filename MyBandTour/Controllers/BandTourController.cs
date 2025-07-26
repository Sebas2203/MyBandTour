using MyBandTour.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyBandTour.Controllers
{
    public class BandTourController : Controller
    {
        // GET: BandTour
        public ActionResult Inicio()
        {
            return View();
        }

        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("Inicio");
        }

        public ActionResult AdminLogin()
        {
            return View();
        }

        public ActionResult AgregarConcierto()
        {
            return View();
        }
        public ActionResult EliminarConcierto()
        {
            return View();
        }

        public ActionResult SubirImagen(HttpPostedFileBase imageFile)
        {
            if (imageFile != null && imageFile.ContentLength > 0)
            {
                var fileName = Path.GetFileName(imageFile.FileName);
                var serverPath = Server.MapPath("~/Content/img/");
                var fullPath = Path.Combine(serverPath, fileName);

                imageFile.SaveAs(fullPath);

                return Content("Saved as: " + fileName);
            }

            return new HttpStatusCodeResult(400, "No file uploaded");
        }


        //json methods 
        [HttpPost]
        public JsonResult AuthenticateUser(string username, string password)
        {
            MyBandTourEntities conexion = new MyBandTourEntities();
            ObjectParameter Resultado = new ObjectParameter("Resultado", typeof(int));

            conexion.sp_Autenticar (username, password, Resultado);

            if ((int)Resultado.Value == 1)
            {
                Session["Authenticate"] = true;
                Session["Username"] = username;
                return Json(new { Status = 200, message = "Login successful!" });
            }
            else
            {
                Session["Authenticate"] = false;
                return Json(new { Status = 401, message = "Invalid username or password." });
            }
        }


        //Hay un fallo pasando el Json a la base de datos, no se que es lo que falla. El archivo de imagen si se sube bien
        public JsonResult AgregarConcierto_DB(string nombre_Banda, string nombre_Genero, string fechaHora_Concierto, string nombre_Pais, string direccion, string poster_URL)
        {
            MyBandTourEntities conexion = new MyBandTourEntities();
            ObjectParameter Resultado = new ObjectParameter("resultado", typeof(int));

            DateTime fechaHora;
            if (!DateTime.TryParse(fechaHora_Concierto, out fechaHora))
            {
                return Json(new { Status = 400, message = "Fecha y hora del concierto no válida." });
            }

            try
            {
                conexion.sp_AgregarConcierto(nombre_Banda, nombre_Genero, fechaHora, nombre_Pais, direccion, poster_URL, Resultado);
            }
            catch (Exception ex)
            {
                return Json(new { Status = 500, message = "Error al agregar concierto: " + ex.Message });
            }


            if ((int)Resultado.Value == 1)
            {
                return Json(new { Status = 200, message = "Concierto agregado con exito" });
            }
            else
            {
                return Json(new { Status = 0 , message = "Error al agregar concierto"});
            }
        }

    }
}