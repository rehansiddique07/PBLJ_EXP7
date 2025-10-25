import java.sql.*;

// Part A: Connect and Read Employee Data
public class PartA_EmployeeRead {
    
    // MySQL Connection Details
    private static final String DB_URL = "jdbc:mysql://localhost:3306/schooldb?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "Mabud123@"; 
    
    public static void main(String[] args) {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL Driver not found!");
            e.printStackTrace();
            return;
        }
        
        String sql = "SELECT EmpID, Name, Salary FROM Employee";
        
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            System.out.println("=== Employee Records ===");
            System.out.printf("%-6s %-20s %-10s%n", "EmpID", "Name", "Salary");
            System.out.println("------------------------------------------");
            
            while (rs.next()) {
                int id = rs.getInt("EmpID");
                String name = rs.getString("Name");
                double salary = rs.getDouble("Salary");
                System.out.printf("%-6d %-20s %-10.2f%n", id, name, salary);
            }
            
        } catch (SQLException e) {
            System.err.println("Database Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
