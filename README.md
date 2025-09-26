🗳️ Online Poll System Backend

This project is developed as part of the ProDev Backend Engineering Program.
It simulates the backend of an online poll and voting system, providing real-world experience in designing and implementing scalable backend solutions.

The backend supports:
User registration and authentication

Poll creation and management

Secure voting with validations

Real-time result computation

API documentation with Swagger



📚 Program Overview

The ProDev Backend Engineering program focuses on equipping developers with the skills required to design, build, and deploy production-ready backend systems.

This project demonstrates practical application of the following:

Building scalable APIs using Django & Django REST Framework

Designing robust database schemas

Handling real-time data updates

Applying backend best practices (security, validations, CI/CD, testing)


###🛠️ Key Technologies

Python → Core backend language

Django → Framework for rapid development

Django REST Framework (DRF) → API layer

GraphQL (Optional Extension) → Flexible querying for clients

PostgreSQL → Relational database for storing users, polls, and votes

Docker → Containerization for consistent development and deployment

CI/CD (GitHub Actions) → Automated testing, build, and deployment pipelines

Swagger / Redoc → Interactive API documentation


###🗄️ Database Design
Core Entities

User → Registers/login, creates polls, casts votes

Poll → Created by a user, has a title, description, and active time range

PollOption → Multiple choices under a poll

Vote → Links user to poll and option, ensures one vote per user

VoteToken → Enables anonymous or one-time voting
📌 Validation ensures no duplicate voting per user/poll.



###⚙️ Backend Development Concepts
1. Database Design

Normalized schema for scalability

Foreign keys for relational integrity

Unique constraints to prevent duplicate votes

2. Asynchronous Programming

Used for real-time vote counts and notifications

Implemented with Django Channels + WebSockets

3. Caching Strategies

Frequently accessed poll results cached in Redis

Reduces database load on high-traffic polls



###🚀 Features Implemented

Authentication & Authorization

Secure password storage (hashing, salted)

Support for bulk user import with optional password setup

Poll Management

Create, update, and delete polls

Add multiple options per poll

Voting System

One user = one vote per poll

Validation against duplicate voting

Timestamped records of all votes

Real-Time Results

WebSockets for pushing live updates to clients

Optimized SQL queries for fast aggregation

API Documentation

Swagger UI available at /api/docs



###🧩 Challenges & Solutions

Preventing Duplicate Voting

Solution: UNIQUE (user_id, poll_id) constraint at DB level

Real-Time Result Updates

Solution: Integrated Django Channels for WebSocket communication

Performance Under Load

Solution: Implemented caching with Redis + database indexing

User Imports Without Passwords

Solution: Allowed password_hash to be nullable; force password reset on first login

