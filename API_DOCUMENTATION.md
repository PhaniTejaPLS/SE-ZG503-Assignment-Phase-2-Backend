# Inventory Management System - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
All requests use `Content-Type: application/json` header.

---

## 1. Authentication Endpoints

### 1.1 Login
**POST** `/auth/login`

Authenticates a user and returns an access token.

#### Request Payload
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response Structure
```json
{
  "access_token": "string (JWT token)",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string (enum: 'staff' | 'student' | 'admin')"
  }
}
```

#### Example Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Example Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student"
  }
}
```

---

## 2. Equipment Endpoints

### 2.1 Get All Equipment
**GET** `/equipment`

Retrieves all equipment items.

#### Query Parameters
- `tag` (optional): Filter by equipment tag
- `name` (optional): Filter by equipment name
- `condition` (optional): Filter by equipment condition
- `availablequantity` (optional): Filter by available quantity

#### Response Structure
```json
[
  {
    "id": "number",
    "name": "string",
    "tag": "string",
    "condition": "string",
    "quantity": "number",
    "availablequantity": "number",
    "borrowItems": "BorrowItem[]"
  }
]
```

#### Example Response
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "tag": "IT-001",
    "condition": "good",
    "quantity": 10,
    "availablequantity": 8,
    "borrowItems": []
  }
]
```

### 2.2 Get Equipment by ID
**GET** `/equipment/:id`

Retrieves a specific equipment item by ID.

#### Path Parameters
- `id` (required): Equipment ID (number)

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "tag": "string",
  "condition": "string",
  "quantity": "number",
  "availablequantity": "number",
  "borrowItems": "BorrowItem[]"
}
```

### 2.3 Create Equipment
**POST** `/equipment`

Creates a new equipment item.

#### Request Payload
```json
{
  "id": "number (required)",
  "name": "string (required)",
  "category": "string (required)",
  "condition": "string (required)",
  "quantity": "number (required)",
  "availablequantity": "number (required)",
  "description": "string (optional)"
}
```

#### Example Request
```json
{
  "id": 1,
  "name": "Laptop",
  "category": "Electronics",
  "condition": "good",
  "quantity": 10,
  "availablequantity": 10,
  "description": "Dell Latitude laptop"
}
```

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "tag": "string",
  "condition": "string",
  "quantity": "number",
  "availablequantity": "number"
}
```

### 2.4 Update Equipment (Full Update)
**PUT** `/equipment/:id`

Performs a full replacement update of an equipment item.

#### Path Parameters
- `id` (required): Equipment ID (number)

#### Request Payload
```json
{
  "id": "number (optional, will be set from path parameter)",
  "name": "string (optional)",
  "category": "string (optional)",
  "condition": "string (optional)",
  "quantity": "number (optional)",
  "availablequantity": "number (optional)",
  "description": "string (optional)"
}
```

#### Example Request
```json
{
  "name": "Updated Laptop",
  "category": "Electronics",
  "condition": "excellent",
  "quantity": 12,
  "availablequantity": 10
}
```

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "tag": "string",
  "condition": "string",
  "quantity": "number",
  "availablequantity": "number"
}
```

### 2.5 Update Equipment (Partial Update)
**PATCH** `/equipment/:id`

Performs a partial update of an equipment item.

#### Path Parameters
- `id` (required): Equipment ID (number)

#### Request Payload
```json
{
  "name": "string (optional)",
  "category": "string (optional)",
  "condition": "string (optional)",
  "quantity": "number (optional)",
  "availablequantity": "number (optional)",
  "description": "string (optional)"
}
```

#### Example Request
```json
{
  "availablequantity": 7
}
```

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "tag": "string",
  "condition": "string",
  "quantity": "number",
  "availablequantity": "number"
}
```

### 2.6 Delete Equipment
**DELETE** `/equipment/:id`

Deletes an equipment item.

#### Path Parameters
- `id` (required): Equipment ID (number)

#### Response
Returns the deleted equipment object or success message.

---

## 3. Borrow Request Endpoints

### 3.1 Create Borrow Request
**POST** `/request`

Creates a new borrow request.

#### Request Payload
```json
{
  "id": "number (required)",
  "requestDate": "Date (required, ISO 8601 format)",
  "approvalDate": "Date (optional, ISO 8601 format)",
  "userId": "number (required)",
  "status": "string (required, enum: 'pending' | 'approved' | 'rejected' | 'returned')",
  "items": [
    {
      "id": "number",
      "borrowRequestId": "number (required)",
      "quantity": "number (required)",
      "returnDate": "Date (required, ISO 8601 format)",
      "borrowDate": "Date (required, ISO 8601 format)",
      "equipmentId": "number (required)"
    }
  ]
}
```

#### Example Request
```json
{
  "id": 1,
  "requestDate": "2024-01-15T10:00:00Z",
  "userId": 1,
  "status": "pending",
  "items": [
    {
      "borrowRequestId": 1,
      "quantity": 2,
      "returnDate": "2024-01-20T10:00:00Z",
      "borrowDate": "2024-01-15T10:00:00Z",
      "equipmentId": 1
    }
  ]
}
```

#### Response Structure
```json
{
  "id": "number",
  "requestDate": "Date",
  "approvalDate": "Date | null",
  "status": "string",
  "userId": "number",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "items": [
    {
      "id": "number",
      "quantity": "number",
      "returnDate": "Date",
      "borrowDate": "Date",
      "equipment": {
        "id": "number",
        "name": "string",
        "tag": "string",
        "condition": "string",
        "quantity": "number",
        "availablequantity": "number"
      }
    }
  ]
}
```

### 3.2 Get All Borrow Requests
**GET** `/request`

Retrieves all borrow requests.

#### Response Structure
```json
[
  {
    "id": "number",
    "requestDate": "Date",
    "approvalDate": "Date | null",
    "status": "string",
    "userId": "number",
    "user": "User object",
    "items": "BorrowItem[]"
  }
]
```

### 3.3 Get Borrow Request by ID
**GET** `/request/:id`

Retrieves a specific borrow request by ID.

#### Path Parameters
- `id` (required): Borrow Request ID (number)

#### Response Structure
```json
{
  "id": "number",
  "requestDate": "Date",
  "approvalDate": "Date | null",
  "status": "string",
  "userId": "number",
  "user": "User object",
  "items": "BorrowItem[]"
}
```

### 3.4 Get Borrow Requests by User ID
**GET** `/request/user/:userId`

Retrieves all borrow requests for a specific user.

#### Path Parameters
- `userId` (required): User ID (number)

#### Response Structure
```json
[
  {
    "id": "number",
    "requestDate": "Date",
    "approvalDate": "Date | null",
    "status": "string",
    "userId": "number",
    "user": "User object",
    "items": "BorrowItem[]"
  }
]
```

### 3.5 Get Request Details by Request ID
**GET** `/request/details/:requestId`

Retrieves detailed information about a specific borrow request including all related items.

#### Path Parameters
- `requestId` (required): Borrow Request ID (number)

#### Response Structure
```json
{
  "id": "number",
  "requestDate": "Date",
  "approvalDate": "Date | null",
  "status": "string",
  "userId": "number",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  "items": [
    {
      "id": "number",
      "quantity": "number",
      "returnDate": "Date",
      "borrowDate": "Date",
      "equipment": {
        "id": "number",
        "name": "string",
        "tag": "string",
        "condition": "string",
        "quantity": "number",
        "availablequantity": "number"
      }
    }
  ]
}
```

### 3.6 Update Borrow Request
**PATCH** `/request/:id`

Updates a borrow request (typically used for approval/rejection).

#### Path Parameters
- `id` (required): Borrow Request ID (number)

#### Request Payload
```json
{
  "requestDate": "Date (optional)",
  "approvalDate": "Date (optional)",
  "userId": "number (optional)",
  "status": "string (optional, enum: 'pending' | 'approved' | 'rejected' | 'returned')",
  "items": "Array<CreateBorrowItemDto> (optional)"
}
```

#### Example Request (Approval)
```json
{
  "status": "approved",
  "approvalDate": "2024-01-16T10:00:00Z"
}
```

#### Response Structure
```json
{
  "id": "number",
  "requestDate": "Date",
  "approvalDate": "Date | null",
  "status": "string",
  "userId": "number",
  "user": "User object",
  "items": "BorrowItem[]"
}
```

### 3.7 Delete Borrow Request
**DELETE** `/request/:id`

Deletes a borrow request.

#### Path Parameters
- `id` (required): Borrow Request ID (number)

#### Response
Returns the deleted borrow request object or success message.

---

## 4. User Endpoints

### 4.1 Create User
**POST** `/users`

Creates a new user.

#### Request Payload
```json
{
  "id": "number (required)",
  "name": "string (required)",
  "email": "string (required, must be valid email format)",
  "password": "string (required, must be strong password)",
  "role": "string (required)"
}
```

#### Example Request
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "StrongP@ssw0rd123",
  "role": "student"
}
```

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string (enum: 'staff' | 'student' | 'admin')"
}
```

### 4.2 Get All Users
**GET** `/users`

Retrieves all users.

#### Response Structure
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "borrowRequests": "BorrowRequest[]"
  }
]
```

### 4.3 Get User by ID
**GET** `/users/:id`

Retrieves a specific user by ID.

#### Path Parameters
- `id` (required): User ID (number)

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "borrowRequests": "BorrowRequest[]"
}
```

### 4.4 Update User
**PATCH** `/users/:id`

Updates a user's information.

#### Path Parameters
- `id` (required): User ID (number)

#### Request Payload
```json
{
  "id": "number (optional)",
  "name": "string (optional)",
  "email": "string (optional, must be valid email format)",
  "password": "string (optional, must be strong password)",
  "role": "string (optional)"
}
```

#### Example Request
```json
{
  "name": "Jane Doe",
  "role": "staff"
}
```

#### Response Structure
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

### 4.5 Delete User
**DELETE** `/users/:id`

Deletes a user.

#### Path Parameters
- `id` (required): User ID (number)

#### Response
Returns the deleted user object or success message.

---

## 5. Borrow Item Endpoints

### 5.1 Create Borrow Item
**POST** `/borrow-item`

Creates a new borrow item (typically created as part of a borrow request).

#### Request Payload
```json
{
  "id": "number",
  "borrowRequestId": "number (required)",
  "quantity": "number (required)",
  "returnDate": "Date (required, ISO 8601 format)",
  "borrowDate": "Date (required, ISO 8601 format)",
  "equipmentId": "number (required)"
}
```

#### Example Request
```json
{
  "borrowRequestId": 1,
  "quantity": 2,
  "returnDate": "2024-01-20T10:00:00Z",
  "borrowDate": "2024-01-15T10:00:00Z",
  "equipmentId": 1
}
```

#### Response Structure
```json
{
  "id": "number",
  "quantity": "number",
  "returnDate": "Date",
  "borrowDate": "Date",
  "borrowRequest": "BorrowRequest object",
  "equipment": "Equipment object"
}
```

### 5.2 Get All Borrow Items
**GET** `/borrow-item`

Retrieves all borrow items.

#### Response Structure
```json
[
  {
    "id": "number",
    "quantity": "number",
    "returnDate": "Date",
    "borrowDate": "Date",
    "borrowRequest": "BorrowRequest object",
    "equipment": "Equipment object"
  }
]
```

### 5.3 Get Borrow Item by ID
**GET** `/borrow-item/:id`

Retrieves a specific borrow item by ID.

#### Path Parameters
- `id` (required): Borrow Item ID (number)

#### Response Structure
```json
{
  "id": "number",
  "quantity": "number",
  "returnDate": "Date",
  "borrowDate": "Date",
  "borrowRequest": "BorrowRequest object",
  "equipment": "Equipment object"
}
```

### 5.4 Update Borrow Item
**PATCH** `/borrow-item/:id`

Updates a borrow item.

#### Path Parameters
- `id` (required): Borrow Item ID (number)

#### Request Payload
```json
{
  "borrowRequestId": "number (optional)",
  "quantity": "number (optional)",
  "returnDate": "Date (optional, ISO 8601 format)",
  "borrowDate": "Date (optional, ISO 8601 format)",
  "equipmentId": "number (optional)"
}
```

#### Response Structure
```json
{
  "id": "number",
  "quantity": "number",
  "returnDate": "Date",
  "borrowDate": "Date",
  "borrowRequest": "BorrowRequest object",
  "equipment": "Equipment object"
}
```

### 5.5 Delete Borrow Item
**DELETE** `/borrow-item/:id`

Deletes a borrow item.

#### Path Parameters
- `id` (required): Borrow Item ID (number)

#### Response
Returns the deleted borrow item object or success message.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["error message 1", "error message 2"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Data Types Reference

### User Role Enum
- `"staff"`
- `"student"`
- `"admin"`

### Borrow Request Status Enum
- `"pending"`
- `"approved"`
- `"rejected"`
- `"returned"`

### Date Format
All dates should be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
Example: `"2024-01-15T10:00:00Z"`

---

## Notes

1. **CORS**: The API has CORS enabled, allowing cross-origin requests.

2. **Authentication**: The login endpoint returns a JWT token in the `access_token` field. This token should be included in subsequent requests (if authentication middleware is implemented).

3. **Validation**: 
   - Email fields must be valid email formats
   - Password fields must meet strong password requirements
   - Required fields are marked with `@IsNotEmpty()` decorator

4. **Relationships**:
   - A `BorrowRequest` belongs to one `User` (via `userId`)
   - A `BorrowRequest` has many `BorrowItem`s
   - A `BorrowItem` belongs to one `Equipment` (via `equipmentId`)
   - An `Equipment` has many `BorrowItem`s

5. **Cascade Deletes**: 
   - Deleting a `BorrowRequest` will cascade delete all associated `BorrowItem`s
   - Deleting a `BorrowItem` will not delete the associated `Equipment` or `BorrowRequest`

