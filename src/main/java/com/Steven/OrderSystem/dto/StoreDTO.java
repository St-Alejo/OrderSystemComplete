package com.Steven.OrderSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear o actualizar una tienda
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreDTO {
    private Integer id;
    private String name;
    private String address;
    private Double balance;
}

