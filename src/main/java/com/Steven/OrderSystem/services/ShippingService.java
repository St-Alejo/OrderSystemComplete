package com.Steven.OrderSystem.services;

import com.Steven.OrderSystem.dto.ShippingDTO;
import com.Steven.OrderSystem.entities.Order;
import com.Steven.OrderSystem.entities.Shipping;
import com.Steven.OrderSystem.enums.ShippingStatus;
import com.Steven.OrderSystem.repositories.OrderRepository;
import com.Steven.OrderSystem.repositories.ShippingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio para gestionar envíos.
 */
@Service
@RequiredArgsConstructor
public class ShippingService {
    
    private final ShippingRepository shippingRepository;
    private final OrderRepository orderRepository;
    
    /**
     * Obtiene todos los envíos
     */
    public List<Shipping> getAllShippings() {
        return shippingRepository.findAll();
    }
    
    /**
     * Obtiene un envío por ID
     */
    public Shipping getShippingById(Integer id) {
        return shippingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado con ID: " + id));
    }
    
    /**
     * Crea un nuevo envío para un pedido
     */
    @Transactional
    public Shipping createShipping(ShippingDTO shippingDTO) {
        Order order = orderRepository.findById(shippingDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        Shipping shipping = new Shipping();
        shipping.setOrder(order);
        shipping.setAddress(shippingDTO.getAddress());
        shipping.setShipDate(shippingDTO.getShipDate());
        shipping.setDeliveryDate(shippingDTO.getDeliveryDate());
        shipping.setCost(shippingDTO.getCost());
        shipping.setStatus(shippingDTO.getStatus() != null ? shippingDTO.getStatus() : ShippingStatus.PENDING);
        
        return shippingRepository.save(shipping);
    }
    
    /**
     * Actualiza el estado de un envío
     */
    @Transactional
    public Shipping updateShippingStatus(Integer id, ShippingStatus status) {
        Shipping shipping = getShippingById(id);
        shipping.setStatus(status);
        return shippingRepository.save(shipping);
    }
    
    /**
     * Obtiene envío por pedido
     */
    public Shipping getShippingByOrder(Integer orderId) {
        return shippingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No se encontró envío para el pedido: " + orderId));
    }
    
    /**
     * Obtiene envíos por estado
     */
    public List<Shipping> getShippingsByStatus(ShippingStatus status) {
        return shippingRepository.findByStatus(status);
    }
}
