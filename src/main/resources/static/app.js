/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global websocket */

var canvas = document.getElementById("miCanvas");
var canvas2 = document.getElementById("miCanvas2");
var ctx = canvas.getContext("2d");
var estaPintando = true;
var limpiar = document.getElementById("limpiar");
var Comprobar = document.getElementById("Comprobar");
var stompClient = null;

limpiar.addEventListener("click",function(evt){
        borrar(evt);
},false);

canvas.addEventListener("mousedown", function (evt) {
    estaPintando = true;
    comienzaAPintar(evt);
}, false);

canvas.addEventListener("mouseup", finPintar, false);
canvas.addEventListener("mouseout", finPintar, false);


canvas2.addEventListener("mousedown", function (evt) {
    estaPintando = true;
    comienzaAPintar(evt);
}, false);

canvas2.addEventListener("mouseup", finPintar, false);
canvas2.addEventListener("mouseout", finPintar, false);

function getCoordenadas(clientX, clientY) {
    
    var rect = canvas.getBoundingClientRect();

    return{
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function getCoordenadas2(clientX, clientY) {
    
    var rect = canvas2.getBoundingClientRect();

    return{
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function comienzaAPintar(evt) {
    if (evt == null) estaPintando = false;    
    /*establece una ruta o la reestablece */
    ctx.beginPath();
    if (estaPintando) {
        canvas.addEventListener("mousemove", pintarFigura, false);        
        enviarDatos(evt, "comienzaAPintar");
    }
}

function comienzaAPintar2(evt) {
    if (evt == null) estaPintando = false;    
    /*establece una ruta o la reestablece */
    ctx.beginPath();
    if (estaPintando) {
        canvas2.addEventListener("mousemove", pintarFigura, false);        
        enviarDatos(evt, "comienzaAPintar");
    }
}


function pintarFigura(evt, newCoords) {
    var coords;
    if (estaPintando)coords = getCoordenadas(evt.clientX, evt.clientY);
    else coords = getCoordenadas(newCoords.x, newCoords.y);

    ctx.lineTo(coords.x, coords.y);
    ctx.lineCap = "round";
    ctx.stroke();

    if (estaPintando) {
        enviarDatos(evt, "pintarFigura");
    }

}

function enviarDatos(evt, nombreDelMetodo) {
    websocket.send(JSON.stringify(
            {
                coords: {
                    x: evt.clientX,
                    y: evt.clientY
                },
                methodName: nombreDelMetodo
            }
    ));
}

function finPintar(evt) {
    
    if (estaPintando){
        canvas.removeEventListener("mousemove", pintarFigura);
        //ctx.closePath();
    }
}

function finPintar2(evt) {
    
    if (estaPintando){
        canvas2.removeEventListener("mousemove", pintarFigura);
        //ctx.closePath();
    }
}

function borrar(evt) {
    canvas.width=canvas.width;
    enviarDatos(evt,"borrar");
}

function borrar2(evt) {
    canvas.width=canvas2.width;
    enviarDatos(evt,"borrar");
}





function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/'+canvas, function (data) {            
            theObject = JSON.parse(data.body);
            ctx.stroke();
        });
         stompClient.subscribe('/'+canvas2, function (data) {            
            theObject = JSON.parse(data.body);
            ctx.stroke();
        });



    });
}
sendPoint = function () {

    stompClient.send("/"+canvas, {}, JSON.stringify({x: x, y: y}));
    stompClient.send("/"+canvas2, {}, JSON.stringify({x: x, y: y}));
    
}
function suscribir(){
    disconnect();
    connect();
}
function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    
    console.log("Disconnected");
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}



$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');     
            context = canvas.getContext('2d');
            canvas.addEventListener('mousedown', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                x = mousePos.x;
                y = mousePos.y;
                sendPoint();
                //stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));
                var mensaje = 'Position' + mousePos.x + mousePos.y;

            }, false);
        }
);





