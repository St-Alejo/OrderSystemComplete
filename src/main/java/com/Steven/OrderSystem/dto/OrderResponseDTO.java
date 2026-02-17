package com.Steven.OrderSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDTO {

    private Integer id;
    private String deliveryAddress;
    private LocalDate date;
    private String type;
    private BigDecimal total;
    private Integer storeId;
    private List<OrderDetailDTO> orderDetails;
}
