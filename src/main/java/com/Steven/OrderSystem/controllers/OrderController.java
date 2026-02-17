package com.Steven.OrderSystem.controllers;

import com.Steven.OrderSystem.dto.OrderDTO;
import com.Steven.OrderSystem.dto.OrderResponseDTO;
import com.Steven.OrderSystem.entities.Order;
import com.Steven.OrderSystem.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador REST para gestionar pedidos.
 * Endpoints disponibles:
 * - GET /api/orders - Obtiene todos los pedidos
 * - GET /api/orders/{id} - Obtiene un pedido por ID
 * - POST /api/orders - Crea un nuevo pedido
 * - DELETE /api/orders/{id} - Elimina un pedido
 * - GET /api/orders/store/{storeId} - Obtiene pedidos de una tienda
 * - GET /api/orders/date-range - Obtiene pedidos por rango de fechas
 * - GET /api/orders/store/{storeId}/total - Obtiene total de ventas de una tienda
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    /**
     * GET /api/orders
     * Obtiene todos los pedidos
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(
                orderService.getAllOrders()
                        .stream()
                        .map(orderService::toDTO)
                        .toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Integer id) {
        return ResponseEntity.ok(
                orderService.toDTO(orderService.getOrderById(id))
        );
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        Order created = orderService.createOrder(orderDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderService.toDTO(created));
    }


    /**
     * DELETE /api/orders/{id}
     * Elimina un pedido
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/orders/store/{storeId}
     * Obtiene todos los pedidos de una tienda específica
     */
    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<Order>> getOrdersByStore(@PathVariable Integer storeId) {
        List<Order> orders = orderService.getOrdersByStore(storeId);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * GET /api/orders/date-range?startDate=2024-01-01&endDate=2024-12-31
     * Obtiene pedidos en un rango de fechas
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Order> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * GET /api/orders/store/{storeId}/total
     * Obtiene el total de ventas de una tienda
     */
    @GetMapping("/store/{storeId}/total")
    public ResponseEntity<Double> getTotalSalesByStore(@PathVariable Integer storeId) {
        Double total = orderService.getTotalSalesByStore(storeId);
        return ResponseEntity.ok(total);
    }
}
