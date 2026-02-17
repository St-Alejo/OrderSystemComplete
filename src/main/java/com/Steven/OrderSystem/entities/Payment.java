package com.Steven.OrderSystem.entities;

import com.Steven.OrderSystem.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa un Pago en el sistema.
 * Almacena información sobre el método, monto y estado del pago.
 */
@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    
    /**
     * Identificador único del pago
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Fecha del pago
     */
    @Column(nullable = false)
    private LocalDate date;
    
    /**
     * Monto del pago
     */
    @Column(nullable = false)
    private Double amount;
    
    /**
     * Método de pago utilizado (CASH, CARD, etc.)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentMethod method;
    
    /**
     * Estado del pago (ej: PENDING, COMPLETED, FAILED)
     */
    @Column(nullable = false, length = 50)
    private String status = "PENDING";
    
    /**
     * Pedido asociado a este pago
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}
