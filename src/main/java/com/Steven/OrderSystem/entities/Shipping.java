package com.Steven.OrderSystem.entities;

import com.Steven.OrderSystem.enums.ShippingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa el Envío de un pedido.
 * Contiene información sobre la dirección, fechas y estado del envío.
 */
@Entity
@Table(name = "shippings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipping {
    
    /**
     * Identificador único del envío
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Dirección de envío
     */
    @Column(nullable = false, length = 500)
    private String address;
    
    /**
     * Fecha de envío
     */
    @Column(name = "ship_date", nullable = false)
    private LocalDate shipDate;
    
    /**
     * Fecha estimada de entrega
     */
    @Column(name = "delivery_date")
    private LocalDate deliveryDate;
    
    /**
     * Costo del envío
     */
    @Column(nullable = false)
    private Double cost = 0.0;
    
    /**
     * Estado del envío
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ShippingStatus status = ShippingStatus.PENDING;
    
    /**
     * Costo total calculado del envío
     */
    @Column(name = "calculate_cost")
    private Double calculateCost;
    
    /**
     * Pedido asociado a este envío
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
