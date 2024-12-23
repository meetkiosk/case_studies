# Kiosk Full-stack case study
Thanks for applying at Kiosk!

Our second round is a technical case study that’s designed to take you about three hours.

## Guidelines
* favor finished work
* you are free to leverage AI tools
* you don’t have to deal with auth etc
* if you feel something is taking you too much time, it’s fine to stop early and explain how to take the solution further

### What matters
* clarity
* code architecture
* UI snapiness
* simplicity
* practicality of eventual deployment

### What doesn’t matter
* bells and whistles
* actual deployment (dockerfile, whatever)

## Introduction
Kiosk is developing an ESG reporting tool to help companies comply with [CSRD](https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en).

This report is build around a data structure called the «taxonomy».
It is a tree structure that contains nodes of several types:

```
root
|- topic (e.g. ESRS E1: Climate change)
|  |- sub-topic (e.g. E1-3: Actions and resources in relation to climate change
policies)
|  |  |- question 1 (e.g. «GHG emission reduction targets»)
|  |  |- question 2
|  |  |  |- question 2.1
|  |  |  |  |- question 2.1.1 (questions can be arbitrarily nested)
|  |  |  |- question 2.2
```

## Tasks
### Data model
The taxonomy is given in a CSV file `taxonomy.csv`.
We only gave the `questions`, with their topic and subtopic as columns.

For example, the above tree looks like this:
```
level;topic;subtopic;label
1;topic;subtopic;question 1
1;topic;subtopic;question 2
2;topic;subtopic;question 2.1
3;topic;subtopic;question 2.1.1
2;topic;subtopic;question 2.2
```

Write an algorithm to assemble the taxonomy in a tree structure.

### App
Write a web app where people can answer questions from the taxonomy.

They can chose a topic and sub-topic and then, they are presented with the questions and answer them in a form.

You are free to chose whichever technology you want.
As an indication, here is our stack:
- TypeScript
- Express
- React
