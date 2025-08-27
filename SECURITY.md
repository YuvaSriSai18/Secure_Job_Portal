# 🔐 Security Policy

## ✅ Security Practices Implemented

### 1. Authentication & Authorization

* Secure user authentication with **JWT access tokens** and **refresh tokens**.
* Tokens are stored in **HttpOnly cookies** to prevent XSS attacks.
* Role-based access control (**RBAC**) for Admins, Recruiters, and Candidates.
* Passwords are hashed using **bcrypt** before saving to the database.

### 2. Input Validation & Sanitization

* All API inputs validated with libraries like `express-validator` / `Joi`.
* Special characters sanitized to prevent **SQL Injection** and **XSS**.
* File uploads restricted by type and size.

### 3. Data Security

* Sensitive data (passwords, JWT secrets, DB credentials) stored in **environment variables**.
* Enforced **HTTPS** in production with SSL/TLS.
* User documents stored in a **private vault** with access tokens.

### 4. Session & Token Security

* **Access Token**: Short-lived (e.g., 15m).
* **Refresh Token**: Long-lived (e.g., 7d), rotated on each use.
* Automatic logout on token expiration or suspicious activity.

### 5. File Upload & Virus Scan

* Candidate documents scanned with a **simulated antivirus service** before storage.
* Rejected if malicious content is detected.

### 6. Secure Coding Practices

* Avoid use of `eval`, unsafe regex, or untrusted deserialization.
* Dependencies are regularly updated using `npm audit`.
* Only **necessary CORS origins** allowed.

---

