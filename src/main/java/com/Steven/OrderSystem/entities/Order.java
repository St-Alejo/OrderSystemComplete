package com.Steven.OrderSystem.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    /** Identificador único del pedido */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** Dirección de entrega del pedido */
    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    /** Fecha del pedido */
    @Column(nullable = false)
    private LocalDate date;

    /** Tipo de producto principal del pedido */
    @Column(length = 50)
    private String type;

    /** Total del pedido (calculado automáticamente) */
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal total = BigDecimal.ZERO;

    /** Tienda que realiza el pedido */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    @JsonBackReference(value = "store-orders")
    private Store store;

    /** Lista de detalles del pedido */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "order-details")
    private List<OrderDetail> orderDetails = new ArrayList<>();

    /** Información de envío asociada al pedido */
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "order-shipping")
    private Shipping shipping;

    /** Información de pago asociada al pedido */
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "order-payment")
    private Payment payment;

    /** Agrega un detalle y recalcula el total */
    public void addOrderDetail(OrderDetail detail) {
        orderDetails.add(detail);
        detail.setOrder(this);
        calculateTotal();
    }

    /** Remueve un detalle y recalcula el total */
    public void removeOrderDetail(OrderDetail detail) {
        orderDetails.remove(detail);
        detail.setOrder(null);
        calculateTotal();
    }

    /** Calcula el total sumando subtotales */
    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        this.total = orderDetails.stream()
                .map(OrderDetail::getSubtotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
