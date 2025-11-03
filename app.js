require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./models/Customer');

// Povezivanje na MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Funkcija za prikaz menija
const showMenu = () => {
  console.log("\nWelcome to the CRM\n");
  console.log("What would you like to do?\n");
  console.log("  1. Create a customer");
  console.log("  2. View all customers");
  console.log("  3. Update a customer");
  console.log("  4. Delete a customer");
  console.log("  5. Quit\n");
};

// Funkcija za kreiranje novog korisnika
const createCustomer = async () => {
  const name = prompt("Enter customer's name: ");
  const age = parseInt(prompt("Enter customer's age: "));
  const customer = new Customer({ name, age });
  await customer.save();
  console.log(`Customer ${name} added!`);
};

// Funkcija za prikaz svih korisnika
const viewCustomers = async () => {
  const customers = await Customer.find();
  if(customers.length === 0) console.log("No customers found.");
  customers.forEach(c => console.log(`id: ${c._id} -- Name: ${c.name}, Age: ${c.age}`));
};

// Funkcija za update korisnika
const updateCustomer = async () => {
  await viewCustomers();
  const id = prompt("Copy and paste the id of the customer to update: ");
  const customer = await Customer.findById(id);
  if(!customer) {
    console.log("Customer not found.");
    return;
  }
  const newName = prompt("Enter new name: ");
  const newAge = parseInt(prompt("Enter new age: "));
  customer.name = newName;
  customer.age = newAge;
  await customer.save();
  console.log("Customer updated successfully!");
};

// Funkcija za brisanje korisnika
const deleteCustomer = async () => {
  await viewCustomers();
  const id = prompt("Copy and paste the id of the customer to delete: ");
  const customer = await Customer.findById(id);
  if(!customer) {
    console.log("Customer not found.");
    return;
  }
  await Customer.deleteOne({ _id: id });
  console.log("Customer deleted successfully!");
};

// Glavna petlja
const main = async () => {
  let running = true;
  while(running) {
    showMenu();
    const choice = prompt("Number of action to run: ");
    switch(choice) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        console.log("Exiting the application...");
        running = false;
        break;
      default:
        console.log("Invalid choice, try again.");
    }
  }
  mongoose.connection.close();
};

main();
