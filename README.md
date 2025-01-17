# **Product Purchase System**  

This repository contains the implementation of a Product Purchase System, showcasing a complete backend, frontend, and database design for managing customer orders, products, deliveries, and transactions.  

### **Live Demos**
- **Frontend App**: [Deployed Application](https://main.d381bvjtxlf4rr.amplifyapp.com/)  
- **Backend API**: [Deployed API](https://77njmfiaib.execute-api.us-east-2.amazonaws.com/prod/)  
- **Swagger API Documentation**: [Public Swagger Docs](http://product-purchase-1442677237.us-east-2.elb.amazonaws.com/api)  
  *Note: Due to technical limitations, this Swagger UI URL does not render directly from the API Gateway.*

---

## **Table of Contents**
1. [Features](#features)
2. [Entities and Relationships](#entities-and-relationships)
3. [Backend and Frontend Coverage](#backend-and-frontend-coverage)
4. [Technologies Used](#technologies-used)

---

## **Features**
- Manage customers, products, and transactions seamlessly.
- Integration with payment gateways for transaction processing.
- Deliveries associated with transactions, tracking recipient and address details.
- Frontend deployed on AWS Amplify.
- Swagger documentation for API reference and testing.

---

## **Entities and Relationships**

### **Customer**
- **Attributes**:
  - `id`: Auto-generated identifier (PK).
  - `email`: Unique email identifier.
  - `password`: Encrypted password.
- **Relationships**:
  - **1:N** with `OrderTransaction`: A customer can place multiple orders.

### **Product**
- **Attributes**:
  - `id`: Auto-generated identifier (PK).
  - `name`: Name of the product.
  - `description`: Detailed product description.
  - `price`: Price of the product.
  - `stock`: Inventory count.
  - `image`: Optional image URL.
- **Relationships**:
  - **1:N** with `OrderTransaction`: A product can be part of multiple orders.

### **OrderTransaction**
- **Attributes**:
  - `id`: Auto-generated identifier (PK).
  - `paymentGatewayTransactionId`: Optional identifier from the payment gateway.
  - `quantity`: Product quantity ordered.
  - `total`: Total cost of the transaction.
  - `acceptanceTokenEndUserPolicy`: Token acknowledging end-user policies.
  - `createdAt`: Timestamp of transaction creation.
- **Relationships**:
  - **N:1** with `Customer`.
  - **N:1** with `Product`.
  - **1:1** with `Delivery`.
  - **N:1** with `TransactionStatus`.

### **Delivery**
- **Attributes**:
  - `id`: Auto-generated identifier (PK).
  - `personName`: Recipient's full name.
  - `address`: Delivery address.
  - `country`, `city`, `region`: Geographic details of the delivery.
  - `postalCode`: ZIP/Postal code.
  - `phoneNumber`: Contact number for the recipient.
  - `fee`: Optional delivery fee.
- **Relationships**:
  - **1:1** with `OrderTransaction`.

### **TransactionStatus**
- **Attributes**:
  - `id`: Auto-generated identifier (PK).
  - `name`: Enum type (`PENDING`, `APPROVED`, `REJECTED`) representing transaction status.
- **Relationships**:
  - **1:N** with `OrderTransaction`.


![Database Diagram](./img/DB%20Diagram.svg)

---

## **Backend and Frontend Coverage**
### **Backend Test Coverage**
![Backend Coverage](./img/Testing%20Backend.jpeg)  
*Click for a larger view of the backend coverage image.*

### **Frontend Test Coverage**
![Frontend Coverage](./img/Testing%20Frontend.png)  
*Click for a larger view of the frontend coverage image.*

---

## **Technologies Used**
- **Backend**: 
  - Node.js (TypeScript) with NestJS Framework.
  - PostgreSQL for data persistence.
  - TypeORM for database modeling.
  - Swagger for API documentation.
- **Frontend**:
  - React with Redux for user interface.
  - AWS Amplify for deployment.
- **Deployment**:
  - AWS API Gateway + Load Balancer + ECS + ECR for backend API.
  - AWS Amplify for frontend hosting.
  - AWS RDS for database hosting.

---
