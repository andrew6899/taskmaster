using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using taskmasttest.Models;
using Newtonsoft.Json;

namespace taskmasttest.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult AllTasks()
        {
            string output = GetTasks();
            return Json(output, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult RecordTasks(List<ToDoTask> tasks)
        {
            string json = string.Empty;
            //serialize tasks
            json = JsonConvert.SerializeObject(tasks);
            System.IO.File.WriteAllText(@"C:\Users\fire_\Desktop\tasks.txt", json);
            return Json(json);
            //return json
        }





        private string GetTasks()
        {
            string tasks = System.IO.File.ReadAllText(@"C:\Users\fire_\Desktop\tasks.txt");
            return tasks;

        }
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}