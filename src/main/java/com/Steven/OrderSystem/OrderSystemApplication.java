package com.Steven.OrderSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Spring Boot.
 *
 * Esta clase arranca el servidor y configura automáticamente:
 * - Conexión a la base de datos
 * - Controladores REST
 * - Servicios y repositorios
 * - Configuración CORS
 *
 * Para ejecutar:
 * 1. Desde terminal: mvn spring-boot:run
 * 2. Desde IDE: Run como aplicación Java
 *
 * El servidor se iniciará en: http://localhost:8080
 *
 * @author Steven
 * @version 1.0.0
 */
@SpringBootApplication
public class OrderSystemApplication {

	/**
	 * Método principal que arranca la aplicación Spring Boot
	 * @param args Argumentos de línea de comandos
	 */
	public static void main(String[] args) {
		SpringApplication.run(OrderSystemApplication.class, args);

		System.out.println("===============================================");
		System.out.println("🚀 SISTEMA DE GESTIÓN DE PEDIDOS INICIADO");
		System.out.println("===============================================");
		System.out.println("📡 API REST disponible en: http://localhost:8080/api");
		System.out.println("📚 Endpoints principales:");
		System.out.println("   - Tiendas:   /api/stores");
		System.out.println("   - Productos: /api/products");
		System.out.println("   - Pedidos:   /api/orders");
		System.out.println("   - Envíos:    /api/shippings");
		System.out.println("===============================================");
		System.out.println("✅ Servidor listo para recibir peticiones");
		System.out.println("===============================================");
	}
}
