/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var wsURI = "ws://" + document.location.host + document.location.pathname + "PicturEci";
var websocket = new WebSocket(wsURI);

websocket.onerror = function(evt){
    console.log("Ocurrio un error" + evt.data);
};

websocket.onopen = function(evt){
    console.log("Abrio conexión en " + wsURI);
};

websocket.onmessage =  function(evt){
    console.log("Mensaje: " + evt.data);
    
    var json = JSON.parse(evt.data);
    if(json.methodName == "comienzaAPintar") comienzaAPintar(null);
    if(json.methodName == "pintarFigura") pintarFigura(null, json.coords); 
    if(json.methodName == "borrar") borrar(null);
};

