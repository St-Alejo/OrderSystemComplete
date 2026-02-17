package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Shipping;
import com.Steven.OrderSystem.enums.ShippingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Shipping.
 */
@Repository
public interface ShippingRepository extends JpaRepository<Shipping, Integer> {
    Optional<Shipping> findByOrderId(Integer orderId);
    List<Shipping> findByStatus(ShippingStatus status);
    List<Shipping> findByShipDateBetween(LocalDate startDate, LocalDate endDate);
    List<Shipping> findByDeliveryDateBefore(LocalDate date);
}
