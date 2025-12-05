package com.inventory.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sales_items")
public class SalesItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    private Double pricePerUnit;

    private Double lineTotal;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private SalesOrder order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public SalesItem() {
    }

    // getters & setters
    public Long getId() { return id; }
    public Integer getQuantity() { return quantity; }
    public Double getPricePerUnit() { return pricePerUnit; }
    public Double getLineTotal() { return lineTotal; }
    public SalesOrder getOrder() { return order; }
    public Product getProduct() { return product; }

    public void setId(Long id) { this.id = id; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public void setLineTotal(Double lineTotal) { this.lineTotal = lineTotal; }
    public void setOrder(SalesOrder order) { this.order = order; }
    public void setProduct(Product product) { this.product = product; }
}
