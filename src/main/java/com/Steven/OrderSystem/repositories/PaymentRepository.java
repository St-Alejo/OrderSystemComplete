package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Payment;
import com.Steven.OrderSystem.enums.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Payment.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByOrderId(Integer orderId);
    List<Payment> findByMethod(PaymentMethod method);
    List<Payment> findByStatus(String status);
    List<Payment> findByDateBetween(LocalDate startDate, LocalDate endDate);
}
