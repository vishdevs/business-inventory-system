package com.inventory.controller;

import com.inventory.dto.SaleRequest;
import com.inventory.model.SalesOrder;
import com.inventory.service.SalesService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @PostMapping
    public SalesOrder createSale(@RequestBody SaleRequest request) {
        return salesService.createSale(request);
    }
}
