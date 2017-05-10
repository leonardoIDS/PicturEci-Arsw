/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package msgbroker;


import java.io.Console;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author 2103216
 */
@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;
    
    private int npoints = 0;
    
    List<Point> PointsPolygon = new ArrayList<>();

    @MessageMapping("/newpoint")
    public void getLine(Point pt) throws Exception {
        
        System.out.println("Nuevo punto recibido en el servidor!:" + pt);
        
        msgt.convertAndSend("/topic/newpoint", pt);
        
        PointsPolygon.add(pt);
        
        System.out.println("Punto ingresado");
        if (PointsPolygon.size() ==4) {
            
            msgt.convertAndSend("/topic/newpolygon", PointsPolygon);
            
            npoints = 0 ;
            
            PointsPolygon.clear();
        }
        
    }

}
