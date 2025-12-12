## What we want
- A form is related to a user and a set of questions
- For now the user will be just an entry of the form, we wont be implementing the user part
- Since this could be a complicated form, maybe users should be able to leave it as is and turn back to it later, we would need to handle some kind of draft state, and update it as users are filling it, not just in the end
- Start simple: only the answers will be in the database (for now we wouldnt know how to handle i18n with a db)
- Maybe in order to encourage the user to continue filling the form we can provide some progress indicator? Also if they had multiple form to finish it would be nice to attract the attention on the ones they need to finish (for instance is there a deadline?)
- Seems we'll need i18n since the form is in en and fr
- What about mobile?


## Things seen while developing
- Looked for a stepper in shadcn but didnt find anything, tried the stepper of material ui but it was not satisfactory so decided to use mantine as well

## Questions to my assistant
1. askMode: @readme.md explain better this part of the assignment ```
readme.md (90-104)
  what is the realtion between Q100 and Q101?
2. askMode: when they speak about a table what do they mean in a UI point of view?
3. use npx create-next-app@latest nextjs-prisma
4. askMode: how do I try this healthcheck? `@docker-compose.yml (14-18)`
5. askMode: Given this assignment @full_stack/readme.md, do you see other nice features, things to be careful of that could be added to this paragraph? @ASSIGNMENT.md (1-5)
6. askMode: Now how would you handle this csv file to make it a form using a stepper? Would you turn it runtime into some kind of js object? would you have it already compiled into some kind of json? How would you ensure the structure sent to the frontend is correct (hint: zod schema)?
7. askMode: I wouldn't do the parsing at run time, I'm afraid this might increase the fetching time too much. Also is there a reason why you use a fetch instead of using a server component to load the form data and then pass it to a ui?
8. agentMode: ok, let's implement it this way
9. askMode: [review of ai actions] `style={{ marginBottom: "1rem" }}` dont use style, use tailwind or something else that is provided by mantine
10. agentMode: [review of ai actions] Why isnt the question type derived from the zod schema? we dont wan't schema or type duplication ```@schema.ts (50-63)
11. agentMode: [review of ai actions] `content: (values[3]?.trim() || "") as "number" | "text" | "enum" | "table" | "",` we dont want type coertion, we want a zod wchema to validate this, maybe a refine or coerce could be used? If the content is not correct then zod would throw an error?
12. askMode: [review of ai actions] @full_stack/lib/questions/loader.ts Can't we use some builtin cache? what is the use of caching in this way?
13. agentMode: ok, for now remove the cache, we'll focus o this another day
14. `@schema.ts (7-17)` `@schema.ts (37-54)`  can't we make a unique schema for the common attributes of these schemas and then extend it for the differing ones?
15. `@schema.ts (61-62)`  we could be adding another language some day. make it easier to do it, for instance have a languageSchema and use it everywhere you see translations
16. `z.enum(["number", "text", "enum", "table", ""]);` can they be coerced to lower case?
17. getting a hydration error - look at mantine documentation about when app has server rendering https://mantine.dev/getting-started/
18. agentMode: cant we rather use this import `https://nextjs.org/docs/messages/react-hydration-error#solution-2-disabling-ssr-on-specific-components `? what would be the advantage of this against `suppressHydrationWarning`?
19. agentMode: but nowwhere mantine is recommending to use suppressHydrationWarning
