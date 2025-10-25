import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Student {
    private int studentID;
    private String name;
    private String department;
    private int marks;
    
    public Student() {}
    
    public Student(int studentID, String name, String department, int marks) {
        this.studentID = studentID;
        this.name = name;
        this.department = department;
        this.marks = marks;
    }

    public int getStudentID() { return studentID; }
    public void setStudentID(int studentID) { this.studentID = studentID; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }
    
    @Override
    public String toString() {
        return String.format("%-5d %-20s %-15s %-5d", studentID, name, department, marks);
    }
}

class StudentDAO {

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
    
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
    
    // CREATE - Add student
    public void addStudent(Student s) throws SQLException {
        String sql = "INSERT INTO Student (Name, Department, Marks) VALUES (?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.getName());
            ps.setString(2, s.getDepartment());
            ps.setInt(3, s.getMarks());
            ps.executeUpdate();
        }
    }
    
    public List<Student> getAllStudents() throws SQLException {
        String sql = "SELECT StudentID, Name, Department, Marks FROM Student";
        List<Student> students = new ArrayList<>();
        
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                Student s = new Student(
                    rs.getInt("StudentID"),
                    rs.getString("Name"),
                    rs.getString("Department"),
                    rs.getInt("Marks")
                );
                students.add(s);
            }
        }
        return students;
    }
    
    public boolean updateStudent(Student s) throws SQLException {
        String sql = "UPDATE Student SET Name=?, Department=?, Marks=? WHERE StudentID=?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            conn.setAutoCommit(false);  // Transaction
            
            ps.setString(1, s.getName());
            ps.setString(2, s.getDepartment());
            ps.setInt(3, s.getMarks());
            ps.setInt(4, s.getStudentID());
            
            int updated = ps.executeUpdate();
            if (updated == 1) {
                conn.commit();
                return true;
            } else {
                conn.rollback();
                return false;
            }
        }
    }
    
    public boolean deleteStudent(int id) throws SQLException {
        String sql = "DELETE FROM Student WHERE StudentID=?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            conn.setAutoCommit(false);  // Transaction
            
            ps.setInt(1, id);
            int deleted = ps.executeUpdate();
            
            if (deleted == 1) {
                conn.commit();
                return true;
            } else {
                conn.rollback();
                return false;
            }
        }
    }
}

public class PartC_StudentMVC {
    private static final StudentDAO dao = new StudentDAO();
    
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        while (true) {
            System.out.println("\n╔════════════════════════════╗");
            System.out.println("║   STUDENT MANAGEMENT       ║");
            System.out.println("║   (MVC Architecture)       ║");
            System.out.println("╚════════════════════════════╝");
            System.out.println("1. Add Student");
            System.out.println("2. View All Students");
            System.out.println("3. Update Student");
            System.out.println("4. Delete Student");
            System.out.println("5. Exit");
            System.out.print("\nChoose option: ");
            
            String choice = sc.nextLine().trim();
            
            try {
                switch (choice) {
                    case "1":
                        addStudent(sc);
                        break;
                    case "2":
                        viewAllStudents();
                        break;
                    case "3":
                        updateStudent(sc);
                        break;
                    case "4":
                        deleteStudent(sc);
                        break;
                    case "5":
                        System.out.println("Goodbye!");
                        sc.close();
                        return;
                    default:
                        System.out.println("Invalid option. Try again.");
                }
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
    
    private static void addStudent(Scanner sc) throws SQLException {
        System.out.print("Student Name: ");
        String name = sc.nextLine();
        System.out.print("Department: ");
        String dept = sc.nextLine();
        System.out.print("Marks: ");
        int marks = Integer.parseInt(sc.nextLine());
        
        Student s = new Student(0, name, dept, marks);
        dao.addStudent(s);
        System.out.println("✓ Student added successfully!");
    }
    
    private static void viewAllStudents() throws SQLException {
        List<Student> students = dao.getAllStudents();
        
        System.out.println("\n=== All Students ===");
        System.out.printf("%-5s %-20s %-15s %-5s%n", "ID", "Name", "Department", "Marks");
        System.out.println("-------------------------------------------------------");
        
        if (students.isEmpty()) {
            System.out.println("No students found.");
        } else {
            students.forEach(System.out::println);
        }
    }
    
    private static void updateStudent(Scanner sc) throws SQLException {
        System.out.print("Student ID to update: ");
        int id = Integer.parseInt(sc.nextLine());
        System.out.print("New Name: ");
        String name = sc.nextLine();
        System.out.print("New Department: ");
        String dept = sc.nextLine();
        System.out.print("New Marks: ");
        int marks = Integer.parseInt(sc.nextLine());
        
        Student s = new Student(id, name, dept, marks);
        boolean updated = dao.updateStudent(s);
        
        if (updated) {
            System.out.println("✓ Student updated successfully!");
        } else {
            System.out.println("✗ Student not found or update failed.");
        }
    }
    
    private static void deleteStudent(Scanner sc) throws SQLException {
        System.out.print("Student ID to delete: ");
        int id = Integer.parseInt(sc.nextLine());
        
        boolean deleted = dao.deleteStudent(id);
        
        if (deleted) {
            System.out.println("✓ Student deleted successfully!");
        } else {
            System.out.println("✗ Student not found or delete failed.");
        }
    }
}
