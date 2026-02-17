package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.SupplierInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad SupplierInvoice.
 */
@Repository
public interface SupplierInvoiceRepository extends JpaRepository<SupplierInvoice, Integer> {
    List<SupplierInvoice> findBySupplierId(Integer supplierId);
    List<SupplierInvoice> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(si.totalCost) FROM SupplierInvoice si WHERE si.supplier.id = :supplierId")
    Double getTotalCostBySupplier(@Param("supplierId") Integer supplierId);
}
