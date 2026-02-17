package com.Steven.OrderSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa una Tienda en el sistema.
 * Una tienda puede realizar múltiples pedidos.
 */
@Entity
@Table(name = "stores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Store {
    
    /**
     * Identificador único de la tienda
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Nombre de la tienda
     */
    @Column(nullable = false, length = 200)
    private String name;
    
    /**
     * Dirección física de la tienda
     */
    @Column(nullable = false, length = 500)
    private String address;
    
    /**
     * Balance o saldo actual de la tienda
     */
    @Column(nullable = false)
    private Double balance = 0.0;
    
    /**
     * Lista de pedidos realizados por esta tienda
     */
    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();
    
    /**
     * Agrega un nuevo pedido a la tienda
     * @param order El pedido a agregar
     */
    public void addOrder(Order order) {
        orders.add(order);
        order.setStore(this);
    }
    
    /**
     * Remueve un pedido de la tienda
     * @param order El pedido a remover
     */
    public void removeOrder(Order order) {
        orders.remove(order);
        order.setStore(null);
    }
}
