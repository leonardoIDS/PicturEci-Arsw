/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global websocket */

var canvas;
var ctx;
var estaPintando = true;
var limpiar;
var Comprobar;
var stompClient = null;
var wsURI = "ws://" + document.location.host + document.location.pathname + "/data/websocket";
var websocket = new WebSocket(wsURI);

function getCoordenadas(clientX, clientY) {

    var rect = canvas.getBoundingClientRect();

    return{
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}
function comienzaAPintar(evt) {
    if (evt == null) {
        estaPintando = false;
    }
    /*establece una ruta o la reestablece */
    ctx.beginPath();
    if (estaPintando) {
        canvas.addEventListener("mousemove", pintarFigura, false);
        enviarDatos(evt, "comienzaAPintar");
    }
}
function pintarFigura(evt, newCoords) {
    var coords;
    if (estaPintando) {
        coords = getCoordenadas(evt.clientX, evt.clientY);
    } else {
        coords = getCoordenadas(newCoords.x, newCoords.y);
    }
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

    if (estaPintando) {
        canvas.removeEventListener("mousemove", pintarFigura);
        //ctx.closePath();
    }
}
function borrar(evt) {
    canvas.width = canvas.width;
    enviarDatos(evt, "borrar");
}

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        //console.log("Ya tengo los datossssssssssssssssssssssssssssssssssss");

        clase = sessionStorage.getItem("clase");
        stompClient.subscribe('/topic/newdibujo.' + clase, function (data) {
            console.log("newdibujo");
            theObject = JSON.parse(data.body);
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(theObject["x"], theObject["y"], 1, 0, 2 * Math.PI);

            ctx.stroke();


        });
    });
}



sendPoint = function () {
    stompClient.send("/topic" + canvas, {}, JSON.stringify({x: x, y: y}));

}
function suscribir() {
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
            canvas = document.getElementById("miCanvas");
            console.log(canvas);
            ctx = canvas.getContext("2d");
            limpiar = document.getElementById("limpiar");
            Comprobar = document.getElementById("Comprobar");
            limpiar.addEventListener("click", function (evt) {
                borrar(evt);
            }, false);
            canvas.addEventListener("mousedown", function (evt) {
                estaPintando = true;
                comienzaAPintar(evt);
            }, false);
            canvas.addEventListener("mouseup", finPintar, false);
            canvas.addEventListener("mouseout", finPintar, false);
            connect();
            console.info('connecting to websockets');
            canvas = document.getElementById('miCanvas');
            context = canvas.getContext('2d');
            if (Math.random() == 1) {
                context.strokeStyle = '#3B83BD';
            } else {
                context.strokeStyle = '#CC0605';
            }
            context.lineWidth = 1;
            canvas.addEventListener('mousedown', false);
            canvas.addEventListener('mouseup', false);
            canvas.addEventListener('mousemove', function (evt) {
                var mousePos = getMousePos(canvas, evt);
                x = mousePos.x;
                y = mousePos.y;
                sendPoint();

                //stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));
                var mensaje = 'Position' + mousePos.x + mousePos.y;

            }, false);

        }
);





