package com.inventory.service;

import com.inventory.dto.SaleItemRequest;
import com.inventory.dto.SaleRequest;
import com.inventory.model.Product;
import com.inventory.model.SalesItem;
import com.inventory.model.SalesOrder;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SalesService {

    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;

    public SalesService(SalesOrderRepository salesOrderRepository,
                        ProductRepository productRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public SalesOrder createSale(SaleRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Sale must have at least one item");
        }

        SalesOrder order = new SalesOrder();
        order.setCustomerName(request.getCustomerName());

        double total = 0.0;

        for (SaleItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            if (product.getStockQuantity() == null ||
                product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            SalesItem item = new SalesItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPricePerUnit(product.getSellingPrice());
            double lineTotal = product.getSellingPrice() * itemReq.getQuantity();
            item.setLineTotal(lineTotal);

            order.getItems().add(item);
            total += lineTotal;
        }

        order.setTotalAmount(total);
        return salesOrderRepository.save(order);
    }
}
