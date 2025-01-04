# Database

[Drizzle](https://orm.drizzle.team/docs/overview) is a tool that makes it easy to work with databases in TypeScript.
This project uses Sqlite because it's simple (it's just one file) and fast.

To change the database, open the file `src/lib/schema.ts` and add what you need.
Then run `bun db:generate` to update everything.

# Example

Let's add more user information. Open `src/lib/schema.ts` and change `userTable`:

```ts
export const userTable = sqliteTable("user", {
  id: integer().primaryKey(),
  email: text().unique().notNull(),
  method: text().notNull(),
  data: text().notNull(),
  customerId: text(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  description: text(), // NEW FIELD
});
```

After you make changes, run `bun db:generate`.
The changes apply automatically when you start the app.
