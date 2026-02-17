package com.Steven.OrderSystem.enums;

/**
 * Enumeración que define los métodos de pago disponibles en el sistema.
 */
public enum PaymentMethod {
    /**
     * Pago en efectivo
     */
    CASH,
    
    /**
     * Pago con tarjeta de crédito/débito
     */
    CARD,
    
    /**
     * Transferencia bancaria
     */
    BANK_TRANSFER,
    
    /**
     * Pago digital (PayPal, etc.)
     */
    DIGITAL_WALLET,
    
    /**
     * Pago contra entrega
     */
    CASH_ON_DELIVERY
}
