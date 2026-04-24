// seed/seed.js
// Database seed script - creates initial admin, users, topics, quizzes, and questions
// Run with: npm run seed

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load .env from the backend root (one level up from seed/)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
const User = require('../models/User');
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizmaster';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Topic.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();
    await Attempt.deleteMany();
    console.log('🗑️  Cleared existing data');

    // ========================
    // Create Admin + Users
    // ========================
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@quizmaster.com',
      password: 'admin123',
      role: 'admin',
    });

    const user1 = await User.create({ name: 'Alice Johnson', email: 'alice@example.com', password: 'user1234', role: 'user' });
    const user2 = await User.create({ name: 'Bob Smith', email: 'bob@example.com', password: 'user1234', role: 'user' });
    const user3 = await User.create({ name: 'Carol Davis', email: 'carol@example.com', password: 'user1234', role: 'user' });
    console.log('👤 Created Admin + 3 Users');

    // ========================
    // Create Topics
    // ========================
    const jsTopic = await Topic.create({ name: 'JavaScript', description: 'Core JavaScript concepts, ES6+, async, DOM' });
    const dbmsTopic = await Topic.create({ name: 'DBMS', description: 'Database management, SQL, normalization, transactions' });
    const aptTopic = await Topic.create({ name: 'Aptitude', description: 'Quantitative aptitude, logical reasoning, verbal ability' });
    await Topic.create({ name: 'Java', description: 'Core Java, OOP, Collections, Multithreading' });
    await Topic.create({ name: 'Operating Systems', description: 'Processes, memory management, scheduling, deadlocks' });
    await Topic.create({ name: 'Computer Networks', description: 'TCP/IP, OSI, HTTP, DNS, routing protocols' });
    console.log('📚 Created 6 Topics');

    // ========================
    // Create Quizzes
    // ========================
    const jsQuiz = await Quiz.create({
      title: 'JavaScript Basics',
      description: 'Test your knowledge of core JavaScript concepts including variables, functions, and ES6 features.',
      topic: jsTopic._id,
      duration: 15,
      isPublished: true,
      createdBy: adminUser._id,
    });

    const dbmsQuiz = await Quiz.create({
      title: 'DBMS Fundamentals',
      description: 'Covers SQL queries, normalization, ER diagrams, and database transactions.',
      topic: dbmsTopic._id,
      duration: 20,
      isPublished: true,
      createdBy: adminUser._id,
    });

    const aptQuiz = await Quiz.create({
      title: 'Aptitude & Logical Reasoning',
      description: 'Practice questions on quantitative aptitude and logical reasoning for placement preparation.',
      topic: aptTopic._id,
      duration: 25,
      isPublished: true,
      createdBy: adminUser._id,
    });
    console.log('📝 Created 3 Quizzes');

    // ========================
    // JavaScript Questions
    // ========================
    const jsQuestions = [
      { quizId: jsQuiz._id, questionText: 'Which keyword is used to declare a block-scoped variable in JavaScript?', options: ['var', 'let', 'const', 'Both let and const'], correctAnswer: 'Both let and const', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'What does "=== " operator check in JavaScript?', options: ['Only value equality', 'Only type equality', 'Both value and type equality', 'Reference equality'], correctAnswer: 'Both value and type equality', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'Which method is used to convert a JSON string into a JavaScript object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.objectify()'], correctAnswer: 'JSON.parse()', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'What is the output of: typeof null?', options: ['"null"', '"undefined"', '"object"', '"string"'], correctAnswer: '"object"', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'Which Array method creates a new array with all elements that pass a test?', options: ['map()', 'filter()', 'reduce()', 'forEach()'], correctAnswer: 'filter()', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'What is a closure in JavaScript?', options: ['A function that calls itself', 'A function with access to its outer scope variables', 'A way to close/stop execution', 'A sealed object'], correctAnswer: 'A function with access to its outer scope variables', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'Which ES6 feature allows you to extract values from arrays/objects?', options: ['Spread operator', 'Destructuring', 'Rest parameters', 'Template literals'], correctAnswer: 'Destructuring', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'What does the "async" keyword do when added before a function?', options: ['Makes it run in a different thread', 'Makes it return a Promise', 'Makes it run faster', 'Prevents error throwing'], correctAnswer: 'Makes it return a Promise', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'What is the purpose of the "use strict" directive?', options: ['Enables strict CSS', 'Enables strict mode to catch common errors', 'Forces strict type checking', 'Disables deprecated methods'], correctAnswer: 'Enables strict mode to catch common errors', marks: 2 },
      { quizId: jsQuiz._id, questionText: 'Which built-in method removes the last element from an array?', options: ['shift()', 'splice()', 'pop()', 'slice()'], correctAnswer: 'pop()', marks: 2 },
    ];

    // ========================
    // DBMS Questions
    // ========================
    const dbmsQuestions = [
      { quizId: dbmsQuiz._id, questionText: 'Which SQL command is used to retrieve data from a database?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correctAnswer: 'SELECT', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Currency, Integration, Data', 'Atomicity, Concurrency, Integrity, Dependency', 'None of the above'], correctAnswer: 'Atomicity, Consistency, Isolation, Durability', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '3NF', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'What type of JOIN returns all records from the left table and matched records from the right?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'], correctAnswer: 'LEFT JOIN', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'Which key uniquely identifies a record in a table?', options: ['Foreign Key', 'Candidate Key', 'Primary Key', 'Composite Key'], correctAnswer: 'Primary Key', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'What does DDL stand for?', options: ['Data Definition Language', 'Data Display Language', 'Data Driven Logic', 'Database Design Language'], correctAnswer: 'Data Definition Language', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'Which SQL clause is used to filter groups in a GROUP BY query?', options: ['WHERE', 'HAVING', 'FILTER', 'LIMIT'], correctAnswer: 'HAVING', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'What is a foreign key?', options: ['A key from another database', 'A key that references the primary key of another table', 'A key used for encryption', 'A secondary primary key'], correctAnswer: 'A key that references the primary key of another table', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'Which command is used to remove all data from a table without logging each row?', options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'], correctAnswer: 'TRUNCATE', marks: 2 },
      { quizId: dbmsQuiz._id, questionText: 'What is an index in a database?', options: ['A backup copy of a table', 'A data structure to speed up queries', 'A constraint on a column', 'A type of join'], correctAnswer: 'A data structure to speed up queries', marks: 2 },
    ];

    // ========================
    // Aptitude Questions
    // ========================
    const aptQuestions = [
      { quizId: aptQuiz._id, questionText: 'If a train travels 60 km in 1 hour, how long will it take to travel 150 km?', options: ['2 hours', '2.5 hours', '3 hours', '3.5 hours'], correctAnswer: '2.5 hours', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correctAnswer: '30', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'Find the next number: 2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], correctAnswer: '32', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'A can do a job in 10 days, B in 15 days. Together in how many days?', options: ['5 days', '6 days', '7 days', '8 days'], correctAnswer: '6 days', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'The average of 5 numbers is 20. If one number is removed, the average becomes 15. What was the removed number?', options: ['35', '40', '45', '50'], correctAnswer: '40', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'What is the ratio of 250 ml to 1 litre?', options: ['1:2', '1:4', '2:5', '1:3'], correctAnswer: '1:4', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'If APPLE = 50, then MANGO = ?', options: ['50', '55', '60', '65'], correctAnswer: '55', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'A clock shows 3:00. What is the angle between the hour and minute hands?', options: ['60°', '75°', '90°', '120°'], correctAnswer: '90°', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'How many prime numbers are there between 1 and 20?', options: ['6', '7', '8', '9'], correctAnswer: '8', marks: 2 },
      { quizId: aptQuiz._id, questionText: 'If the cost of 12 pens is ₹180, what is the cost of 5 pens?', options: ['₹70', '₹75', '₹80', '₹85'], correctAnswer: '₹75', marks: 2 },
    ];

    await Question.insertMany([...jsQuestions, ...dbmsQuestions, ...aptQuestions]);

    // Update totalMarks for each quiz (10 questions x 2 marks = 20)
    await Quiz.findByIdAndUpdate(jsQuiz._id, { totalMarks: 20 });
    await Quiz.findByIdAndUpdate(dbmsQuiz._id, { totalMarks: 20 });
    await Quiz.findByIdAndUpdate(aptQuiz._id, { totalMarks: 20 });
    console.log('❓ Created 30 Questions (10 per quiz)');

    console.log('\n✅ ============================');
    console.log('   DATABASE SEEDED SUCCESSFULLY!');
    console.log('==============================');
    console.log('🔑 Admin Login:');
    console.log('   Email:    admin@quizmaster.com');
    console.log('   Password: admin123');
    console.log('\n👤 Sample Users:');
    console.log('   alice@example.com / user1234');
    console.log('   bob@example.com   / user1234');
    console.log('   carol@example.com / user1234');
    console.log('==============================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
