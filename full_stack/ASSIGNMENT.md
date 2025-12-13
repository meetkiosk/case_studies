## How to run the project

```bash
asdf install (delete the .tool-versions file if you dont want to use it)
pnpm i
docker compose up
pnpm run dev
```

## What I most focused on
- I tried to make the UX as smooth as possible. This was important to me the user would be able to leave the form and come back later, and the app to 'remember' what they saved.


## What I would improve next
**UI/UX**
- I find the UI a bit raw, I would like to make it prettier
- mobile: I implemented the form for desktop because I was assuming this might be the main device for a professional use, but truth is people use mobile in any cases!
- When the user has completed the form, the app still continues to celebrate. I would had something on the form model to mark it as complete.

**Code**
- The actions.ts file. IMHO it is not scalable
- Error handling. Right now it is scarse: I would improve it in the ux, but also make sure the errors are sent to sentry or some observability tool.
- User validation: in the actions file I didn't take enough advantage of what zod has to offer
- I would add some tests!
- I didn't dig into react-forms, but I surely would if I had more time. Probably I would also try to use `form` tags
- i18n: I see the csv file has both french and english, I would implement it
- I didnt dig very deep into mantine vs tailwind, and I'm not sure I used the library correctly
- I had many doubts forms: would it be possible the app should support other kind of forms? Who / what provide forms (meaning the csv file)? Would they always have this structure? What if the form was more than 1 level deep?


## How I used AI

### Summary

I used AI in three main modes throughout the project:

**askMode**
- Clarified assignment requirements and data relationships
- Understood UI concepts (e.g., what "table" means in the context)
- Asked for best practices and architectural decisions (CSV parsing strategy, caching, validation approaches)
- Reviewed AI-generated code to ensure it followed project conventions

**agentMode**
- Reviewed AI-generated code to enforce coding standards (no inline styles, proper Zod usage, avoiding type coercion)
- Fixed schema duplication issues and enforced type derivation from Zod schemas
- Implemented refactoring tasks (removing cache, consolidating schemas, fixing hydration issues)
- Extracted components and improved code organization

**planMode**
- Planned major features (form list page, form navigation, stepper implementation)
- Designed database schema and Prisma migrations
- Implemented form validation, section completion logic, and batch saving
- Added UX improvements (progress messages, fixed headers, scrollable sections)
- Implemented celebration features (confetti, congratulations modal)


### Detailed Prompts
1. askMode: @readme.md explain better this part of the assignment ```
readme.md (90-104)
  what is the relation between Q100 and Q101?
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
20. planMode: @full_stack/app/page.tsx on this page, we want the list of forms the user has, with its status (x% completed). We can either choose to create a new form (an entry in the database is created), or choose one of the already initiated forms. When we click on one of the card, then the form page appears ([formId] kind of page). The form page has a Form component, which contains the stepper. the stepper is vertical and placed inside a sidebar on the left. the form content is in the main container. In the database, a form has a userId (for now the userId is default since we dont have a concept of user and we want to keep it that way). and it is related to some AnswerToQuestions. show me how you want to implement this.
21. planMode: Also we want an exit and save button that allows the user to return to the form list and save even unfinished sections
22. planMode: additional notes: we know the @full_stack/questions.csv csrd form. when we parse the csv file, we would like to add an id to the json object, so we can then say in prisma that the form the user is filing is of type `csrd`. Besides, we dont like the type of questions is mapped as content, we want it to be mapped as "type"
23. planMode: ok for implementing this, just add to the plan to stop at each step and ask for my confirmation before proceeding further
24. planMode: wait we like the fact you were adding some prisma logs, try harder, but DO NOT use type coertion. Look for solutions on the web if necessary
25. planMode: what does the pg adapter do?
26. planMode: can an adapter cause some performance problems?
27. planMode: shouldn't we be using zod for some of the actions (for input validation)? form instance the create Form, we should add some control over the formType, right? Same thing with getFormWithAnswer. Also, on the save answer, maybe before storing anything as json value, we could at least validate it has the correct form?
28. planMode: we want prisma to be the source of truth, can't we change the formType so we make the schema derive from prisma? `formType  String`
29. planMode: @full_stack/prisma/migrations/20251213112720_add_form_type_enum/migration.sql for now I dont have any data. so i will run this migration. then i will add data. what happen if i rerun the migrations?
30. planMode: Never use style, use some tailwind stuff or some mantine components or css thing. look on the internet if you have to
31. planMode: the form card should be a component. Also we want something nicer to the user than 'progress'. for instance if the user has done nothing, add a let's start message, then if progress is superior than 0, add another message, and so on until they have almost finished, and you tell them almost finished!
32. planMode: we want a separator between the stepper and the content. Also we want the current Form component to be renames FormStepper. Last but not least, the title and the exit and save button should be fixed so we see them even when we scroll
33. planMode: since we have tailwind installed, couldnt we use its classes for z-index? we would just need to import the globals.css somewhere if I'm not mistaken
34. planMode: scrollbar should be on both sidebar component and on the main form content so that we always see the sidebar when we scroll the content
35. planMode: why do i need 2 containers box and container? ```@FormPageClient.tsx (43-44)
36. planMode: cant we use error cause for the variating stuff? ```@page.tsx (22-24)
37. planMode: the number input shouldnt allow negative values. also by default all inputs are required. Finally, I noticed the `enumValues` hasn't been correctly parsed ```@questions.json (215-218)  it should be `["Head-count", "Full-time equivalent"]`, not a single string
38. planMode: on the form content, add the current title so the user understand well they have change section
39. planMode: Now, we dont want the user to be able to move forward in the stepper if they have not completed the current section. Also, the section can be saved only if all the required inputs have correct values. if the user clicks on exit and save, the current state of the section will be saved, but the section will not be marked ad completed. does this make sens on a ux point of view? do you see some problems?
40. planMode: Could this be handled using useFormState? or such a library? https://react-hook-form.com/get-started (the AI was making a mess, and I dont know this library well enough to feel confident to use it, so in the end I turned back and chose to make it manually)
41. agentMode: each time we save the section, we want to save the id of the section as well under the form model
42. agentMode: maybe we could make a batch saveAnswers? Or at least put this inside a promise.all?
43. agentMode: ok, I just realized i could replace completedRootQuestionsIds with an entry of question_answers when the user submits the section. reverse the change, and create an entry of question_answers also for the root question when the user finishes the section
44. agentMode: Modal and button should be in a single component @FormCard
45. agentMode: when the user finishes the form, so when it clicks on the save button of the last section, we want to make appear confetti using the library `https://party.js.org/ and congratulate them. then we redirect them to the list of forms page
46. askMode: When i go back on a completed form, I see the form content empty. why is that?
