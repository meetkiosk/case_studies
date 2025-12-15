# Kiosk – Lead Developer Case Study

Welcome, and thank you for your interest in Kiosk 👋  

This exercise is a **technical case study for a Lead Developer** position.  
It is inspired by a real feature of our ESG/CSRD reporting product.

We are **not** looking for a “finished product at all costs”.  
We explicitly **prioritise quality over quantity**:
- clear architecture and trade-offs
- readable, maintainable code
- sensible UX
- ability to explain your decisions

It is **absolutely fine if you don’t implement everything**.  
If you run out of time, please document what you would do next.


## 1. Goal of the exercise

We want to simulate a small slice of the Kiosk product:

Given a DSN file containing multiple employee-level fields, determine which DSN fields can answer which internal questions, possibly through aggregation or transformation.
Upload the DSN, map DSN fields to internal datapoints, visualise the resulting answers, and export the result as a Word document.

Concretely, you’ll work on:

1. **DSN upload**
   - Upload a DSN file (we provide a sample CSV file in `./dsn.txt`).
   - Parse it on the server side.

2. **Mapping DSN → internal datapoints**
   - We provide a sample list of Kiosk datapoints for sections **S1–S6** in `./questions.csv`.
   - Your task is to decide which data from the DSN can answer which question.
   - Some answers come directly from the DSN; others require:
        - aggregating multiple rows (e.g. counts, sums, averages)
        - transforming data (e.g. codes, units)

3. **Visualisation of questions & answers**
    - Based on the mapping, compute the answers and display:
        - a list of questions
        - the resulting values (raw or aggregated)
   - The goal is to demonstrate how you organise and display the information, not to be 100% “business correct”.
   - We expect a single page that display :
        - nested questions (arbitrary depth),
        - table-like structures (groups of related questions).

4. **Export to Word**
   - Provide an action to **export the resulting questions/answers to a Word document** (`.docx`).
   - Basic layout is enough (title + list of questions and their values).

Again: it is totally OK to **only partially implement some of these points**.  
If you need to simplify the domain to focus on code quality or architecture, please do so and explain your choices.


## 2. Tech stack & constraints

For information, our production stack is:

- **Node.js**
- **Remix**
- **TypeScript**
- **Mantine UI**
- **Prisma + PostgreSQL**

For this case study, please use:
- **React**
- **TypeScript**

You are free to use any libraries, tooling, framework etc you prefer<br/>
We intentionally keep the constraints minimal so you can choose the architecture and tools that make the most sense to you.


## 3. Deliverables

Please send us:
1.	A link to your repository (GitHub, GitLab, etc.)
2.	This README filled in with:
    - 	how to run the project
    -	if you used AI, how you used it
    -  	what you would improve next

## 4. What is DSN ? 

The DSN (Déclaration Sociale Nominative) is a standardized digital declaration required by French authorities. Companies use it to regularly submit social data about their employees, such as payroll details, headcount, and other employment-related information.

The DSN file format consists of text-based blocks identified by codes (e.g., S10.G00.00.001,'value'). These blocks contain structured data categorized by specific identifiers (rubriqueCode and codeBloc). The parsing order is crucial since each block depends on previously parsed blocks, building relationships from general entities (e.g., the company or Entreprise) down to specific ones (e.g., an establishment or Établissement).

### Resources

- [Official DSN Technical Documentation (Net-Entreprises.fr)](https://www.net-entreprises.fr/media/documentation/dsn-cahier-technique-2024.1.pdf)
- [La Société Nouvelle DSN Parser Implementation (GitHub)](https://github.com/La-Societe-Nouvelle/LaSocieteNouvelle-METRIZ-WebApp/blob/5429f13e940e11bf6658d04993008f24026a1e26/src/components/sections/statements/modals/AssessmentDSN/DSNReader.js)


## 5. Structure of questions.csv

The file questions.csv contains the sample list of datapoints.

Here is the columns:
- id
- question label en / question label fr
- content
    - defines the expected input type for this question.
    - possible values : 
        - "number" → numeric value
	    - "text" → free-text input
	    - "enum" → selectable value from a list
	    - "table" → multi-row / multi-field structure (you may simplify this for the exercise)
	    - "" (empty) → this question does not expect a content, it is usually the title of another question
- related question id 
    - if present, this question is logically linked to another question.
	- typical use cases: 
        - table rows
        - hierarchical visibility.
- order
    - suggested position of the question within its group.
- unit
	- indicates a measurement unit (e.g. %, €, hours).
- enum fr / enum en
	- Applies only when content = "enum".
	- Contain semicolon-separated lists of possible values in French or English.


### Example : 

| id   | question label en         | content | related question id  |
|------|---------------------------|---------|----------------------|
| Q100 | Employee details          | table   |                      |
| Q101 | Employee birth year       | number  | Q100                 |

Here:
- Q100 defines a table.
- Q101 is a row of that table because they reference Q100.

Example of how it could be rendered : 

| Employee details   | Value      | 
|--------------------|------------|
| Employee details   |            |        

## Questions about this case study

If anything is unclear, feel free to email `sabine@meetkiosk.com` or `mathys@meetkiosk.com`.



