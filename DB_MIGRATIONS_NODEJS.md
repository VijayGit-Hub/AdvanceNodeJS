# Database Migrations in Node.js (for someone coming from Spring Boot + Liquibase)

## Short answer

**Liquibase is rarely used in the Node.js world.**

It does work, because it is database-level and language-agnostic, but it needs a Java runtime. You mostly see it (or Flyway) in two situations:

- Companies where Java teams already standardise on it.
- A Node service that shares a database with Spring services.

In Node, migrations usually come **bundled with the ORM or query builder** you pick, not as a separate tool.

---

## The common tools

| Tool | Style | Where you see it |
|---|---|---|
| **Prisma Migrate** | You edit a schema file and it generates SQL migrations | The most common choice for new TypeScript projects |
| **Drizzle Kit** | Schema written in TypeScript, generates SQL migrations | Growing fast; lighter and closer to SQL than Prisma |
| **Knex migrations** | Hand-written JS/TS files with `up`/`down` | The classic choice in Express apps |
| **TypeORM migrations** | Entity classes, with generated or hand-written migrations | Common with NestJS; closest to the JPA/Hibernate feel |
| **Sequelize CLI** | Hand-written `up`/`down` files | Many older Express codebases |
| **node-pg-migrate**, **dbmate**, **Atlas** | Standalone and SQL-first, no ORM | Teams that want a Flyway-like tool |
| **migrate-mongo** | JS scripts with `up`/`down` | MongoDB/Mongoose apps |

---

## Mapping Liquibase concepts to Node tools

| Liquibase concept | Node equivalent |
|---|---|
| Changelog and changesets | A folder of timestamped migration files |
| `DATABASECHANGELOG` table | Each tool keeps its own tracking table, such as `_prisma_migrations` or `knex_migrations` |
| Rollback | `down` functions in Knex, Sequelize and TypeORM. Prisma and Drizzle are effectively forward-only |
| Diff / generate changelog | Prisma, Drizzle and TypeORM can generate a migration by comparing your schema to the database |
| Preconditions, contexts, labels | Mostly no equivalent. Node tools are simpler |

---

## One practical difference from Spring Boot

Spring Boot runs Liquibase **automatically at application startup**.

In Node, the usual practice is to run migrations as a **separate deploy step**:

- a CI/CD pipeline stage, or
- a Kubernetes Job, or
- an init container.

This avoids several instances racing to migrate at the same time when the app runs under PM2 cluster mode or as multiple pods.

---

## What to pick

| Situation | Recommendation |
|---|---|
| New Express + TypeScript + Postgres/MySQL | **Prisma**, or **Drizzle** if you prefer staying close to SQL |
| Plain JavaScript or an existing Express app | **Knex** |
| SQL-first with no ORM | **node-pg-migrate** or **dbmate** |
| MongoDB | **migrate-mongo** (many Mongo apps have no formal migrations at all, because the database is schemaless) |
| Organisation already mandates it | **Liquibase** |
