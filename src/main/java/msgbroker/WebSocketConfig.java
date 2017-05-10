
package msgbroker;

/**
 *
 * @author hcadavid
 */
import java.util.logging.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        
       // config.enableSimpleBroker("/topic");
       
        config.setApplicationDestinationPrefixes("/app");
        
        config.enableStompBrokerRelay("/topic/").setRelayHost("192.168.56.101").setRelayPort(61613);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        
        //registry.addEndpoint("/stompendpoint").withSockJS();
        
        registry.addEndpoint("/stompendpoint").setAllowedOrigins("*").withSockJS();  
    }
    

}
