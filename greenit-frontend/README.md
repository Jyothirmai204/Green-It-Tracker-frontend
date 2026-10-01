# Green IT Tracker — Frontend

A React (Vite) frontend for the Green IT Tracker Spring Boot backend. Plain `fetch`
is used for all API calls — no axios, no extra HTTP library.

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend isn't on :8082
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend at
`http://localhost:8082/api` by default.

## Backend must enable CORS

The uploaded backend has no CORS configuration, so browser requests from
`localhost:5173` will be blocked until you add one.

1. Drop `CorsConfig.java` (provided alongside this app) into
   `src/main/java/com/greenittracker/config/`.
2. In `SecurityConfig.java`, tell the filter chain to actually use it — add
   `.cors(cors -> {})` to the `http` chain, e.g. right before `.csrf(...)`:

   ```java
   http
       .cors(cors -> {})
       .csrf(csrf -> csrf.disable())
       ...
   ```

   Without this line, Spring Security ignores the `CorsConfigurationSource`
   bean and preflight `OPTIONS` requests still get rejected.
3. Restart the backend.

## What's included

- **Auth** — register / login against `/api/auth/*`, JWT stored in
  `localStorage`, attached as `Authorization: Bearer <token>` on every
  authenticated request.
- **Dashboard** — `/api/dashboard/summary`, shown as a green-score gauge and
  resource status breakdown.
- **Resources** — full CRUD against `/api/resources`.
- **Sustainability** — view + recalculate `/api/sustainability`.
- **Paperless** — view + log `/api/paperless`.
- **Recommendations** — view `/api/recommendations`, generate new ones.

## A couple of backend things worth knowing

- **Login response has no role.** `LoginResponseDto` only returns
  `userId`, `fullName`, `email`, `token` — no role claim, and the JWT itself
  only encodes the username. So this frontend can't show/hide admin-only
  buttons up front; it just attempts the action and shows the backend's
  403 message if you're not allowed (e.g. deleting a resource as a non-admin).
- **Possible role-prefix mismatch:** `ResourceController.createResource` uses
  `@PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_MANAGER')")` while
  `updateResource`/`deleteResource` use `hasAnyRole('ADMIN','MANAGER')` /
  `hasRole('ADMIN')`. Spring's `hasRole`/`hasAnyRole` already prepends
  `ROLE_`, so the first one effectively checks for `ROLE_ROLE_ADMIN` and will
  likely reject real admins when creating a resource. Worth fixing on the
  backend to `hasAnyRole('ADMIN','MANAGER')`.
