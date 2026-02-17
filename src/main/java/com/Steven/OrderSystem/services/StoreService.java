package com.Steven.OrderSystem.services;

import com.Steven.OrderSystem.dto.StoreDTO;
import com.Steven.OrderSystem.entities.Store;
import com.Steven.OrderSystem.repositories.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar operaciones relacionadas con tiendas.
 * Proporciona métodos para crear, actualizar, eliminar y consultar tiendas.
 */
@Service
@RequiredArgsConstructor
public class StoreService {
    
    private final StoreRepository storeRepository;
    
    /**
     * Obtiene todas las tiendas
     * @return Lista de DTOs de tiendas
     */
    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene una tienda por su ID
     * @param id ID de la tienda
     * @return DTO de la tienda
     * @throws RuntimeException si no se encuentra la tienda
     */
    public StoreDTO getStoreById(Integer id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada con ID: " + id));
        return convertToDTO(store);
    }
    
    /**
     * Crea una nueva tienda
     * @param storeDTO DTO con los datos de la tienda
     * @return DTO de la tienda creada
     */
    @Transactional
    public StoreDTO createStore(StoreDTO storeDTO) {
        Store store = new Store();
        store.setName(storeDTO.getName());
        store.setAddress(storeDTO.getAddress());
        store.setBalance(storeDTO.getBalance() != null ? storeDTO.getBalance() : 0.0);
        
        Store savedStore = storeRepository.save(store);
        return convertToDTO(savedStore);
    }
    
    /**
     * Actualiza una tienda existente
     * @param id ID de la tienda
     * @param storeDTO DTO con los nuevos datos
     * @return DTO de la tienda actualizada
     */
    @Transactional
    public StoreDTO updateStore(Integer id, StoreDTO storeDTO) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada con ID: " + id));
        
        if (storeDTO.getName() != null) {
            store.setName(storeDTO.getName());
        }
        if (storeDTO.getAddress() != null) {
            store.setAddress(storeDTO.getAddress());
        }
        if (storeDTO.getBalance() != null) {
            store.setBalance(storeDTO.getBalance());
        }
        
        Store updatedStore = storeRepository.save(store);
        return convertToDTO(updatedStore);
    }
    
    /**
     * Elimina una tienda
     * @param id ID de la tienda a eliminar
     */
    @Transactional
    public void deleteStore(Integer id) {
        if (!storeRepository.existsById(id)) {
            throw new RuntimeException("Tienda no encontrada con ID: " + id);
        }
        storeRepository.deleteById(id);
    }
    
    /**
     * Busca tiendas por nombre
     * @param name Nombre a buscar
     * @return Lista de tiendas que coinciden
     */
    public List<StoreDTO> findStoresByName(String name) {
        return storeRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convierte una entidad Store a DTO
     * @param store Entidad a convertir
     * @return DTO de la tienda
     */
    private StoreDTO convertToDTO(Store store) {
        StoreDTO dto = new StoreDTO();
        dto.setId(store.getId());
        dto.setName(store.getName());
        dto.setAddress(store.getAddress());
        dto.setBalance(store.getBalance());
        return dto;
    }
}
