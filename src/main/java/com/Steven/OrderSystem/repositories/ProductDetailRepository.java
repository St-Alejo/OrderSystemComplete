package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad ProductDetail.
 */
@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    List<ProductDetail> findByProductId(Integer productId);
    List<ProductDetail> findByBrand(String brand);
    List<ProductDetail> findByExpirationDateBefore(LocalDate date);
}
