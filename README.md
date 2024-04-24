<h1 align="center"> UNICAP EVENTS</h1>

<img src="http://www.unicap.br/simcbio/wp-content/uploads/2015/10/Logo1-IHU_22-300x225.jpg" alt="Instituto Humanitas" style="text-align: center">

## rodar migrations
``` 
    npm run knex migrate:latest
```

## apagar todas as migrations (PRECISA DE PERMISÃO PRA USAR)
``` 
    npm run knex migrate:rollback --all
```

## rodar seeders
``` 
    npm run knex seed:run 
```

## Classes e funções 

```mermaid
classDiagram
    class User {
        -id : int
        -name : varchar
        -email : varchar
        -password : varchar
        -ra : varchar
        -phone : varchar
        -type : varchar
        -permission : varchar
        +createUser(name, email, password, phone, type, permission) : void
        +readUser(id) : User
        +updateUser(id, name, email, password, phone, type, permission) : void
        +deleteUser(id) : void
        +getAllUsers() : User[]
        +importUsersFromCSV(csvFile) : void
    }

    class Order {
        -id : int
        -userId : int
        -ticketIds : int[]
        -totalValue : decimal
        -paymentMethod : varchar
        -statusPayment : varchar
        -paymentAt : datetime
        -code : varchar
        +createOrder(userId, ticketIds, totalValue, paymentMethod, statusPayment) : void
        +readOrder(id) : Order
        +updateOrder(id, userId, ticketIds, totalValue, paymentMethod, statusPayment, paymentAt, code) : void
        +deleteOrder(id) : void
        +getAllOrders() : Order[]
    }

    class Ticket {
        -id : int
        -orderId : int
        -subEventId : int
        -status : varchar
        -codigoIngresso : varchar
        -createdAt : datetime
        +createTicket(orderId, subEventId, status, codigoIngresso) : void
        +readTicket(id) : Ticket
        +updateTicket(id, orderId, subEventId, status, codigoIngresso) : void
        +deleteTicket(id) : void
        +getAllTickets() : Ticket[]
    }

    class Certificate {
        -id : int
        -userId : int
        -subEventId : int
        -createdAt : datetime
        -verificationCode : varchar
        +createCertificate(userId, subEventId, verificationCode) : void
        +readCertificate(id) : Certificate
        +updateCertificate(id, userId, subEventId, verificationCode) : void
        +deleteCertificate(id) : void
        +getAllCertificates() : Certificate[]
        +generateCertificatePDF(id) : PDF
    }

    class Submission {
        -id : int
        -userId : int
        -subEventId : int
        -workTitle : varchar
        -description : text
        -archive : blob
        -submissionDate : datetime
        -status : varchar
        +createSubmission(userId, subEventId, workTitle, description, archive) : void
        +readSubmission(id) : Submission
        +updateSubmission(id, userId, subEventId, workTitle, description, archive, status) : void
        +deleteSubmission(id) : void
        +getAllSubmissions() : Submission[]
    }

    class Event {
        -id : int
        -name : varchar
        -description : text
        -startDate : datetime
        -endDate : datetime
        +createEvent(name, description, startDate, endDate) : void
        +readEvent(id) : Event
        +updateEvent(id, name, description, startDate, endDate) : void
        +deleteEvent(id) : void
        +getAllEvents() : Event[]
    }

    class SubEvent {
        -id : int
        -name : varchar
        -description : text
        -startDate : datetime
        -endDate : datetime
        -eventId : int
        -value : decimal
        -quantity : int
        +createSubEvent(name, description, startDate, endDate, eventId, value, quantity) : void
        +readSubEvent(id) : SubEvent
        +updateSubEvent(id, name, description, startDate, endDate, eventId, value, quantity) : void
        +deleteSubEvent(id) : void
        +getAllSubEvents() : SubEvent[]
    }

    class Address {
        -id : int
        -subEventId : int
        -block : varchar
        -floor : varchar
        +createAddress(subEventId, block, floor) : void
        +readAddress(id) : Address
        +updateAddress(id, subEventId, block, floor) : void
        +deleteAddress(id) : void
        +getAllAddresses() : Address[]
    }

    User "1" --o "0..*" Order
    Order "1" --o "0..*" Ticket
    User "1" --o "0..*" Certificate
    Certificate "0..*" --o "1" SubEvent
    User "1" --o "0..*" Submission
    Submission "0..*" --o "1" Event
    Submission "0..*" --o "0..1" SubEvent
    Event "1" --o "0..*" SubEvent
    SubEvent "1" --o "0..*" Address
```

## Tabelas 

```mermaid
erDiagram
    Users ||--o{ Orders : has
    Orders ||--o{ Tickets : has
    Users ||--o{ Certificate : obtains
    Sub_events ||--o{ Certificate : belongs_to
    Users ||--o{ Submission : makes
    Events ||--o{ Submission : belongs_to
    Sub_events ||--|{ Submission : optionally_belongs_to
    Events ||--|{ Sub_events : has
    Sub_events ||--o{ Addresses : has

    Users {
        int id PK
        varchar name
        varchar email
        varchar ra
        varchar password
        varchar phone
        varchar type
        varchar permission
    }

    Orders {
        int id PK
        int user_id FK
        int ticket_id FK
        decimal total_value
        varchar payment_method
        varchar status_payment
        datetime payment_at
        varchar code
    }

    Tickets {
        int id PK
        int order_id FK
        int sub_event_id FK 
        varchar status
        varchar codigoingresso
        datetime created_at
    }

    Certificate {
        int id PK
        int user_id FK
        int sub_event_id FK
        datetime created_at
        uuid verification_code
    }

    Submission {
        int submission_id PK
        int user_id FK
        int sub_event_id FK
        varchar workTitle
        text description
        blob archive
        datetime dataSubmission
        varchar status
    }

    Events {
        int id PK
        varchar name
        text description
        datetime start_date
        datetime end_date
    }

    Sub_events {
        int id PK
        varchar name
        text description
        datetime start_date
        datetime end_date
        int event_id FK
        decimal value
        int quantity
    }

    Addresses {
        int id PK
        int sub_event_id FK
        varchar block
        varchar room
    }
```
