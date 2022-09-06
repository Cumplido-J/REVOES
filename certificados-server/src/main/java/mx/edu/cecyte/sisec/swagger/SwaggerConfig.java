package mx.edu.cecyte.sisec.swagger;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
//import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;



@Configuration
@EnableSwagger2
public class SwaggerConfig {

    private static final Set<String> DEFAULT_PRODUCES_AND_CONSUMES = new HashSet<String>(Arrays.asList("application/json","application/xml"));

    @Bean
    public Docket apiDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("mx.edu.cecyte.sisec.controller"))
                .paths(PathSelectors.any())
                .build()
                .apiInfo(getApiInfo())
                .produces(DEFAULT_PRODUCES_AND_CONSUMES)
                .consumes(DEFAULT_PRODUCES_AND_CONSUMES)
                ;
    }


    private ApiInfo getApiInfo() {
        return new ApiInfo(
                "SISEC Application",
                "Documentación sistema SISEC",
                "1.0",
                "",
                new Contact("admin", "https://xxx.com", "xxxx@xxxxx∫.com"),
                "LICENSE",
                "LICENSE URL",
                Collections.emptyList()
        );
    }
}
