package com.Steven.OrderSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa un Proveedor en el sistema.
 * Un proveedor suministra productos y puede tener múltiples facturas.
 */
@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {
    
    /**
     * Identificador único del proveedor
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Nombre del proveedor
     */
    @Column(nullable = false, length = 200)
    private String name;
    
    /**
     * ID del proveedor en sistema externo (opcional)
     */
    @Column(name = "supplier_id", length = 100)
    private String supplierId;
    
    /**
     * Nombre de la empresa del proveedor
     */
    @Column(name = "company_name", length = 200)
    private String companyName;
    
    /**
     * Lista de productos suministrados por este proveedor
     */
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
    
    /**
     * Lista de facturas del proveedor
     */
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<SupplierInvoice> invoices = new ArrayList<>();
}
