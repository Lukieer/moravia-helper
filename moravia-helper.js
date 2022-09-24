// ==UserScript==
// @name         Moravia Helper
// @namespace    https://mskarbek.pl
// @source       https://github.com/Lukieer/moravia-helper
// @downloadURL  https://raw.githubusercontent.com/Lukieer/moravia-helper/main/moravia-helper.js
// @updateURL    https://raw.githubusercontent.com/Lukieer/moravia-helper/main/moravia-helper.js
// @version      2.0
// @description  Easy prepare links for projects
// @author       Maciej Skarbek
// @match        https://projects.moravia.com/task/*
// @grant        none

// ==/UserScript==
(function () {
    'use strict';

    $("head").append(`
    <style>
    .moravia-helper {
        opacity: 0;
        margin-top: -15px;
        transition: background-color 0.5s ease-in-out;
        transition: opacity 1s ease-in-out;
    }
     .moravia-helper img
     {
       margin-top: 20px;
       margin-bottom: 20px;
       width: 50px;
     }
     .mh-center {
        text-align: center;
     }
     .mh-title {
       
        margin-bottom: 10px;
     }
     #mh-showlink
     {
        font-size: 13px;
        text-align: center;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
     }
     #mh-link {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
     }
    </style>
    `);

    let rows = "";
    let row = "";
    let name = "";
    let id ="";
    let button = "";
    let links = "";
    let nid = "";
    let rawlinks = "";
    let emtra = "";
    $("#instructionsWarningPanel").after("<div id='mh-link'></div>");
    $(".right-panel-assignee").eq(0).after(
        `

      <div class="panel panel-body moravia-helper" id="moravia-helper">
        <label class="right-panel-label mh-title">Moravia Helper v2</label>
        <div class="right-panel-content">
        <div class="row">
            <div class="col-12 mh-center" id="mh-body">
                <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif"><br />
                <small class="title" id="mh-progress">Trwa sprawdzanie, proszę czekać...</small>
            </div>
        </div>
        </div>
      </div>
    `);


    setTimeout(function(){
        $("#moravia-helper").css("opacity", "1");
    },200);


    $("#task-menu .moravia-helper").on("click", "#mh-showlink", function()
    {
        button = $("#mh-showlink");
        button.prop("disabled", true);
        $("#mh-body").html(`
        <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif"><br />
        <small class="title" id="mh-progress">Generowanie linków, to może chwilę potrwać!</small>
        `);
        links = "<table class='table'><thead><th>Nazwa</th><th>ID</th><th>Link</th></thead><tbody>" + links + "</tbody>";
        $("#mh-link").append(links);
        $("#mh-link").css("opacity", "1");

        $("#moravia-helper").css("background-color", "#c2fdc2");
        $("#mh-body").html(`

        <img src="https://www.kindpng.com/picc/b/122-1226306_green-check-png.png"><br />
        <small class="title" id="mh-progress">Ukończono operacje!</small>
        `);
        
        window.open(emtra, '_blank');

    });




    const interval = setInterval(function()
    {
        rows = $(".grid-body .grid-inner .grid-body .grid-row");

        if(rows.length > 0){
            $("#moravia-helper").css("background-color", "");
            clearInterval(interval);

            $("#mh-progrss").html("Wykryto tabele, sprawdzanie poprawności nazw");

            rows.each(function(i){

                row = $(rows[i]);
                name = $($(row.children()[2]).children()[0]).html();

                if(name.length > 0)
                {
                    $("#mh-progrss").html("Przygotowywanie linków...");

                    id = name.match(/(?<=\]\[)(.*)(?=\])/gm)[0];

                    if(id != undefined)
                    {
                        $("#mh-body").html(`<div class="right-panel-button"><button class="btn btn-primary btn-sm btn-block right-panel-btn" id="mh-showlink">Pokaż linki</a></div>`);
                        setTimeout(function(){
                            $("#mh-showlink").css("opacity", "1");
                        },200);
                        
                        name = name.split("#").pop();
                        nid = name.split("_")[0];
                        name = name.split("_").pop();

                        links += "<tr><td>" + name + "</td><td>"+nid+"</td><td>" + "<a href='https://twe.atms.a2z.com/twe/translation/job/" + id + "'>https://twe.atms.a2z.com/twe/translation/job/" + id + "</a></td></tr>";
                        rawlinks += "https://twe.atms.a2z.com/twe/translation/job/" + id + " " + nid + " " + name;
                    } else {
                        $("#moravia-helper").css("background-color", "#ffbfbf");
                        $("#mh-body").html(`

                        <img src="https://www.freeiconspng.com/uploads/error-icon-4.png"><br />
                        <small class="title" id="mh-progress">Nie udało się odczytać ID dokumentu!</small>
                        `);
                    }

                } else {
                    $("#moravia-helper").css("background-color", "#ffbfbf");
                    $("#mh-body").html(`

                    <img src="https://www.freeiconspng.com/uploads/error-icon-4.png"><br />
                    <small class="title" id="mh-progress">Nie udało się przygotować linku do dokumentu!</small>
                    `);
                }

            });
            let emtra_name = new Date().getFullYear() + new Date().getMonth() + new Date().getDay() + "_" + name.replace("Amazon ", "").replace("2022", "").replace(" ", "_") + "_" + nid + "_";
            let deadline = $(
                $(
                    $(".info-lines").eq(0).children()[1]
                ).eq(0).children()[1]
            ).html().substr(0,16).replace(" ", "T") + ":00";

            let time = deadline.replace(deadline.substr(0,10), "");
            let dparts = deadline.substr(0,10).split(".");
            deadline = new Date(dparts[2] + "-" + dparts[1] + "-" + dparts[0] + time);
            deadline = deadline.getFullYear() + "-" + deadline.getMonth() + "-" + deadline.getDay() + " " + deadline.getHours() + ":" + deadline.getMinutes();
            let task_id = $($($($(".info-lines")[0]).children()[2]).children()[1]).html();
            let finance = "";
            let pay = "";
            let fourth_row = "-";
            let fifth_row = "-";
            let third_row = Math.floor($($($($("#info-lines")[0]).children()[8]).children()[1]).html());

            $.get("https://projects.moravia.com/odata/taskfinance("+task_id+")?$orderby=id%20desc&$format=application/json;odata.metadata=minimal&$expand=requestor&$count=true", function(data,status)
            {
                finance = data;
                if(finance['value'][1] !== undefined)
                {
                    fourth_row = Math.floor(finance['value'][1]) * 1000;
                    fifth_row = third_row + 0.1 * fourth_row;
                }
            });
            if(fifth_row == "-") 
            {
                emtra_name +=  "both";
                pay = third_row; 
            } else {
                emtra_name += "including101_both";
                pay = fifth_row;
            }
            emtra = "https://www.emtra.pl/admin/jobcreate.php?id=501&task_id=0&reset=1&symfonie=" + 
            encodeURIComponent
            (
                "{\"job_name\":\""+emtra_name+"\",\"lus\":\""+pay+"\",\"comments\":\""+rawlinks+"\", \"deadline\": \""+deadline+"\"}"
            );
        }
    }, 100);
        
        

})();
