package com.Steven.OrderSystem.services;

import com.Steven.OrderSystem.dto.ProductDTO;
import com.Steven.OrderSystem.entities.Product;
import com.Steven.OrderSystem.entities.Supplier;
import com.Steven.OrderSystem.enums.ProductType;
import com.Steven.OrderSystem.repositories.ProductRepository;
import com.Steven.OrderSystem.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar productos.
 */
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    
    /**
     * Obtiene todos los productos
     */
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un producto por ID
     */
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return convertToDTO(product);
    }
    
    /**
     * Crea un nuevo producto
     */
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setCost(productDTO.getCost());
        product.setType(productDTO.getType());
        
        if (productDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
            product.setSupplier(supplier);
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }
    
    /**
     * Actualiza un producto
     */
    @Transactional
    public ProductDTO updateProduct(Integer id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getCost() != null) product.setCost(productDTO.getCost());
        if (productDTO.getType() != null) product.setType(productDTO.getType());
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    /**
     * Elimina un producto
     */
    @Transactional
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productRepository.deleteById(id);
    }
    
    /**
     * Busca productos por tipo
     */
    public List<ProductDTO> getProductsByType(ProductType type) {
        return productRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Busca productos por nombre
     */
    public List<ProductDTO> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convierte entidad a DTO
     */
    private ProductDTO convertToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCost(product.getCost());
        dto.setType(product.getType());
        if (product.getSupplier() != null) {
            dto.setSupplierId(product.getSupplier().getId());
        }
        return dto;
    }
}
