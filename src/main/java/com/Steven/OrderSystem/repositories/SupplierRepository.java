package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Supplier.
 */
@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    Optional<Supplier> findBySupplierId(String supplierId);
    List<Supplier> findByNameContainingIgnoreCase(String name);
    Optional<Supplier> findByCompanyName(String companyName);
}
