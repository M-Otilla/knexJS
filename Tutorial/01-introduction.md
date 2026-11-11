# Knex.js for Laravel Developers

This tutorial follows the project and examples in the [runnable example](../example/) and the accompanying slide deck. It is for Laravel developers learning to build an Express application with Knex.

## The main difference

Eloquent is an ORM: it provides models and relationship conventions. Knex is a SQL query builder. It helps compose and execute SQL, but does not create Eloquent-style model objects or relationships for you.

You can keep familiar application boundaries—routes, middleware, controllers, and an optional model layer—while making database queries explicit:

```text
HTTP request → Express route → middleware → controller → Knex query
```

In the example, the model layer is a small application convention. It groups reusable queries; it is not supplied by Knex.

## What you will build

The [example project](../example/) is a small Express API for users and posts. It demonstrates:

- Express routes, bearer-token middleware, controllers, and validation
- A shared Knex connection with SQLite as the local default and MySQL as an option
- Reversible migrations and sample data
- Query-builder operations, joins, and bound values

## Chapters

1. [Introduction](01-introduction.md)
2. [Project setup](02-setup.md)
3. [Routes, middleware, and controllers](03-routing-controls.md)
4. [A lightweight model layer](04-models.md)
5. [Database configuration and migrations](05-database.md)
6. [Query builder patterns](06-queries.md)

## Prerequisites

- Node.js 20 or newer and npm
- Familiarity with JavaScript and basic HTTP concepts
- Basic SQL knowledge is helpful
- Express experience is useful, but not required

You do not need a database server to follow the default SQLite setup.
