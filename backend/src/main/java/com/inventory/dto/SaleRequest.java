package com.inventory.dto;

import java.util.List;

public class SaleRequest {

    private String customerName;
    private List<SaleItemRequest> items;

    public SaleRequest() {
    }

    public String getCustomerName() { return customerName; }
    public List<SaleItemRequest> getItems() { return items; }

    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setItems(List<SaleItemRequest> items) { this.items = items; }
}
