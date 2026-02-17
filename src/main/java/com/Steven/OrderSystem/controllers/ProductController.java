package com.Steven.OrderSystem.controllers;

import com.Steven.OrderSystem.dto.ProductDTO;
import com.Steven.OrderSystem.enums.ProductType;
import com.Steven.OrderSystem.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar productos.
 * Endpoints:
 * - GET /api/products - Obtiene todos los productos
 * - GET /api/products/{id} - Obtiene un producto por ID
 * - POST /api/products - Crea un nuevo producto
 * - PUT /api/products/{id} - Actualiza un producto
 * - DELETE /api/products/{id} - Elimina un producto
 * - GET /api/products/type/{type} - Obtiene productos por tipo
 * - GET /api/products/search?name={name} - Busca productos por nombre
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    
    /**
     * GET /api/products
     * Obtiene todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/{id}
     * Obtiene un producto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * POST /api/products
     * Crea un nuevo producto
     * Body ejemplo:
     * {
     *   "name": "Jabón",
     *   "cost": 2.50,
     *   "type": "HYGIENE",
     *   "supplierId": 1
     * }
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
    
    /**
     * PUT /api/products/{id}
     * Actualiza un producto
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }
    
    /**
     * DELETE /api/products/{id}
     * Elimina un producto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/products/type/{type}
     * Obtiene productos por tipo (HYGIENE, PACKAGED, COLD, MEATS, VARIETIES)
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable ProductType type) {
        List<ProductDTO> products = productService.getProductsByType(type);
        return ResponseEntity.ok(products);
    }
    
    /**
     * GET /api/products/search?name={name}
     * Busca productos por nombre
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProductsByName(@RequestParam String name) {
        List<ProductDTO> products = productService.searchProductsByName(name);
        return ResponseEntity.ok(products);
    }
}
