package com.Steven.OrderSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para crear un pedido completo con sus detalles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer id;
    private String deliveryAddress;
    private LocalDate date;
    private String type;
    private Integer storeId;
    private List<OrderDetailDTO> orderDetails;
}

