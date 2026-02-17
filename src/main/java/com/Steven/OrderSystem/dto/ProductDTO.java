package com.Steven.OrderSystem.dto;

import com.Steven.OrderSystem.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para crear o actualizar un producto
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Integer id;
    private String name;
    private BigDecimal cost;
    private ProductType type;
    private Integer supplierId;
}

/**
 * DTO para crear o actualizar detalle de producto
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class ProductDetailDTO {
    private Integer id;
    private String brand;
    private String description;
    private LocalDate expirationDate;
    private Double weight;
    private Boolean isCurrentConsume;
    private Integer productId;
}

/**
 * DTO para proveedor
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class SupplierDTO {
    private Integer id;
    private String name;
    private String supplierId;
    private String companyName;
}
