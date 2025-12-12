## What we want
- A form is related to a user and a set of questions
- For now the user will be just an entry of the form, we wont be implementing the user part
- Since this could be a complicated form, maybe users should be able to leave it as is and turn back to it later, we would need to handle some kind of draft state, and update it as users are filling it, not just in the end
- Start simple: only the answers will be in the database (for now we wouldnt know how to handle i18n with a db)
- Maybe in order to encourage the user to continue filling the form we can provide some progress indicator? Also if they had multiple form to finish it would be nice to attract the attention on the ones they need to finish (for instance is there a deadline?)
- Seems we'll need i18n since the form is in en and fr
- What about mobile?



## Questions to my assistant
1. @readme.md explain better this part of the assignment ```
readme.md (90-104)
  what is the realtion between Q100 and Q101?
2. when they speak about a table what do they mean in a UI point of view?
3. use npx create-next-app@latest nextjs-prisma
4. how do I try this healthcheck? `@docker-compose.yml (14-18)`
5. Given this assignment @full_stack/readme.md, do you see other nice features, things to be careful of that could be added to this paragraph? @ASSIGNMENT.md (1-5)
