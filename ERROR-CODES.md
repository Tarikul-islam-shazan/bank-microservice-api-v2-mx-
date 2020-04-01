## All Error Codes

---

### Account Service ( **100** )

| Error Code | Message                                | HTTP Code |
| ---------- | -------------------------------------- | --------- |
| "100"      | "Unable to update sweep account state" | 422       |

### Affinity Service ( **200** )

| Error Code | Message                             | HTTP Code |
| ---------- | ----------------------------------- | --------- |
| "201"      | "Current user Session ID not found" | 400       |

### Bank Auth ( **300** )

| Error Code | Message                                     | HTTP Code |
| ---------- | ------------------------------------------- | --------- |
| "301"      | "Unable to get access token"                | 500       |
| "302"      | "Headers must be set before accessing them" | 411       |
| "303"      | "Session timeout"                           | 401       |

### Bank Credential Service ( **400** )

| Error Code | Message                             | HTTP Code |
| ---------- | ----------------------------------- | --------- |
| "401"      | "Your account is locked"            | 400       |
| "402"      | "Username or password is incorrect" | 401       |

### Bank Login Service ( **500** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
| ""         | ""      |           |

### Bank-onboarding service ( **600** )

| Error Code | Message                                                   | HTTP Code |
| ---------- | --------------------------------------------------------- | --------- |
| "602"      | "Username already exists"                                 | 409       |
| "603"      | "A member with this TIN number is already exists"         | 409       |
| "604"      | "Applicant is not eligible"                               | 406       |
| "605"      | "Application is deceased"                                 | 406       |
| "606"      | "Application is not acceptable"                           | 406       |
| "607"      | "Identity verification not found"                         | 422       |
| "608"      | "Application denied"                                      | 406       |
| "609"      | "Application denied for credit report failure"            | 406       |
| "610"      | "The IDA transaction could not be processed successfully" | 412       |
| "611"      | "Not eligible for questions"                              | 412       |
| "612"      | "Identity verification failed"                            | 412       |

### Customer Service ( **700** )

| Error Code | Message                       | HTTP Code |
| ---------- | ----------------------------- | --------- |
| "701"      | "Unable to find the customer" | 500       |
| "702"      | unknown                       | unknown   |
| "703"      | "Email Address already exist" | 409       |

### Internal Transfer ( **800** )

| Error Code | Message                                  | HTTP Code |
| ---------- | ---------------------------------------- | --------- |
| "801"      | "Insufficient balance"                   | 400       |
| "802"      | "Daily access limit exceed"              | 400       |
| "803"      | "Weekly access limit exceed"             | 400       |
| "804"      | "Monthly access limit exceed"            | 400       |
| "805"      | "Daily counter limit exceed"             | 400       |
| "806"      | "Monthly counter limit exceed"           | 400       |
| "807"      | "Immediate Transfers cannot be modified" | 403       |

### Invitation Service ( **900** )

| Error Code | Message                           | HTTP Code |
| ---------- | --------------------------------- | --------- |
| "901"      | "The invitee is already a member" |           |
| "902"      | "Failed to send invitation"       |           |

### Urban Airship Service ( **1000** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
|            |         |           |

### Verification Service ( **1100** )

| Error Code | Message                                  | HTTP Code |
| ---------- | ---------------------------------------- | --------- |
| "1100"     | "This type of email is not allowed"      | 400       |
| "1101"     | "Invalid email address"                  | 400       |
| "1102"     | "New verification code is required"      | 400       |
| "1103"     | "Invalid verification code"              | 400       |
| "1104"     | "Verification code is expired"           | 400       |
| "1105"     | "This verification code is already used" | 400       |

### Member Service ( **1200** )

| Error Code | Message                                                      | HTTP Code |
| ---------- | ------------------------------------------------------------ | --------- |
| "1201"     | "Invalid request parameter"                                  | 400       |
| "1202"     | "Sorry! Our service is not currently available for country." | 400       |
| "1203"     | "Username or Password is not correct"                        | 401       |
| "1204"     | "Language not supported"                                     | 400       |
| "1205"     | "Invalid inviter code or member email"                       | 400       |

### Country Service ( **1300** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
| ""         | ""      |           |

### Transition service ( **1400** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
| ""         | ""      |           |

### Auth Middleware ( **1500** )

| Error Code | Message                                   | HTTP Code |
| ---------- | ----------------------------------------- | --------- |
| "1501"     | "Authentication token missing"            | 403       |
| "1502"     | "Authentication token invalid or expired" | 400       |
| "1503"     | "You are not authenticated"               | 401       |

### Savings Goals ( **1600** )

| Error Code | Message                          | HTTP Code |
| ---------- | -------------------------------- | --------- |
| "1601"     | "The savings goal is not found." |           |

### ATM Service ( **1700** )

| Error Code | Message                                 | HTTP Code |
| ---------- | --------------------------------------- | --------- |
| "1701"     | "No bank found"                         | 404       |
| "1702"     | "No location found within this address" | 404       |

### Card Service ( **1800** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
| ""         | ""      |           |

### Jumio Service ( **2000** )

| Error Code | Message                            | HTTP Code |
| ---------- | ---------------------------------- | --------- |
| "2001"     | "Unable to get Jumio Data"         | 400       |
| "2002"     | "jumio verification faild"         | 200       |
| "2003"     | "jumio verfication status pending" | 200       |

### P2P Service ( **2100** )

| Error Code | Message                          | HTTP Code |
| ---------- | -------------------------------- | --------- |
| "2100"     | "Unable to get recipients"       | 404       |
| "2101"     | "Duplicate payment alert"        | 409       |
| "2102"     | "Insufficient Available Balance" | 422       |
| "2103"     | "Invalid Phone Number"           | 400       |

### Promotion Service ( **2200** )

| Error Code | Message          | HTTP Code |
| ---------- | ---------------- | --------- |
| "2201"     | "Invalid member" | 400       |

### Validation Error ( **4000** )

| Error Code | Message | HTTP Code |
| ---------- | ------- | --------- |
| "4000"     | unknown | 400       |

### Internal Server Error ( **5000** )

| Error Code | Message                         | HTTP Code |
| ---------- | ------------------------------- | --------- |
| "5000"     | "Internal Server Error"         | 500       |
| "5001"     | "Unknown/Unmapped Server Error" | 500       |
