package com.cibertec.application.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-visitantes", url = "http://localhost:4041")
public interface VisitanteClient {
    @GetMapping("/api/visitors/dni/{dni}")
    VisitanteResponseDTO getVisitorByDni(@PathVariable("dni") String dni);
}
