package com.Steven.OrderSystem.repositories;

import com.Steven.OrderSystem.entities.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Store.
 * Proporciona métodos de acceso a datos para tiendas.
 */
@Repository
public interface StoreRepository extends JpaRepository<Store, Integer> {
    
    /**
     * Busca una tienda por su nombre
     * @param name Nombre de la tienda
     * @return Optional con la tienda si existe
     */
    Optional<Store> findByName(String name);
    
    /**
     * Busca tiendas cuyo nombre contenga el texto especificado
     * @param name Texto a buscar en el nombre
     * @return Lista de tiendas que coinciden
     */
    List<Store> findByNameContainingIgnoreCase(String name);
    
    /**
     * Busca tiendas con balance mayor al especificado
     * @param balance Balance mínimo
     * @return Lista de tiendas que cumplen la condición
     */
    List<Store> findByBalanceGreaterThan(Double balance);
}
