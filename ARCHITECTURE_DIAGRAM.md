# System Architecture Diagram

## Overview
This document contains the architecture diagram for the Inventory Management System, showing the Client-Server pattern, Repository pattern, and Database structure.

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer - React Frontend"
        UI[React Components]
        Router[React Router]
        Context[Context API<br/>AuthContext<br/>CartContext]
        Services[Service Layer<br/>http-client.service<br/>equipment.service<br/>login-service<br/>borrow-request.service]
        
        UI --> Router
        Router --> Context
        UI --> Services
        Services --> HTTP[HTTP Client<br/>Axios]
    end
    
    subgraph "Network Layer"
        HTTP --> API[REST API<br/>HTTP/HTTPS<br/>Port 3000]
    end
    
    subgraph "Server Layer - NestJS Backend"
        API --> CORS[CORS Middleware]
        CORS --> AuthGuard[JWT Auth Guard]
        
        subgraph "Module: Auth"
            AuthController[Auth Controller]
            AuthService[Auth Service]
            JWTService[JWT Service]
            AuthController --> AuthService
            AuthService --> JWTService
            AuthService --> UserRepo1[User Repository]
        end
        
        subgraph "Module: Users"
            UserController[Users Controller]
            UserService[Users Service]
            UserController --> UserService
            UserService --> UserRepo2[User Repository]
        end
        
        subgraph "Module: Equipment"
            EquipmentController[Equipment Controller]
            EquipmentService[Equipment Service]
            EquipmentController --> EquipmentService
            EquipmentService --> EquipmentRepo[Equipment Repository]
        end
        
        subgraph "Module: BorrowRequest"
            BorrowRequestController[BorrowRequest Controller]
            BorrowRequestService[BorrowRequest Service]
            BorrowRequestController --> BorrowRequestService
            BorrowRequestService --> BorrowRequestRepo[BorrowRequest Repository]
            BorrowRequestService --> BorrowItemRepo[BorrowItem Repository]
        end
        
        subgraph "Module: BorrowItem"
            BorrowItemController[BorrowItem Controller]
            BorrowItemService[BorrowItem Service]
            BorrowItemController --> BorrowItemService
            BorrowItemService --> BorrowItemRepo2[BorrowItem Repository]
        end
        
        AuthGuard --> AuthController
        AuthGuard --> UserController
        AuthGuard --> EquipmentController
        AuthGuard --> BorrowRequestController
        AuthGuard --> BorrowItemController
    end
    
    subgraph "Repository Pattern Layer - TypeORM"
        UserRepo1 --> TypeORM[TypeORM ORM]
        UserRepo2 --> TypeORM
        EquipmentRepo --> TypeORM
        BorrowRequestRepo --> TypeORM
        BorrowItemRepo --> TypeORM
        BorrowItemRepo2 --> TypeORM
    end
    
    subgraph "Database Layer - PostgreSQL"
        TypeORM --> DB[(PostgreSQL Database<br/>Port 5432)]
        
        subgraph "Database Tables"
            UserTable[(Users Table<br/>id, name, email<br/>password, role)]
            EquipmentTable[(Equipment Table<br/>id, name, tag<br/>condition, quantity<br/>availablequantity)]
            BorrowRequestTable[(BorrowRequest Table<br/>id, requestDate<br/>approvalDate, status<br/>userId)]
            BorrowItemTable[(BorrowItem Table<br/>id, quantity<br/>borrowDate, returnDate<br/>equipmentId<br/>borrowRequestId)]
        end
        
        DB --> UserTable
        DB --> EquipmentTable
        DB --> BorrowRequestTable
        DB --> BorrowItemTable
        
        UserTable -.->|OneToMany| BorrowRequestTable
        BorrowRequestTable -.->|OneToMany| BorrowItemTable
        EquipmentTable -.->|OneToMany| BorrowItemTable
    end
    
    style UI fill:#e1f5ff
    style Services fill:#e1f5ff
    style API fill:#fff4e1
    style AuthGuard fill:#ffe1e1
    style TypeORM fill:#e1ffe1
    style DB fill:#f0e1ff
```

## Detailed Component Architecture

```mermaid
graph LR
    subgraph "Frontend Architecture"
        A[React App] --> B[Router]
        B --> C[Protected Routes]
        C --> D[Pages]
        D --> E[Components]
        E --> F[Services]
        F --> G[HTTP Client]
        A --> H[Context Providers]
        H --> I[AuthContext]
        H --> J[CartContext]
    end
    
    subgraph "Backend Architecture"
        K[NestJS App] --> L[App Module]
        L --> M[Feature Modules]
        M --> N[Controllers]
        N --> O[Services]
        O --> P[Repositories]
        P --> Q[TypeORM]
        L --> R[Auth Module]
        R --> S[JWT Strategy]
    end
    
    subgraph "Data Flow"
        G -->|HTTP Requests| N
        N -->|Business Logic| O
        O -->|Data Access| P
        P -->|ORM Queries| Q
        Q -->|SQL| T[(PostgreSQL)]
    end
    
    style A fill:#e1f5ff
    style K fill:#ffe1e1
    style T fill:#f0e1ff
```

## Repository Pattern Detail

```mermaid
classDiagram
    class Service {
        <<Service Layer>>
        +businessLogic()
        +validateData()
    }
    
    class Repository {
        <<Repository Pattern>>
        +find()
        +create()
        +update()
        +delete()
        +save()
    }
    
    class TypeORM {
        <<ORM Framework>>
        +createQueryBuilder()
        +getMany()
        +getOne()
    }
    
    class Entity {
        <<Domain Model>>
        +id
        +properties
    }
    
    class Database {
        <<PostgreSQL>>
        +tables
        +relationships
    }
    
    Service --> Repository : uses
    Repository --> TypeORM : uses
    TypeORM --> Entity : maps to
    TypeORM --> Database : queries
    Entity --> Database : persisted in
    
    note for Service "Business logic layer\nValidates and processes data"
    note for Repository "Data access abstraction\nHides database complexity"
    note for TypeORM "Object-Relational Mapping\nConverts objects to SQL"
```

## Client-Server Communication Flow

```mermaid
sequenceDiagram
    participant UI as React Component
    participant Service as Frontend Service
    participant HTTP as HTTP Client
    participant API as REST API
    participant Controller as NestJS Controller
    participant ServiceB as Backend Service
    participant Repo as Repository
    participant DB as PostgreSQL
    
    UI->>Service: Call service method
    Service->>HTTP: HTTP request (GET/POST/PUT/DELETE)
    HTTP->>API: Axios request with headers
    API->>Controller: Route to controller
    Controller->>ServiceB: Call service method
    ServiceB->>Repo: Repository operation
    Repo->>DB: SQL query via TypeORM
    DB-->>Repo: Return data
    Repo-->>ServiceB: Return entity
    ServiceB-->>Controller: Return result
    Controller-->>API: JSON response
    API-->>HTTP: HTTP response
    HTTP-->>Service: Response data
    Service-->>UI: Update state/UI
```

## Module Structure

```mermaid
graph TD
    subgraph "Backend Modules"
        AppModule[App Module<br/>Root Module]
        
        AppModule --> UsersModule[Users Module]
        AppModule --> EquipmentModule[Equipment Module]
        AppModule --> BorrowRequestModule[BorrowRequest Module]
        AppModule --> BorrowItemModule[BorrowItem Module]
        AppModule --> AuthModule[Auth Module]
        AppModule --> TypeORMModule[TypeORM Module<br/>Database Connection]
        
        UsersModule --> UserEntity[User Entity]
        EquipmentModule --> EquipmentEntity[Equipment Entity]
        BorrowRequestModule --> BorrowRequestEntity[BorrowRequest Entity]
        BorrowItemModule --> BorrowItemEntity[BorrowItem Entity]
    end
    
    subgraph "Frontend Modules"
        App[App Component]
        App --> RouterModule[Router Module]
        App --> ContextModule[Context Module]
        
        RouterModule --> Pages[Page Components]
        ContextModule --> AuthContext[Auth Context]
        ContextModule --> CartContext[Cart Context]
        
        Pages --> ServicesModule[Services Module]
        ServicesModule --> HTTPModule[HTTP Client Module]
    end
    
    style AppModule fill:#ffe1e1
    style App fill:#e1f5ff
    style TypeORMModule fill:#e1ffe1
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginUI as Login Component
    participant AuthService as Auth Service
    participant HTTP as HTTP Client
    participant AuthAPI as Auth Controller
    participant AuthServiceB as Backend Auth Service
    participant UserService as User Service
    participant UserRepo as User Repository
    participant DB as Database
    participant JWT as JWT Service
    
    User->>LoginUI: Enter credentials
    LoginUI->>AuthService: login(credentials)
    AuthService->>HTTP: POST /auth/login
    HTTP->>AuthAPI: Login request
    AuthAPI->>AuthServiceB: login(email, password)
    AuthServiceB->>UserService: findByUsername(email)
    UserService->>UserRepo: Query user
    UserRepo->>DB: SELECT * FROM users
    DB-->>UserRepo: User data
    UserRepo-->>UserService: User entity
    UserService-->>AuthServiceB: User object
    AuthServiceB->>AuthServiceB: Validate password
    AuthServiceB->>JWT: sign(userDetails)
    JWT-->>AuthServiceB: access_token
    AuthServiceB-->>AuthAPI: {access_token, user}
    AuthAPI-->>HTTP: JSON response
    HTTP-->>AuthService: Response
    AuthService->>AuthService: Store token in localStorage
    AuthService-->>LoginUI: Update auth state
    LoginUI-->>User: Redirect to dashboard
```

## Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ BORROW_REQUEST : "makes"
    BORROW_REQUEST ||--o{ BORROW_ITEM : "contains"
    EQUIPMENT ||--o{ BORROW_ITEM : "borrowed as"
    
    USER {
        int id PK
        string name
        string email UK
        string password
        enum role
    }
    
    EQUIPMENT {
        int id PK
        string name
        string tag
        string condition
        int quantity
        int availablequantity
    }
    
    BORROW_REQUEST {
        int id PK
        date requestDate
        date approvalDate
        enum status
        int userId FK
    }
    
    BORROW_ITEM {
        int id PK
        int quantity
        date borrowDate
        date returnDate
        int equipmentId FK
        int borrowRequestId FK
    }
```

## Technology Stack

### Frontend
- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.1.0
- **Routing**: React Router 7.1.5
- **HTTP Client**: Axios 1.12.2
- **UI Framework**: Bootstrap 5.3.8
- **State Management**: React Context API

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **ORM**: TypeORM 0.3.27
- **Database**: PostgreSQL (via pg 8.16.3)
- **Authentication**: JWT (Passport JWT 4.0.1)
- **Password Hashing**: bcrypt 6.0.0

### Database
- **RDBMS**: PostgreSQL
- **Port**: 5432
- **Database Name**: inventory

## Key Design Patterns Identified

1. **Repository Pattern**: TypeORM repositories abstract database access
2. **Client-Server Pattern**: React frontend communicates with NestJS backend via REST API
3. **Module Pattern**: NestJS modular architecture with feature modules
4. **MVC Pattern**: Controllers handle requests, Services contain business logic, Repositories handle data access
5. **Dependency Injection**: NestJS uses DI for services and repositories
6. **Context Pattern**: React Context API for global state management
7. **Service Layer Pattern**: Frontend services abstract API communication

