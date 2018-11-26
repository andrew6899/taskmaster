$(document).ready(function () {
    getTasks();
    $(".cancel").on("click", function () {
        $(this).siblings("input").val("");
        $(this).parent().hide();
    });
    $(".addtask").on("click", function () {
        $(".add").show();
    });
    $("#newtasksubmit").on("click", function () {
        var tasklist = $(".tasklist");
        var taskname = $(this).siblings("input").val();
        var taskHtml = $("<div class=\"task\"><input type=\"checkbox\" /><div class=\"name\">" +
            taskname +
            "</div><button class=\"editname\">Edit</button><button class=\"delete\">Delete</button></div>");
        taskHtml.appendTo(tasklist);
        $(this).siblings(".cancel").click();
        
        bindEdits();
        updateTasks();
    });

    bindEdits();
    function bindEdits() {
        $("input:checkbox").on("change", function () {
            updateTasks();
        });
        $(".editname").on("click", function () {
            var curtaskname = $(this).siblings(".name");
            var editWindow = $(".edit");
            editWindow.show();
            var newtaskname = editWindow.children("input");
            newtaskname.val(curtaskname.html());
            $("#edittasksubmit").unbind();
            $("#edittasksubmit").on("click", function () {
                console.log("previous name was " + curtaskname + ", and new name is " + newtaskname.val());
                curtaskname.html(newtaskname.val());
                $(this).siblings(".cancel").click();
                updateTasks();
            });
        });
        $(".delete").on("click", function () {
            $(this).unbind();
            $(this).parents(".task").remove();
            updateTasks();
        });
    }

    function getTasks() {
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "GET",
            url: "http://localhost:54057/Home/AllTasks",
            success: function (response) {
                console.log("We got the tasks!");
                console.log(response);
                var obj = JSON.parse(response);
                for (var i = 0; i < obj.length; i++) {
                    var checked = obj[i].Checked ? "checked" : "";
                    var task = $('<div class="task"><input type="checkbox"' + checked + '><div class="name">' +
                        obj[i].TaskName +
                        '</div><button class="editname">Edit</button><button class="delete">Delete</button>');
                    $(".tasklist").append(task);
                    console.log("Name is " + obj[i].TaskName + ", and checked value is " + obj[i].Checked)
                }
                bindEdits();
            },
            complete: function () {
                console.log("getTasks ended");
            }
        });



    }

    function updateTasks() {
        var tasklist = [];
        var task;
        //var task = new Object();
        $(".task").each(function () {
            var name = $(this).find(".name").html();
            var checked = $(this).find("input:checkbox").prop("checked");
            task = new Object({ TaskName: name, Checked: checked });
            tasklist.push(task);
            //task.TaskName = "testtask";
            //task.Checked = true;
        });
        console.log(task);
        tasklist = JSON.stringify(tasklist);
        $.ajax({
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            url: "http://localhost:54057/Home/RecordTasks",
            data: tasklist,
            success: function () {
                console.log("Tasks successfully recorded");
            },
            complete: function () {
                console.log(JSON.stringify(task));
            }
        });

    }

    function updateTasksz() {
        var tasklist = new Array();
        $(".task").each(function () {
            var task = new Object();
            task.TaskName = $(this).find(".name").html();
            task.Checked = $(this).find("input:checkbox").prop("checked");
            tasklist.push(task);
        });
        console.log(tasklist);
        $.ajax({
            type: "POST",
            url: "http://localhost:54057/Home/AllTasks",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({ tasklist }),
            success: function (response) {
                if (response != null) {
                    console.log("call successful! Tasks have been updated.");
                } else {
                    console.log("updateTasks failed");
                }
            },
            failure: function (response) {
                console.log("Failure: " + response.responseText);
            },
            error: function (response) {
                console.log("Error: " + response.responseText);
            },
            complete: function () {
                console.log("AJAX post complete");
            }
        });
        console.log(JSON.stringify(tasklist));
    }

});