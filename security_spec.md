# Security Specification

## Data Invariants
1. Orders must have a valid salesman UID matching `request.auth.uid`.
2. Salesmen can view customers and active products.
3. Salesmen can create orders and view their own orders.
4. Salesmen cannot edit or delete submitted orders.
5. Admins (including bootstrap admin `prosanta97348963@gmail.com`) can read and manage all customers, products, orders, and update order statuses.
6. Order statuses are restricted to: `NEW`, `PROCESSING`, `COMPLETED`, `CANCELLED`.
7. Products and customers can be read by authenticated users to allow salesmen to take orders.

## Dirty Dozen Payloads Handled
1. Spoofed salesmanUid on order creation.
2. Order with negative totalAmount or negative quantity.
3. Order with non-existent status.
4. Salesman attempting to update order status or modify line items after submission.
5. Salesman attempting to delete an order.
6. Unauthenticated read/write to orders, customers, or products.
7. Non-admin attempting to create or edit products.
8. Non-admin attempting to create or edit customers (unless authorized).
9. Oversized strings injection in customer code or product code.
10. Self-assigning admin privileges in `/admins`.
11. Modifying immutable creation fields on orders.
12. Attempting to update `orderCode` or `customerId` post-submission.
