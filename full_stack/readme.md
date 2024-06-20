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
|- topic (e.g. environment)
|  |- sub-topic (e.g. air pollution)
|  |  |- question (e.g. «how much CO2 did you emit?»)
|  |  |- question
|  |  |  |- question
|  |  |  |  |- question (questions can be arbitrarily nested)
|  |  |  |- question
```

## Tasks
### Data model
The taxonomy is given in a CSV file `taxonomy.csv`.
The first column indicates the level of nesting.

For example, the above tree looks like this:
```
level;label
0;root
1;topic
2;sub-topic
3;question
3;question
4;question
5;question
4;question
```

Write an algorithm to assemble the taxonomy in a tree structure.

### App
Write a web app where people can answer questions from the taxonomy.

They can chose a topic and sub-topic and then, they are presented with the questions and answer them in a form.

You are free to chose whichever technology you want.
