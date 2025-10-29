package com.cibertec.parkingsessions.client;

import com.cibertec.parkingsessions.dto.UpdateStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-parking-spaces")
public interface ParkingSpaceClient {
    
    @PutMapping("/api/parking-spaces/{id}/status")
    void updateParkingSpaceStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request);
}