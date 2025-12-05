package com.inventory.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private Double buyingPrice;

    private Double sellingPrice;

    private Integer stockQuantity;

    private Boolean active = true;

    public Product() {
    }

    public Product(String name, String category,
                   Double buyingPrice, Double sellingPrice,
                   Integer stockQuantity) {
        this.name = name;
        this.category = category;
        this.buyingPrice = buyingPrice;
        this.sellingPrice = sellingPrice;
        this.stockQuantity = stockQuantity;
        this.active = true;
    }

    // getters & setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Double getBuyingPrice() { return buyingPrice; }
    public Double getSellingPrice() { return sellingPrice; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Boolean getActive() { return active; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setBuyingPrice(Double buyingPrice) { this.buyingPrice = buyingPrice; }
    public void setSellingPrice(Double sellingPrice) { this.sellingPrice = sellingPrice; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public void setActive(Boolean active) { this.active = active; }
  }
