package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Product;
import com.Steven.OrderSystem.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Product.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByType(ProductType type);
    List<Product> findBySupplierId(Integer supplierId);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByCostBetween(Double minCost, Double maxCost);
}
