// ========================
// 🧪 TypeScript HR Lab Starter
// ========================

// TODO: 1. Define enum Role for users
enum Role {
  EMPLOYEE = "Employee",
  MANAGER = "Manager",
}

// TODO: 2. Define Interface Loginable
interface Loginable {
  authenticate(email: string, password: string): boolean;
}

// TODO: 3. Define abstract class User
abstract class User implements Loginable {
  public readonly id: number; // Auto-generated unique ID
  public createdAt: Date;

  constructor(
    public name: string,
    public email: string,
    private password: string
  ) {
    // Validate email format using HR utility
    if (!HR.isEmailValid(email)) {
      throw new Error("Invalid email format");
    }
    this.id = HR.generateUserId();
    this.createdAt = new Date();
  }

  // Common authentication logic
  authenticate(email: string, password: string): boolean {
    return this.email === email && this.password === password;
  }

  // Abstract method for subclass-specific role
  abstract getRole(): string;
}

// TODO: 4. Define Department class
class Department {
  constructor(public name: string, public employees: Employee[] = []) {}

  addEmployee(employee: Employee): void {
    if (this.employees.some((emp) => emp.id === employee.id)) {
      throw new Error("Employee already exists in this department");
    }
    this.employees.push(employee);
  }

  getDepartmentSize(): number {
    return this.employees.length;
  }
}

// TODO: 5. Define Employee class
class Employee extends User {
  protected department: Department;

  constructor(
    name: string,
    email: string,
    password: string,
    private _salary: number,
    department: Department
  ) {
    super(name, email, password);
    this.salary = _salary; // Use setter for validation
    this.department = department;
    this.department.addEmployee(this); // Register with department
  }

  get salary(): number {
    return this._salary;
  }

  set salary(value: number) {
    if (value < 3000) throw new Error("Salary must be >= 3000");
    this._salary = value;
  }

  // After-tax salary
  getNetSalary(): number {
    return this._salary - HR.calculateTax(this._salary);
  }

  // Apply a percentage-based raise
  promote(percentage: number): void {
    if (percentage < 0) throw new Error("Promotion percentage must be >= 0");
    this._salary *= 1 + percentage / 100;
  }

  getRole(): string {
    return Role.EMPLOYEE;
  }
}

// TODO: 6. Define Manager class
class Manager extends Employee {
  public team: Employee[] = [];

  // Add employee to team (prevent duplicates)
  addEmployeeToTeam(emp: Employee): void {
    if (this.team.some((member) => member.id === emp.id)) {
      throw new Error("Employee already in team");
    }
    this.team.push(emp);
  }

  // Remove employee from team by ID
  removeEmployeeFromTeam(empId: number): void {
    const index = this.team.findIndex((member) => member.id === empId);
    if (index === -1) {
      throw new Error("Employee not found in team");
    }
    this.team.splice(index, 1);
  }

  // Generate basic team report
  getTeamReport(): string[] {
    if (this.team.length === 0) return ["Team is currently empty."];
    else
      return this.team.map(
        (member) =>
          `ID: ${member.id}, Name: ${member.name}, Email: ${
            member.email
          }, Salary: ${member.salary}, Net Salary: ${member.getNetSalary()}`
      );
  }

  getRole(): string {
    return Role.MANAGER;
  }
}

// TODO: 7. Define HR utility class
class HR {
  private static userIdCounter = 1;

  // Auto-increment user ID generator
  static generateUserId(): number {
    return this.userIdCounter++;
  }

  // Email format validation using regex
  static isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Flat tax rate calculation (10%)
  static calculateTax(salary: number): number {
    return salary * 0.1;
  }

  // General-purpose report generator for users
  static generateReport(users: User[]): string[] {
    if (users.length === 0) return ["No users to report."];
    else
      return users.map(
        (user) =>
          `ID: ${user.id}, Role: ${user.getRole()}, Name: ${
            user.name
          }, Email: ${user.email}`
      );
  }
}

// Final test scenario can be written here...
// Create Departments
const devDept = new Department("Development");
const hrDept = new Department("HR");

// Create Employees
const emp1 = new Employee(
  "Muhsen",
  "muhsen@example.com",
  "pass222",
  5000,
  devDept
);
const emp2 = new Employee(
  "Muhsen",
  "muhsen@example.com",
  "pass222",
  4500,
  devDept
);

// Create Manager
const mgr = new Manager("Muhsen", "muhsen@example.com", "asd2", 8000, devDept);
mgr.addEmployeeToTeam(emp1);
mgr.addEmployeeToTeam(emp2);

// Generate Reports
console.log(HR.generateReport([emp1, emp2, mgr]));
console.log(mgr.getTeamReport());
