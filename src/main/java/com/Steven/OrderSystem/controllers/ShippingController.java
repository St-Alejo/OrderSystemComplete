package com.Steven.OrderSystem.controllers;

import com.Steven.OrderSystem.dto.ShippingDTO;
import com.Steven.OrderSystem.entities.Shipping;
import com.Steven.OrderSystem.enums.ShippingStatus;
import com.Steven.OrderSystem.services.ShippingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar envíos.
 * Endpoints:
 * - GET /api/shippings - Obtiene todos los envíos
 * - GET /api/shippings/{id} - Obtiene un envío por ID
 * - POST /api/shippings - Crea un nuevo envío
 * - PUT /api/shippings/{id}/status - Actualiza el estado de un envío
 * - GET /api/shippings/order/{orderId} - Obtiene envío por pedido
 * - GET /api/shippings/status/{status} - Obtiene envíos por estado
 */
@RestController
@RequestMapping("/api/shippings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShippingController {
    
    private final ShippingService shippingService;
    
    /**
     * GET /api/shippings
     * Obtiene todos los envíos
     */
    @GetMapping
    public ResponseEntity<List<Shipping>> getAllShippings() {
        List<Shipping> shippings = shippingService.getAllShippings();
        return ResponseEntity.ok(shippings);
    }
    
    /**
     * GET /api/shippings/{id}
     * Obtiene un envío por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Shipping> getShippingById(@PathVariable Integer id) {
        Shipping shipping = shippingService.getShippingById(id);
        return ResponseEntity.ok(shipping);
    }
    
    /**
     * POST /api/shippings
     * Crea un nuevo envío
     * Body ejemplo:
     * {
     *   "orderId": 1,
     *   "address": "Calle 123",
     *   "shipDate": "2024-02-15",
     *   "deliveryDate": "2024-02-20",
     *   "cost": 10.0,
     *   "status": "PENDING"
     * }
     */
    @PostMapping
    public ResponseEntity<Shipping> createShipping(@RequestBody ShippingDTO shippingDTO) {
        Shipping createdShipping = shippingService.createShipping(shippingDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdShipping);
    }
    
    /**
     * PUT /api/shippings/{id}/status
     * Actualiza el estado de un envío
     * Body ejemplo: { "status": "IN_TRANSIT" }
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Shipping> updateShippingStatus(
            @PathVariable Integer id,
            @RequestParam ShippingStatus status) {
        Shipping updatedShipping = shippingService.updateShippingStatus(id, status);
        return ResponseEntity.ok(updatedShipping);
    }
    
    /**
     * GET /api/shippings/order/{orderId}
     * Obtiene el envío asociado a un pedido
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipping> getShippingByOrder(@PathVariable Integer orderId) {
        Shipping shipping = shippingService.getShippingByOrder(orderId);
        return ResponseEntity.ok(shipping);
    }
    
    /**
     * GET /api/shippings/status/{status}
     * Obtiene envíos por estado (PENDING, PROCESSING, IN_TRANSIT, DELIVERED, CANCELLED, RETURNED)
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Shipping>> getShippingsByStatus(@PathVariable ShippingStatus status) {
        List<Shipping> shippings = shippingService.getShippingsByStatus(status);
        return ResponseEntity.ok(shippings);
    }
}
