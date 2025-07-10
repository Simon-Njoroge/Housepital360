# Housepital360 Schema Documentation

## Database Type
- PostgreSQL

---

## Tables

### 1. **users**
- Stores all user accounts in the system.
- Roles include: `patient`, `doctor`, `admin`, `receptionist`, `pharmacist`, `labtech`, `researcher`

**Columns:**
- id (UUID, PK, unique)
- name (varchar)
- email (varchar, unique)
- phone (varchar)
- password_hash (varchar)
- role (varchar)
- last_login (timestamp)
- is_verified (boolean)
- created_at (timestamp)
- updated_at (timestamp)
- is_deleted (boolean, default: false)
- deleted_at (timestamp)

### 2. **patient_profiles**
- Stores additional info about patients.

**Columns:**
- id (UUID, PK, unique)
- user_id (UUID, FK > users.id, unique)
- date_of_birth (date)
- blood_type (varchar)
- genotype (varchar)
- emergency_contact (varchar)
- emergency_phone (varchar)
- insurance_provider (varchar)
- policy_number (varchar)
- created_at (timestamp)
- updated_at (timestamp)

### 3. **doctor_profiles**
- Stores doctor professional info.

**Columns:**
- id (UUID, PK, unique)
- user_id (UUID, FK > users.id, unique)
- specialization (varchar)
- bio (text)
- license_no (varchar)
- consultation_fee (decimal)
- years_experience (int)
- is_accepting_new_patients (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)

### 4. **departments**
- Departments in the hospital.

**Columns:**
- id (UUID, PK)
- name (varchar)
- description (text)
- location (varchar)
- contact_extension (varchar)
- is_deleted (boolean, default: false)
- created_at (timestamp)
- updated_at (timestamp)

### 5. **department_staff**
- Assigns staff to departments.

**Columns:**
- id (UUID, PK)
- department_id (UUID, FK > departments.id)
- user_id (UUID, FK > users.id)
- role (varchar)
- is_primary (boolean, default: false)
- start_date (date)
- end_date (date)
- created_at (timestamp)

### 6. **sessions**
- Manages login sessions and refresh tokens.

**Columns:**
- id (UUID, PK)
- user_id (UUID, FK > users.id)
- refresh_token (varchar)
- ip_address (varchar)
- user_agent (varchar)
- created_at (timestamp)
- expires_at (timestamp)
- is_revoked (boolean, default: false)

---

*Note: The document continues with the remaining tables like `appointments`, `patient_queue`, `vitals`, `medications`, `invoices`, `payments`, `lab_tests`, etc.*

Let me know if you want me to continue adding the rest of the schema tables in this `.md` file.
