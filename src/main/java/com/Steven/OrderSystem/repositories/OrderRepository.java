package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repositorio para la entidad Order.
 * Proporciona métodos de acceso a datos para pedidos.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    /**
     * Busca pedidos por ID de tienda
     * @param storeId ID de la tienda
     * @return Lista de pedidos de la tienda
     */
    List<Order> findByStoreId(Integer storeId);
    
    /**
     * Busca pedidos por fecha
     * @param date Fecha del pedido
     * @return Lista de pedidos en esa fecha
     */
    List<Order> findByDate(LocalDate date);
    
    /**
     * Busca pedidos entre dos fechas
     * @param startDate Fecha inicial
     * @param endDate Fecha final
     * @return Lista de pedidos en el rango
     */
    List<Order> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Busca pedidos por tienda y rango de fechas
     * @param storeId ID de la tienda
     * @param startDate Fecha inicial
     * @param endDate Fecha final
     * @return Lista de pedidos que cumplen los criterios
     */
    @Query("SELECT o FROM Order o WHERE o.store.id = :storeId AND o.date BETWEEN :startDate AND :endDate")
    List<Order> findByStoreAndDateRange(
            @Param("storeId") Integer storeId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    
    /**
     * Obtiene el total de ventas por tienda
     * @param storeId ID de la tienda
     * @return Total de ventas
     */
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.store.id = :storeId")
    Double getTotalSalesByStore(@Param("storeId") Integer storeId);
}
