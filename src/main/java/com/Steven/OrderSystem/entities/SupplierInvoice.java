package com.Steven.OrderSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Entidad que representa una Factura del Proveedor.
 * Registra las compras realizadas al proveedor.
 */
@Entity
@Table(name = "supplier_invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierInvoice {
    
    /**
     * Identificador único de la factura
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Número de factura
     */
    @Column(name = "invoice_id", length = 100)
    private String invoiceId;
    
    /**
     * Fecha de la factura
     */
    @Column(nullable = false)
    private LocalDate date;
    
    /**
     * Cantidad de productos en la factura
     */
    @Column(nullable = false)
    private Integer quantity;
    
    /**
     * Costo total de la factura
     */
    @Column(name = "total_cost", nullable = false)
    private Double totalCost;
    
    /**
     * Fecha de generación de la factura
     */
    @Column(name = "generate_date")
    private LocalDate generateDate;
    
    /**
     * Proveedor asociado a esta factura
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;
}
