---
lang: en,amharic, oromic,
title: Wollo-Info Hub -- System Documentation
viewport: width=device-width, initial-scale=1
---

**Wollo-Info Hub**

[Goal](#goal)[Account types](#accounts)[System
architecture](#architecture)[Folder structure](#structure)[Student
journey](#journey)[Student dashboard and library](#student)[Department
head page](#depthead)[Union and club pages](#unions)[Admin
panel](#admin)[AI chatbot](#chatbot)[Database plan](#database)[Access
rules (RLS)](#rls)[API and functions](#api)[Security
rules](#security)[Deployment](#deploy)[Build roadmap](#roadmap)[Open
decisions](#decisions)[Working notes](#working)

::: {role="main"}
# Wollo-Info Hub

System documentation: what we are building, who can do what, and how the
parts fit together. Frontend: React + Vite (JSX). Backend: Supabase
(Auth, Postgres with RLS, Storage, pgvector) plus an Express API on
Render. An AI chatbot reads the site\'s own data to help students.

::: {#goal .section}
## Goal

Give students trustworthy information about Wollo University and make
university life easier: departments, courses, graduates, opportunities,
student unions and clubs, motivation and study documents. Detailed
information is shown only after login. An AI chatbot, connected to the
same data as the site, tells students what they can do and how to do it,
step by step, in Amharic or English.

-   **Students** sign in to read detailed department information, follow
    unions and keep a personal library.
-   **Department heads** manage the information of their own department.
-   **Union and club accounts** post news and opportunities on their own
    page.
-   **Admin** controls everything.
:::

::: {#accounts .section}
## Account types

There are four kinds of account. Staff and heads are stored in
`staff_profiles` with a `role` of `admin`, `head`, `staff` or `union`.
Students are stored in `students`. Every account also has a row in
`public.users`, linked to Supabase Auth.

::: tw
  Account                 Created by                            Linked to                      Main job
  ----------------------- ------------------------------------- ------------------------------ ------------------------------------------------------
  Student                 Self-registration (email or Google)   One department, or \"fresh\"   Read detail pages, personal library, use the chatbot
  Department head         Admin                                 One department                 Add and edit information about their department
  Union or club account   Admin                                 One union                      Post news and opportunities on the union page
  Admin                   Another admin or setup script         None                           Control the whole site
:::

### Permissions

::: tw
  Action                                                              Visitor       Student    Union                        Dept head        Admin
  ------------------------------------------------------------------- ------------- ---------- ---------------------------- ---------------- ------------
  See public home, department list, union pages, opportunity titles   Yes           Yes        Yes                          Yes              Yes
  See detailed department information                                 Login first   Yes        Yes                          Yes              Yes
  Use personal library                                                No            Own only   No                           No               No
  Use the AI chatbot                                                  Login first   Yes        Yes                          Yes              Yes
  Edit department profile, courses, prerequisites, graduates          No            No         No                           Own department   All
  See students interested in a department                             No            No         No                           Own department   All
  Post on a union page                                                No            No         Own union                    No               All unions
  Add opportunities and motivation                                    No            No         Own union (as union posts)   Own department   All
  Add library documents and help guides                               No            No         No                           Own department   All
  Add or remove department heads and union accounts                   No            No         No                           No               Yes
  Create, edit or remove departments, programs and unions             No            No         No                           No               Yes
  See all users and reset accounts                                    No            No         No                           No               Yes
:::
:::

::: {#architecture .section}
## System architecture

::: layers
::: {.layer .u}
**Users**[Visitor, student, department head, union account,
admin]{.small}
:::

::: {.layer .f}
**React + Vite frontend (Vercel)**[Public pages, login gate, student
dashboard, head page, union dashboard, admin console, chat window.
Languages: en, am, om.]{.small}
:::

::: {.layer .f}
**Express API (Render) and chat service (edge function)**[The API
handles admin actions and protected writes. The chat service searches
the data and calls the AI model.]{.small}
:::

::: {.layer .s}
**Supabase project**[Auth (email, Google) · Postgres with RLS and RPC
functions · Storage (files, photos) · pgvector (chat knowledge)]{.small}
:::

::: {.layer .s}
**AI model (external API)**[Answers only from the content the chat
service gives it. The API key lives on the server, never in the
frontend.]{.small}
:::
:::

### How a request moves

-   Login and Google sign-in go from the frontend straight to Supabase
    Auth.
-   Public reads and student reads go to Supabase with the user\'s
    token, so RLS decides what comes back.
-   Admin actions (create a head, remove a union account) go through the
    Express API, which checks the role first.
-   Chat questions go to the chat service with the user\'s token, so the
    chatbot can only read what that user may read.
:::

::: {#structure .section}
## Folder structure

Taken from your project. Items marked *new* are planned.

    wollo-info-hub/                 # frontend (React + Vite, JSX)
    ├── public/
    ├── src/
    │   ├── api/                    # fetch helpers (client.js)
    │   ├── assets/
    │   ├── components/             # shared UI, new: ChatWidget
    │   ├── context/                # AuthContext (Supabase auth, Google sign-in)
    │   ├── i18n/                   # en, am, om
    │   ├── pages/
    │   │   ├── Admin/              # admin console
    │   │   ├── Auth/               # login, register, Google
    │   │   ├── departments/<Name>/ # public department pages
    │   │   ├── student/            # new: Dashboard, Library, DepartmentInfo
    │   │   ├── depthead/           # new: Profile, Courses, Graduates, Interested
    │   │   └── unions/             # new: UnionPage, UnionDashboard
    ├── .env  index.html  package.json  vite.config.js  README.md

    wollo-info-backend/             # Supabase backend
    ├── supabase/migrations/        # 0001–0009 (core tables, triggers, RLS, RPC, storage)
    │   └── new: unions, courses, graduates, library, help guides, knowledge_chunks
    ├── supabase/functions/         # new: chat (edge function), embed-content
    ├── src/server.js               # Express API (Render)
    ├── .env
    └── package.json
:::

::: {#journey .section}
## Student journey

::: flow
Open site*→*Browse public pages*→*Click detail*→*Login or
register*→*Student dashboard
:::

1.  A visitor sees the public pages. Clicking anything detailed
    redirects to `/auth` and returns to the same page after login.
2.  At registration the student says whether they are **fresh** (not yet
    in a department) or already in a department.
3.  A current student gets their department\'s detailed page. A fresh
    student can mark one or more departments as \"interested\", which
    department heads can see.
4.  The dashboard offers an optional personal library. A student can
    skip it and create it later.
5.  The chat window is available on every logged-in page for questions
    such as \"how do I fix my registration?\".
:::

::: {#student .section}
## Student dashboard and library

### Dashboard

-   My department: duration, courses, prerequisites, graduates,
    opportunities.
-   Interested departments (for fresh students).
-   Latest opportunities, motivation posts and union news.
-   Chat window.

### Personal library

-   Created on demand with \"Create my library\". Fresh students can
    leave it out.
-   Only the owner can see it. RLS enforces `owner_id = auth.uid()` on
    every row.
-   A student can save official documents and upload their own files to
    Supabase Storage.
-   Allowed file types and size limits follow the existing media rules
    (blocked extensions, 20 MB per file).
:::

::: {#depthead .section}
## Department head page

One page per department head, limited to that head\'s department. The
admin creates the head account and can remove it.

::: tw
  Section                             What the head manages
  ----------------------------------- -------------------------------------------------------------------------------------------
  Department profile                  Description, duration in years, degree type
  Course list                         Courses by year and semester, credit hours
  Prerequisites                       Entry requirements for the department
  Graduates                           Graduates by year, name, current work (shown to students)
  Interested students                 Read-only list of students who chose this department, from the `department_students` view
  Opportunities and motivation        Create, edit, publish for this department
  Library documents and help guides   Upload documents and write procedures for this department\'s students
:::
:::

::: {#unions .section}
## Union and club pages

Each student union or club has its own public page and its own account.
The union account posts news and opportunities that students see on that
page, on the dashboard and in the chatbot.

::: tw
  Union             Page                      Typical posts
  ----------------- ------------------------- ----------------------------------------
  Media Art union   `/unions/media-art`       Exhibitions, workshops, calls for work
  Student union     `/unions/student-union`   News, announcements, uploads
  Sport union       `/unions/sport`           Matches, tryouts, events
  AppFactory        `/unions/appfactory`      Projects, hackathons, openings
  Tech Club union   `/unions/tech-club`       Talks, trainings, competitions
:::

-   The admin can add a new union, create its account, and remove
    either.
-   A union account can write only to its own union\'s posts. RLS checks
    `union_id` on every write.
-   The admin can also post opportunities directly and create a page for
    each one.
:::

::: {#admin .section}
## Admin panel

-   **Users:** list of students, staff, heads, union accounts and admins
    with name, id, email, role and department or union.
-   **Department heads:** add, assign a department, change, deactivate
    or remove.
-   **Union accounts:** add a union, create its account, deactivate or
    remove.
-   **Departments and programs:** add, edit and delete dynamically under
    faculties such as Social Science and Informatics. The nav bar
    dropdowns and the Departments page read from the database.
-   **Opportunities and motivation:** add, edit, publish, and create a
    page for each opportunity.
-   **Password reset:** through Supabase Auth admin functions, never by
    showing a password.
-   **Chatbot:** see unanswered questions and turn them into guides.

::: {.co .warn}
**Passwords are not viewable**Supabase Auth stores passwords as hashes.
They cannot be read back, and showing them would be unsafe even for an
admin. The admin sees names and emails and can send a reset instead.
:::
:::

::: {#chatbot .section}
## AI chatbot

The chatbot is connected to the site\'s own data. It tells students what
they can do and how, using content published by the admin, department
heads and unions. It answers in the language the student writes in
([አማርኛ]{.am} or English).

### How it works

1.  **Knowledge.** Departments, courses, prerequisites, opportunities,
    motivation, union posts, documents and help guides are split into
    chunks and stored in `knowledge_chunks` with an embedding. Use a
    multilingual embedding model so Amharic works.
2.  **Search.** The chat service embeds the question and finds the
    closest chunks with pgvector. For personal questions it also calls
    database functions (for example \"opportunities for my
    department\").
3.  **Answer.** The AI model receives the question and the found
    content, and answers only from that content, with the source named.
4.  **No match.** The chatbot says it does not know, offers the guide
    categories, and logs the question in `unanswered_questions` so staff
    can write a guide.
5.  **Freshness.** A trigger or function re-embeds a chunk whenever its
    source row is created or edited.

### Rules

-   The chat service uses the student\'s own token, so RLS limits what
    it can find. It never returns other students\' data.
-   The AI API key stays on the server (edge function or Render). It is
    never in the frontend.
-   Rate limit per user. Stay on university topics. Never invent office
    numbers, deadlines or fees.
-   Show the source with each answer, for example \"from the Computer
    Science department page\".

### Guide format (the structured part of the knowledge)

``` json
{
  "category": "registration",
  "title_en": "Fix a registration problem",
  "title_am": "የምዝገባ ችግር",
  "keywords": ["registration", "register", "ምዝገባ"],
  "department_id": null,
  "steps": [
    { "no": 1, "text_en": "Go to the Registrar office.", "text_am": "ወደ ሬጅስትራር ቢሮ ይሂዱ።", "office": "Registrar", "room": "123", "photo": "registrar.jpg" },
    { "no": 2, "text_en": "Then visit the side office.", "text_am": "ከዚያ ወደ ጎን ቢሮ ይሂዱ።", "office": "Side office", "room": "Not set", "photo": null },
    { "no": 3, "text_en": "Finally visit your department head.", "text_am": "በመጨረሻ የትምህርት ክፍል ኃላፊውን ይጎብኙ።", "office": "Department head", "room": "232", "photo": "head.jpg" }
  ]
}
```

::: {.co .tip}
**Guides are the backbone**Even with an AI model, accurate office
numbers and photos come from guides written by admins, heads and unions.
The model explains and connects them; it does not make them up.
:::
:::

::: {#database .section}
## Database plan

Postgres on Supabase. Migrations `0001`--`0009` already hold the core
tables, triggers, RLS, RPC functions and storage. Check the \"Status\"
column against your migration files; *Existing* means it was planned in
the first Supabase schema.

::: tw
  Table                                            Main columns                                                                                Status
  ------------------------------------------------ ------------------------------------------------------------------------------------------- --------------------------------------------------
  users                                            id (links to auth.users), full_name, email, avatar                                          [Existing]{.tag .ex}
  staff_profiles                                   user_id, role (admin \| head \| staff \| union), department_id, union_id, is_active         [Existing]{.tag .ex} add union role and union_id
  students                                         user_id, department_id (null = fresh)                                                       [Existing]{.tag .ex}
  departments                                      id, slug, name, faculty, description, duration_years, degree_type                           [Existing]{.tag .ex} add fields if missing
  opportunities                                    title, body, department_id, union_id, created_by, published                                 [Existing]{.tag .ex} add union_id
  motivations                                      title, body, department_id, created_by, published                                           [Existing]{.tag .ex}
  department_students (view)                       students joined with department and user                                                    [Existing]{.tag .ex}
  audit_logs                                       actor_id, action, table, row_id, created_at                                                 [Existing]{.tag .ex}
  unions                                           id, slug, name, description, logo                                                           [New]{.tag .nw}
  union_posts                                      union_id, title, body, type (news \| opportunity), image, created_by, published             [New]{.tag .nw}
  department_requirements                          department_id, text_en, text_am                                                             [New]{.tag .nw}
  courses                                          department_id, year, semester, code, title, credit_hours                                    [New]{.tag .nw}
  graduates                                        department_id, name, graduation_year, current_work, photo                                   [New]{.tag .nw}
  department_interest                              student_id, department_id, created_at                                                       [New]{.tag .nw}
  libraries and library_items                      owner_id; library_id, title, file or document_id                                            [New]{.tag .nw}
  documents                                        title, file path, department_id (null = all), uploaded_by                                   [New]{.tag .nw}
  help_categories, help_guides, help_guide_steps   categories, guides with en/am titles and keywords, ordered steps with office, room, photo   [New]{.tag .nw}
  knowledge_chunks                                 source_table, source_id, text, language, embedding (vector)                                 [New]{.tag .nw}
  chat_messages                                    user_id, role, text, created_at                                                             [New]{.tag .nw}
  unanswered_questions                             user_id, text, language, created_at, resolved_guide_id                                      [New]{.tag .nw}
:::

Use UTF-8 everywhere so Amharic text is stored correctly. Enable the
`vector` extension for `knowledge_chunks`.
:::

::: {#rls .section}
## Access rules (RLS)

Row level security is the main security layer. Every table has RLS on.
The rules below describe intent; write them as policies in a new
migration.

::: tw
  Table                                                          Read                                                       Write
  -------------------------------------------------------------- ---------------------------------------------------------- -------------------------------------------------------------
  departments, unions, published union_posts and opportunities   Everyone (public fields)                                   Admin; head for own department; union account for own union
  department detail, courses, graduates                          Logged-in users                                            Admin; head for own department
  department_students and department_interest                    Admin; head for own department; the student for own rows   The student for own rows
  libraries and library_items                                    Owner only                                                 Owner only
  staff_profiles                                                 Admin; each person reads own row                           Admin only
  knowledge_chunks                                               Chat service, filtered by what the user may read           Embedding function only
  chat_messages, unanswered_questions                            Owner for own messages; admin and staff for unanswered     Chat service
:::

::: {.co .note}
**Helper functions**Create small SQL functions such as `is_admin()`,
`my_department_id()` and `my_union_id()` and use them in the policies,
so the rules stay short and readable.
:::
:::

::: {#api .section}
## API and functions

Most reads and own-row writes go straight to Supabase under RLS. The
Express API and edge functions cover what the browser must not do
itself.

::: tw
  Where                                                  Who         Purpose
  ------------------------------------------------------ ----------- ---------------------------------------------------------------------------------------
  Supabase Auth                                          Public      Register (student only), login, Google sign-in, password reset email
  POST /api/admin/heads, DELETE /api/admin/heads/:id     Admin       Create or remove a department head (uses the service role key on the server)
  POST /api/admin/unions, DELETE /api/admin/unions/:id   Admin       Create or remove a union and its account
  PATCH /api/admin/users/:id                             Admin       Change role, department, union, active state; trigger a password reset
  Direct table access with RLS                           By role     Departments, courses, graduates, opportunities, union posts, library, interest
  Edge function `chat`                                   Logged in   Search knowledge, call the AI model, return answer and sources
  Edge function `embed-content`                          System      Create or refresh `knowledge_chunks` when content changes
  GET /                                                  Public      Health check, so the Render root returns a simple status instead of a not-found error
:::
:::

::: {#security .section}
## Security rules

-   Check the role on the **server or in RLS** for every protected
    action. Hiding a button in React is not security.
-   Heads and union accounts can only change rows where `department_id`
    or `union_id` matches their own.
-   The Supabase **service role key** lives only in the backend
    environment. Never put it in the frontend or in Git.
-   The frontend uses only the public (anon) key and the user\'s own
    token.
-   Never return password hashes or secrets. Reset instead of reveal.
-   Students see only their own library and profile. Student personal
    data is visible only to the admin and the matching department head.
-   Keep every `.env` out of Git and check it was never committed.
-   Rate limit login and the chat function. Validate file types and
    sizes on upload.
-   Keep CORS limited to your Vercel and local origins.
:::

::: {#deploy .section}
## Deployment

::: tw
  Part                                      Where                                Notes
  ----------------------------------------- ------------------------------------ ---------------------------------------------------------------------------------------------------------
  Frontend                                  Vercel (wollo-info-hub.vercel.app)   `VITE_API_URL` points to the Render URL; the Supabase URL and anon key are set as environment variables
  Express API                               Render                               Service role key and AI key stored as Render environment variables; add a `GET /` route
  Database, Auth, Storage, edge functions   Supabase                             Apply migrations in order; set Google provider redirect URLs for both local and Vercel
  Local development                         localhost (frontend on 5173)         Google sign-in must return to whichever site (local or deployed) started it
:::
:::

::: {#roadmap .section}
## Build roadmap

Small phases, each one working before the next starts.

1.  **Roles and departments:** add the `union` role, the `unions` table,
    helper functions and RLS; admin adds and removes heads and union
    accounts; admin adds and deletes departments dynamically.
2.  **Login gate:** redirect to login for detail pages and return after
    login; student registration with department or \"fresh\"; fix the
    registration 404 in `Auth.jsx`.
3.  **Department head page:** profile, courses, requirements, graduates,
    interested students, opportunities and motivation.
4.  **Union pages:** public union pages and the union dashboard for
    posting.
5.  **Content on the public site:** make new motivation and
    opportunities show on the public pages (Supabase version of the
    fix).
6.  **Documents and student library.**
7.  **AI chatbot:** pgvector, embedding on publish, chat function,
    guides with steps and photos, unanswered-question log.
8.  **Admin polish and security review:** RLS tests, rate limits,
    deployment checks.
:::

::: {#decisions .section}
## Open decisions

-   Should union posts show publicly right away, or wait for admin
    approval?
-   Can a student follow several unions? Can one union have several
    accounts?
-   Does a student belong to one department, or can they be interested
    in several?
-   Should students register freely, or with a university ID number that
    we verify?
-   Which AI model and embedding model will the chatbot use, and what
    monthly budget is acceptable?
-   Which office names and numbers should the first guides cover
    (registration, dormitory, library, department change)?
:::

::: {#working .section}
## Working notes

Notes to keep the project consistent when building with an assistant or
with Kiro.

-   The backend is Supabase, not MySQL. Any fix that mentions MAMP or
    the old MySQL database is out of date and must be redone for
    Supabase.
-   Frontend files are JSX (React + Vite). When asked for code, give
    complete files (full JSX and CSS), not snippets.
-   When a message asks for \"the prompt\", deliver only the prompt text
    for the build tool, not the generated code.
-   Keep department-scoped and union-scoped permissions in RLS first,
    then mirror them in the UI.
-   Current known issues: student registration returns a 404 from
    `Auth.jsx`; new motivations do not appear on the public Motivation
    page; the Render backend root returns `Route GET / not found`.
:::
:::
