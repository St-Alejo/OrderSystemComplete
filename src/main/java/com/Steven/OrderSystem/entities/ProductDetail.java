package com.Steven.OrderSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa el Detalle de un Producto.
 * Almacena información específica de una variación del producto
 * (marca, descripción, fecha de expiración, peso, etc.)
 */
@Entity
@Table(name = "product_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetail {
    
    /**
     * Identificador único del detalle del producto
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Marca del producto
     */
    @Column(length = 100)
    private String brand;
    
    /**
     * Descripción detallada del producto
     */
    @Column(length = 1000)
    private String description;
    
    /**
     * Fecha de expiración del producto
     */
    @Column(name = "expiration_date")
    private LocalDate expirationDate;
    
    /**
     * Peso del producto en la unidad correspondiente
     */
    private Double weight;
    
    /**
     * Indica si el producto es de consumo actual
     */
    @Column(name = "is_current_consume")
    private Boolean isCurrentConsume = false;
    
    /**
     * Producto al que pertenece este detalle
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
