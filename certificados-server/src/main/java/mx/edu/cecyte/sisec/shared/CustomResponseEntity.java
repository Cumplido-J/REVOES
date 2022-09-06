package mx.edu.cecyte.sisec.shared;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class CustomResponseEntity {
    public static ResponseEntity BAD_REQUEST(String mensaje) {
        return new ResponseEntity(new ApiResponse(false, mensaje), HttpStatus.BAD_REQUEST);
    }

    public static ResponseEntity OK(Object respuesta) {
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    public static ResponseEntity MENSAJE_OK(String mensaje) {
        return new ResponseEntity(new ApiResponse(true, mensaje), HttpStatus.OK);
    }

    public static ResponseEntity INTERNAL_SERVER_ERROR() {
        return new ResponseEntity(new ApiResponse(false, "Ha ocurrido un error. Favor de informar de este comportamiento."), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
