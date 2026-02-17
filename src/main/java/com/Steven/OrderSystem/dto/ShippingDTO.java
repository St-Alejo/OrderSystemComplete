package com.Steven.OrderSystem.dto;

import com.Steven.OrderSystem.enums.PaymentMethod;
import com.Steven.OrderSystem.enums.ShippingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO para crear o actualizar envío
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDTO {
    private Integer id;
    private String address;
    private LocalDate shipDate;
    private LocalDate deliveryDate;
    private Double cost;
    private ShippingStatus status;
    private Integer orderId;
}

/**
 * DTO para crear o actualizar pago
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
class PaymentDTO {
    private Integer id;
    private LocalDate date;
    private Double amount;
    private PaymentMethod method;
    private String status;
    private Integer orderId;
}
