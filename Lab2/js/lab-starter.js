"use strict";
// ========================
// 🧪 TypeScript HR Lab Starter
// ========================
// TODO: 1. Define enum Role for users
var Role;
(function (Role) {
    Role["EMPLOYEE"] = "Employee";
    Role["MANAGER"] = "Manager";
})(Role || (Role = {}));
// TODO: 3. Define abstract class User
class User {
    name;
    email;
    password;
    id; // Auto-generated unique ID
    createdAt;
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
        // Validate email format using HR utility
        if (!HR.isEmailValid(email)) {
            throw new Error("Invalid email format");
        }
        this.id = HR.generateUserId();
        this.createdAt = new Date();
    }
    // Common authentication logic
    authenticate(email, password) {
        return this.email === email && this.password === password;
    }
}
// TODO: 4. Define Department class
class Department {
    name;
    employees;
    constructor(name, employees = []) {
        this.name = name;
        this.employees = employees;
    }
    addEmployee(employee) {
        if (this.employees.some(emp => emp.id === employee.id)) {
            throw new Error("Employee already exists in this department");
        }
        this.employees.push(employee);
    }
    getDepartmentSize() {
        return this.employees.length;
    }
}
// TODO: 5. Define Employee class
class Employee extends User {
    _salary;
    department;
    constructor(name, email, password, _salary, department) {
        super(name, email, password);
        this._salary = _salary;
        this.salary = _salary; // Use setter for validation
        this.department = department;
        this.department.addEmployee(this); // Register with department
    }
    get salary() {
        return this._salary;
    }
    set salary(value) {
        if (value < 3000)
            throw new Error("Salary must be >= 3000");
        this._salary = value;
    }
    // After-tax salary
    getNetSalary() {
        return this._salary - HR.calculateTax(this._salary);
    }
    // Apply a percentage-based raise
    promote(percentage) {
        if (percentage < 0)
            throw new Error("Promotion percentage must be >= 0");
        this._salary *= (1 + (percentage / 100));
    }
    getRole() {
        return Role.EMPLOYEE;
    }
}
// TODO: 6. Define Manager class
class Manager extends Employee {
    team = [];
    // Add employee to team (prevent duplicates)
    addEmployeeToTeam(emp) {
        if (this.team.some(member => member.id === emp.id)) {
            throw new Error("Employee already in team");
        }
        this.team.push(emp);
    }
    // Remove employee from team by ID
    removeEmployeeFromTeam(empId) {
        const index = this.team.findIndex(member => member.id === empId);
        if (index === -1) {
            throw new Error("Employee not found in team");
        }
        this.team.splice(index, 1);
    }
    // Generate basic team report
    getTeamReport() {
        if (this.team.length === 0)
            return ["Team is currently empty."];
        else
            return this.team.map(member => `ID: ${member.id}, Name: ${member.name}, Email: ${member.email}, Salary: ${member.salary}, Net Salary: ${member.getNetSalary()}`);
    }
    getRole() {
        return Role.MANAGER;
    }
}
// TODO: 7. Define HR utility class
class HR {
    static userIdCounter = 1;
    // Auto-increment user ID generator
    static generateUserId() {
        return this.userIdCounter++;
    }
    // Email format validation using regex
    static isEmailValid(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    // Flat tax rate calculation (10%)
    static calculateTax(salary) {
        return salary * 0.1;
    }
    // General-purpose report generator for users
    static generateReport(users) {
        if (users.length === 0)
            return ["No users to report."];
        else
            return users.map(user => `ID: ${user.id}, Role: ${user.getRole()}, Name: ${user.name}, Email: ${user.email}`);
    }
}
// Final test scenario can be written here...
// Create Departments
const devDept = new Department("Development");
const hrDept = new Department("HR");
// Create Employees
const emp1 = new Employee("Ahmed", "ahmed@example.com", "pass123", 5000, devDept);
const emp2 = new Employee("Aseel", "aseel@example.com", "pass456", 4500, devDept);
// Create Manager
const mgr = new Manager("Atef", "atef@example.com", "admin789", 8000, devDept);
mgr.addEmployeeToTeam(emp1);
mgr.addEmployeeToTeam(emp2);
// Generate Reports
console.log(HR.generateReport([emp1, emp2, mgr]));
console.log(mgr.getTeamReport());
