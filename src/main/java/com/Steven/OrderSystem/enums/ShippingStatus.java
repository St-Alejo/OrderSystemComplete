package com.Steven.OrderSystem.enums;

/**
 * Enumeración que representa los estados posibles de un envío.
 */
public enum ShippingStatus {
    /**
     * Envío pendiente de procesamiento
     */
    PENDING,
    
    /**
     * Envío en proceso de preparación
     */
    PROCESSING,
    
    /**
     * Envío en tránsito
     */
    IN_TRANSIT,
    
    /**
     * Envío entregado exitosamente
     */
    DELIVERED,
    
    /**
     * Envío cancelado
     */
    CANCELLED,
    
    /**
     * Envío devuelto
     */
    RETURNED
}
