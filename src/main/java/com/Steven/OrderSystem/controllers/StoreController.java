package com.Steven.OrderSystem.controllers;

import com.Steven.OrderSystem.dto.StoreDTO;
import com.Steven.OrderSystem.services.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar tiendas.
 * Endpoints disponibles:
 * - GET /api/stores - Obtiene todas las tiendas
 * - GET /api/stores/{id} - Obtiene una tienda por ID
 * - POST /api/stores - Crea una nueva tienda
 * - PUT /api/stores/{id} - Actualiza una tienda
 * - DELETE /api/stores/{id} - Elimina una tienda
 * - GET /api/stores/search?name={name} - Busca tiendas por nombre
 */
@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoreController {
    
    private final StoreService storeService;
    
    /**
     * GET /api/stores
     * Obtiene todas las tiendas
     * @return Lista de tiendas
     */
    @GetMapping
    public ResponseEntity<List<StoreDTO>> getAllStores() {
        List<StoreDTO> stores = storeService.getAllStores();
        return ResponseEntity.ok(stores);
    }
    
    /**
     * GET /api/stores/{id}
     * Obtiene una tienda por su ID
     * @param id ID de la tienda
     * @return Tienda encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Integer id) {
        StoreDTO store = storeService.getStoreById(id);
        return ResponseEntity.ok(store);
    }
    
    /**
     * POST /api/stores
     * Crea una nueva tienda
     * @param storeDTO Datos de la tienda
     * @return Tienda creada
     */
    @PostMapping
    public ResponseEntity<StoreDTO> createStore(@RequestBody StoreDTO storeDTO) {
        StoreDTO createdStore = storeService.createStore(storeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStore);
    }
    
    /**
     * PUT /api/stores/{id}
     * Actualiza una tienda existente
     * @param id ID de la tienda
     * @param storeDTO Nuevos datos
     * @return Tienda actualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<StoreDTO> updateStore(
            @PathVariable Integer id,
            @RequestBody StoreDTO storeDTO) {
        StoreDTO updatedStore = storeService.updateStore(id, storeDTO);
        return ResponseEntity.ok(updatedStore);
    }
    
    /**
     * DELETE /api/stores/{id}
     * Elimina una tienda
     * @param id ID de la tienda
     * @return Respuesta vacía
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Integer id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/stores/search?name={name}
     * Busca tiendas por nombre
     * @param name Nombre a buscar
     * @return Lista de tiendas que coinciden
     */
    @GetMapping("/search")
    public ResponseEntity<List<StoreDTO>> searchStoresByName(@RequestParam String name) {
        List<StoreDTO> stores = storeService.findStoresByName(name);
        return ResponseEntity.ok(stores);
    }
}
