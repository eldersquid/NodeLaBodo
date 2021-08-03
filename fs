Supplier.hasMany(Productcat, { foreignKey: 'supplierId', as: "supplierID" });
            Productcat.belongsTo(Supplier, { foreignKey: 'supplierId', as: "supplierID" });

            Supplier.hasMany(Inventory, { foreignKey: 'supplierId' , as: "SupplierID" });
            Inventory.belongsTo(Supplier, { foreignKey: 'supplierId', as: "SupplierID" });

            Supplier.hasMany(Order, { foreignKey: 'supplierId', as: "Supplier_ID" });
            Order.belongsTo(Supplier, { foreignKey: 'supplierId', as: "Supplier_ID" });

            // Inventory
            // admin.hasMany(Inventory, {foreignKey: 'inventory_id'});
            // inventory.belongsTo(Admin, {foreignKey: 'inventory_id'});

            Inventory.hasOne(Productcat, { foreignKey: 'inventoryId', as: "inventoryID" });
            Productcat.belongsTo(Inventory, { foreignKey: 'inventoryId', as: "inventoryID" });

            // Orders
            // admin.hasMany(Order, { foreignKey: 'order_id' });
            // order.belongsTo(Admin, { foreignKey: 'order_id' });

            Order.hasOne(Inventory, { foreignKey: 'orderId', as: "OrderID" });
            Inventory.belongsTo(Order, { foreignKey: 'orderId', as: "OrderID" });