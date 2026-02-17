package com.Steven.OrderSystem.services;

import com.Steven.OrderSystem.dto.OrderResponseDTO;
import com.Steven.OrderSystem.dto.OrderDTO;
import com.Steven.OrderSystem.dto.OrderDetailDTO;
import com.Steven.OrderSystem.entities.*;
import com.Steven.OrderSystem.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Servicio para gestionar operaciones relacionadas con pedidos.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;

    /**
     * Obtiene todos los pedidos
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Obtiene un pedido por ID
     */
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));
    }

    /**
     * CREA UN PEDIDO CORRECTAMENTE (con cascade JPA)
     */
    @Transactional
    public Order createOrder(OrderDTO orderDTO) {

        // 1️⃣ Verificar tienda
        Store store = storeRepository.findById(orderDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada con ID: " + orderDTO.getStoreId()));

        // 2️⃣ Crear Order
        Order order = new Order();
        order.setStore(store);
        order.setDeliveryAddress(orderDTO.getDeliveryAddress());
        order.setDate(orderDTO.getDate() != null ? orderDTO.getDate() : LocalDate.now());
        order.setType(orderDTO.getType());

        // 3️⃣ Crear detalles SIN guardar manualmente
        if (orderDTO.getOrderDetails() != null) {
            for (var detailDTO : orderDTO.getOrderDetails()) {

                Product product = productRepository.findById(detailDTO.getProductId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + detailDTO.getProductId()));

                OrderDetail detail = new OrderDetail();
                detail.setProduct(product);
                detail.setQuantity(detailDTO.getQuantity());
                detail.setPrice(detailDTO.getPrice());

                // usar helper del Order
                order.addOrderDetail(detail);
            }
        }

        // 4️⃣ Guardar SOLO el order → cascade guarda detalles
        return orderRepository.save(order);
    }
    public OrderResponseDTO toDTO(Order order) {
        return new OrderResponseDTO(
                order.getId(),
                order.getDeliveryAddress(),
                order.getDate(),
                order.getType(),
                order.getTotal(),
                order.getStore().getId(),
                order.getOrderDetails().stream()
                        .map(d -> new OrderDetailDTO(
                                d.getProduct().getId(),
                                d.getQuantity(),
                                d.getPrice()
                        ))
                        .toList()
        );
    }


    /**
     * Pedidos por tienda
     */
    public List<Order> getOrdersByStore(Integer storeId) {
        return orderRepository.findByStoreId(storeId);
    }

    /**
     * Pedidos por rango de fechas
     */
    public List<Order> getOrdersByDateRange(LocalDate startDate, LocalDate endDate) {
        return orderRepository.findByDateBetween(startDate, endDate);
    }

    /**
     * Eliminar pedido
     */
    @Transactional
    public void deleteOrder(Integer id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Pedido no encontrado con ID: " + id);
        }
        orderRepository.deleteById(id);
    }

    /**
     * Total de ventas por tienda
     */
    public Double getTotalSalesByStore(Integer storeId) {
        Double total = orderRepository.getTotalSalesByStore(storeId);
        return total != null ? total : 0.0;
    }
}
