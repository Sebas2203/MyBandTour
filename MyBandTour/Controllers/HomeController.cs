using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MyBandTour.Controllers
{
    public class HomeController : Controller
    {
        //interface methods
        public ActionResult HomePage()
        {
            return View();
        }
        public ActionResult Logout()
        {
            Session.Abandon();
            return RedirectToAction("HomePage");
        }

        public ActionResult AdminLogin()
        {
            return View();
        }

        //json methods 
        [HttpPost]
        public JsonResult AuthenticateUser(string username, string password)
        {
            string user = "admin";
            string pass = "admin";

            if (username == user && password == pass)
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

    }
}