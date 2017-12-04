var MCG = {};

// ------------------------- //
// PROPERTIES                //
// ------------------------- //

MCG.graphProps = {hourWidth:4, graphBottom:300, graphHeight:200};

// ------------------------- //
// WINDOW SETUP              //
// ------------------------- //

window.onload = function(e){ 
    MCG.canvas = document.getElementById("mainCanvas");
    MCG.context = mainCanvas.getContext("2d");
    
    MCG.init();
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();



// ------------------------- //
// INITIALISATION            //
// ------------------------- //

MCG.init = function() {
    
    MCG.context.font = "bold 26px sans-serif";
    MCG.context.textAlign = "center";
    
    MCG.context.fillStyle = "#ddd";
    MCG.context.fillRect(0, 0, MCG.canvas.width, MCG.canvas.height);
    
    MCG.context.fillStyle = "#333";
    
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        MCG.fileInput = document.getElementById("fileInput");
        MCG.fileInput.addEventListener("change", MCG.onFileInput, false);
        
        MCG.context.fillText("Select your my-mefi-comments.txt file", MCG.canvas.width * 0.5, MCG.canvas.height * 0.5);
        document.getElementById("fileInputContainer").style.display = "inline";
    } else {
        MCG.fileInput = document.getElementById("textInput")
        MCG.fileInput.addEventListener("paste", MCG.onTextPaste, false);
        
        MCG.context.fillText("Copy and paste your my-mefi-comments.txt below", MCG.canvas.width * 0.5, MCG.canvas.height * 0.5);
        document.getElementById("textInputContainer").style.display = "inline";
    }
}

MCG.onFileInput = function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = MCG.onFileLoaded;
    reader.readAsText(file);
    document.getElementById("fileInputContainer").style.display = "none";
}

MCG.onFileLoaded = function(e) {
    MCG.comments = e.target.result;
    MCG.lines = MCG.comments.split("\n");
    
    MCG.startGraph();
}

MCG.onTextPaste = function(e) {
    window.setTimeout(MCG.readPastedText, 100);
}

MCG.readPastedText = function() {
    MCG.comments = MCG.fileInput.value;
    MCG.lines = MCG.comments.split("\n");
    document.getElementById("textInputContainer").style.display = "none";
    
    MCG.startGraph();
}

MCG.startGraph = function() {

    MCG.currentLine = 0;
    MCG.totalLines = MCG.lines.length;
    MCG.hours = [];
    MCG.days = [];
    MCG.hourScale = 4;
    MCG.dayScale = 1;
    MCG.hourMax = 0;
    MCG.dayMax = 0;
    MCG.updateRepeat = 0;
    
    MCG.dayNames = ["MON", "TUE", "WED", "THUR", "FRI", "SAT", "SUN"];
    
    MCG.graphProps.leftPadding = (MCG.canvas.width - MCG.graphProps.hourWidth * 24 * 7) * 0.5
    
    MCG.update();
}


// ------------------------- //
// MAIN LOOP                 //
// ------------------------- //

MCG.update = function() {
    
    var searching = true;
    var line;
    while(searching) {
        line = MCG.lines[MCG.currentLine];
        //2013-08-12 03:29:24.163
        
        if (line.match(/^\d{4}-\d{2}-\d{2}\s(\d{2}\W){3}/)) {
            searching = false;
            var split = line.split(" ");
            var time = split[1].split(":");
            var date = new Date(split[0]);
            date.setHours(Number(time[0]));
            date.setMinutes(Number(time[1]));
            date.setSeconds(Number(time[2].split(".")[0]));
            date.setTimezone("PST");
            
            var commentDay = date.getDay();
            var commentHour = date.getHours() + date.getDay() * 24;
            MCG.days[commentDay] = (MCG.days[commentDay] || 0) + 1;
            MCG.hours[commentHour] = (MCG.hours[commentHour] || 0) + 1;
            
            if (MCG.days[commentDay] > MCG.dayMax) {
                MCG.dayMax = MCG.days[commentDay];
            }
            if (MCG.hours[commentHour] > MCG.hourMax) {
                MCG.hourMax = MCG.hours[commentHour];
            }
        }
        
        MCG.currentLine++;
        if (MCG.currentLine >= MCG.totalLines) {
            searching = false;
            return;
        }
    }
    
    MCG.context.globalAlpha = 1.0;
    MCG.context.fillStyle = "#ddd";
    MCG.context.fillRect(0, 0, MCG.canvas.width, MCG.canvas.height);
    MCG.context.fillStyle = "#000";
    MCG.context.globalAlpha = 0.2;
    MCG.context.font = "bold 16px sans-serif";
    MCG.context.textAlign = "center";
    
    if (MCG.dayMax * MCG.dayScale > MCG.graphProps.graphHeight) {
        MCG.dayScale = MCG.graphProps.graphHeight / MCG.dayMax;
    }
    if (MCG.hourMax * MCG.hourScale > MCG.graphProps.graphHeight) {
        MCG.hourScale = MCG.graphProps.graphHeight / MCG.hourMax;
    }
    
    var day;
    var barHeight;
    for (var i = 0; i < 7; i++) {
        day = MCG.days[i] || 0;
        barHeight = day * MCG.dayScale;
        // Draw bar
        MCG.context.fillRect(MCG.graphProps.leftPadding + i * MCG.graphProps.hourWidth * 24, MCG.graphProps.graphBottom - barHeight, MCG.graphProps.hourWidth * 24, barHeight);
       
        // Draw grid line
        MCG.context.fillRect(MCG.graphProps.leftPadding + i * MCG.graphProps.hourWidth * 24, MCG.graphProps.graphBottom - MCG.graphProps.graphHeight, 1, MCG.graphProps.graphHeight);
        
        // Draw day label
        MCG.context.fillText(MCG.dayNames[i], MCG.graphProps.leftPadding + i * MCG.graphProps.hourWidth * 24 + MCG.graphProps.hourWidth * 12, MCG.graphProps.graphBottom - MCG.graphProps.graphHeight - 20);
    }
    // Draw final grid line
    MCG.context.fillRect(MCG.graphProps.leftPadding + 7 * MCG.graphProps.hourWidth * 24, MCG.graphProps.graphBottom - MCG.graphProps.graphHeight, 1, MCG.graphProps.graphHeight);
    
    var hour;
    MCG.context.globalAlpha = 0.8;
    for (var i = 0; i < 24 * 7; i++) {
        hour = MCG.hours[i] || 0;
        barHeight = hour * MCG.hourScale;
        MCG.context.fillRect(MCG.graphProps.leftPadding + i * MCG.graphProps.hourWidth, MCG.graphProps.graphBottom - barHeight, MCG.graphProps.hourWidth, barHeight);
    }
    MCG.context.fillRect(0, MCG.canvas.height - 5, MCG.canvas.width * MCG.currentLine / MCG.totalLines, 5);
    
    if (MCG.currentLine < MCG.totalLines) {
        if (MCG.updateRepeat < 10) {
            MCG.updateRepeat++;
            MCG.update();
        } else {
            MCG.updateRepeat = 0;
            requestAnimFrame(function() {
                MCG.update();
            });
        }
    }
}