# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

** User Table **
| Column Name | Type | Description |
|-------------|------|-------------|
| userID | integer | primary key |
| username | text | unique user alias |
| password | text | login credential to access  |
| timeCreated | timestamp | how long the user has been with the app |

** Habits Table **
| Column Name | Type | Description |
|-------------|------|-------------|
| userID | integer | primary key |
| habitName | text | habit to be tracked |
| frequency | integer | how frequent the user wants to do this habit |
| duration | integer | how long the user wants to spend doing this habit   |
| status | text | if the user has already created habit into a habit |

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the shoe model |
| ... | ... | ... |
