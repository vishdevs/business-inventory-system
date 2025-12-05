package com.inventory.controller;

import com.inventory.dto.DashboardSummary;
import com.inventory.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProductRepository productRepository;

    public DashboardController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/summary")
    public DashboardSummary getSummary() {
        var products = productRepository.findByActiveTrue();
        long total = products.size();
        long lowStock = products.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= 5)
                .count();
        double revenue = 128900.0; // demo value

        return new DashboardSummary(total, lowStock, revenue);
    }
}
