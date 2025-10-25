import java.sql.*;
import java.util.Scanner;

// Product CRUD with Menu and Transactions
public class PartB_ProductCRUD {
    
    // MySQL Connection Details 
    private static final String DB_URL = "jdbc:mysql://localhost:3306/schooldb?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "Mabud123@"; 
    
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
    
    private static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
    
    private static void createProduct(Scanner sc) {
        try {
            System.out.print("Product Name: ");
            String name = sc.nextLine();
            System.out.print("Price: ");
            double price = Double.parseDouble(sc.nextLine());
            System.out.print("Quantity: ");
            int qty = Integer.parseInt(sc.nextLine());
            
            String sql = "INSERT INTO Product (ProductName, Price, Quantity) VALUES (?, ?, ?)";
            try (Connection conn = getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setString(1, name);
                ps.setDouble(2, price);
                ps.setInt(3, qty);
                ps.executeUpdate();
                System.out.println("✓ Product added successfully!");
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void readProducts() {
        String sql = "SELECT ProductID, ProductName, Price, Quantity FROM Product";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            System.out.println("\n=== All Products ===");
            System.out.printf("%-5s %-20s %-10s %-10s%n", "ID", "Name", "Price", "Quantity");
            System.out.println("---------------------------------------------------");
            
            boolean hasData = false;
            while (rs.next()) {
                hasData = true;
                System.out.printf("%-5d %-20s %-10.2f %-10d%n",
                    rs.getInt("ProductID"),
                    rs.getString("ProductName"),
                    rs.getDouble("Price"),
                    rs.getInt("Quantity"));
            }
            
            if (!hasData) {
                System.out.println("No products found.");
            }
            
        } catch (SQLException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void updateProduct(Scanner sc) {
        try {
            System.out.print("Product ID to update: ");
            int id = Integer.parseInt(sc.nextLine());
            System.out.print("New Product Name: ");
            String name = sc.nextLine();
            System.out.print("New Price: ");
            double price = Double.parseDouble(sc.nextLine());
            System.out.print("New Quantity: ");
            int qty = Integer.parseInt(sc.nextLine());
            
            String sql = "UPDATE Product SET ProductName=?, Price=?, Quantity=? WHERE ProductID=?";
            try (Connection conn = getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                
                conn.setAutoCommit(false);  // Start transaction
                
                ps.setString(1, name);
                ps.setDouble(2, price);
                ps.setInt(3, qty);
                ps.setInt(4, id);
                
                int updated = ps.executeUpdate();
                if (updated == 1) {
                    conn.commit();
                    System.out.println("✓ Product updated successfully!");
                } else {
                    conn.rollback();
                    System.out.println("✗ Product not found or update failed.");
                }
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    private static void deleteProduct(Scanner sc) {
        try {
            System.out.print("Product ID to delete: ");
            int id = Integer.parseInt(sc.nextLine());
            
            String sql = "DELETE FROM Product WHERE ProductID=?";
            try (Connection conn = getConnection();
                 PreparedStatement ps = conn.prepareStatement(sql)) {
                
                conn.setAutoCommit(false);  // Start transaction
                
                ps.setInt(1, id);
                int deleted = ps.executeUpdate();
                
                if (deleted == 1) {
                    conn.commit();
                    System.out.println("✓ Product deleted successfully!");
                } else {
                    conn.rollback();
                    System.out.println("✗ Product not found or delete failed.");
                }
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    // Main menu
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        while (true) {
            System.out.println("\n╔════════════════════════════╗");
            System.out.println("║   PRODUCT MANAGEMENT       ║");
            System.out.println("╚════════════════════════════╝");
            System.out.println("1. Create Product");
            System.out.println("2. View All Products");
            System.out.println("3. Update Product");
            System.out.println("4. Delete Product");
            System.out.println("5. Exit");
            System.out.print("\nChoose option: ");
            
            String choice = sc.nextLine().trim();
            
            switch (choice) {
                case "1":
                    createProduct(sc);
                    break;
                case "2":
                    readProducts();
                    break;
                case "3":
                    updateProduct(sc);
                    break;
                case "4":
                    deleteProduct(sc);
                    break;
                case "5":
                    System.out.println("Goodbye!");
                    sc.close();
                    return;
                default:
                    System.out.println("Invalid option. Try again.");
            }
        }
    }
}
