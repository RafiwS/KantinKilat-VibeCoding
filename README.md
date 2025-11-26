<img width="1870" height="959" alt="Screenshot 2025-11-26 173015" src="https://github.com/user-attachments/assets/cd49bdf5-c89b-4e6c-963a-f25aad0d7c26" /># KantinKilat

KantinKilat is a web-based food ordering platform designed to digitize the transaction process in university canteens. The system minimizes queueing times by implementing a pre-order and cashless payment workflow.

**Submitted by:**
* **Name:** Ananda Widi Alrafi
* **NRP:** 5027241067
* **Institution:** Institut Teknologi Sepuluh Nopember (ITS)
* **Event:** Vibe Coding Week

---

## Project Overview

The primary objective of this application is to solve the bottleneck issue at campus canteens during peak hours. Currently, students spend significant time queuing to order and pay. KantinKilat allows users to order food from available stalls, upload payment proofs (QRIS), and track their order status in real-time. Users only approach the counter when the order status is updated to "Ready for Pickup".

## Tech Stack

The application is built using the MERN stack:

* **Frontend:** React.js, Tailwind CSS, Axios, React Router.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** JSON Web Token (JWT) & Bcrypt.
* **File Storage:** Multer (Local storage for images).

## Features

### Student (User)
1.  **Dashboard:** View list of canteen stalls and available menus.
2.  **Search & Filter:** Search for specific menu items or filter by canteen.
3.  **Ordering System:** Add items to cart with quantity adjustment.
4.  **Payment:** Upload payment proof (image) for verification.
5.  **Order Tracking:** Monitor status (Pending -> Processing -> Ready -> Completed).
6.  **Order History:** View past transactions.

### Vendor (Seller)
1.  **Vendor Dashboard:** Manage incoming orders and update order status.
2.  **Menu Management:** Add, edit, and delete menu items (includes image upload).
3.  **Shop Profile:** Configure shop name, location, and QRIS image.

### Administrator
1.  **Vendor Verification:** Validate and approve new vendor registrations to ensure security.

<img width="1875" height="961" alt="Screenshot 2025-11-26 174533" src="https://github.com/user-attachments/assets/8b2bb31f-efef-4268-afa3-c3160a864fc1" />

<img width="1875" height="965" alt="Screenshot 2025-11-26 174543" src="https://github.com/user-attachments/assets/8e9a602e-a57a-4187-8ff9-15067d0c15f1" />




