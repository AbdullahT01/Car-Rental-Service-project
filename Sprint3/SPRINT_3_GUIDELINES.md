# Guideline for Sprint 3

## General Instructions

- **FOR ANY DOCUMENTATION YOU DO PLEASE MAKE SURE YOU FOLLOW THE** [**GRADING RUBRIC**](https://docs.google.com/spreadsheets/d/12pjL-bna0Wqya5WlANlhD4Ue2y_76fau/edit?usp=sharing&ouid=102331275983158874804&rtpof=true&sd=true) (we will get full marks if we follow the rubric)
- Read the sprint 3 guideline and the grading rubric under Resources
- Write the details of **any contribution you make** (including writing documentaiton) under the [contributions log](https://docs.google.com/spreadsheets/d/1piOysk2atrOJjWnT5ce0hVNqwC5g2VibtAf8OVfwi5M/edit?usp=sharing)
- On the next lab we will document the meeting and update the [meeting minutes](https://docs.google.com/document/d/13bBL7PdWNfxxdOjOM68RB668ivuZR5FK_qowfE_2etM/edit?usp=sharing)
- If a row in the grading rubric is **FULLY** completed, highlight it in green

## User Stories

- Find a branch
- Check-in Process
- Check-out Process

## Resources for Sprint 3

- [Guideline](https://docs.google.com/document/d/1oZ_xcP-01Oo2b9DV5nhQY3sK41awoPA42kkTXXYok8s/edit?usp=sharing)
- [Grading Rubric](https://docs.google.com/spreadsheets/d/12pjL-bna0Wqya5WlANlhD4Ue2y_76fau/edit?usp=sharing&ouid=102331275983158874804&rtpof=true&sd=true)
- [Rental Agreement Template](https://docs.google.com/document/d/1PMNlsDIu_2gftjfFgzkdIgylvZNlabiYR9BGQwtqSt0/edit?usp=sharing)
- [Contribution Log](https://docs.google.com/spreadsheets/d/1piOysk2atrOJjWnT5ce0hVNqwC5g2VibtAf8OVfwi5M/edit?usp=sharing)
- [Meeting Minutes](https://docs.google.com/document/d/13bBL7PdWNfxxdOjOM68RB668ivuZR5FK_qowfE_2etM/edit?usp=sharing)

## TO DO:

### Michael

- Create the UML diagram for architecture design: **sequence diagrams**. Refer to the [guideline](https://docs.google.com/document/d/1oZ_xcP-01Oo2b9DV5nhQY3sK41awoPA42kkTXXYok8s/edit?usp=sharing) and the [grading rubric](https://docs.google.com/spreadsheets/d/12pjL-bna0Wqya5WlANlhD4Ue2y_76fau/edit?usp=sharing&ouid=102331275983158874804&rtpof=true&sd=true). All user stories are classified and labeled on github. This task is worth 7.5%.
- Create TWO acceptance tests for EACH user story, and label them accordingly. Refer to the guideline for all new acceptance tests, and github issues for the format of each acceptance test. All acceptance tests are classified and labeled on github. Please do them right, they are very easy and are worth 15% of Sprint 3.
- Create a Sprint 4 planning document. Refer to [the one from Sprint 2](https://docs.google.com/document/d/1vzTw6m5bVeHHyZZye_Ft7pBxhMALCxpajKfMwUqppTg/edit?usp=sharing) as a template.

### Jay

- Create the UML diagram for achitecture design: **activity diagrams**. Refer to the [guideline](https://docs.google.com/document/d/1oZ_xcP-01Oo2b9DV5nhQY3sK41awoPA42kkTXXYok8s/edit?usp=sharing) and the [grading rubric](https://docs.google.com/spreadsheets/d/12pjL-bna0Wqya5WlANlhD4Ue2y_76fau/edit?usp=sharing&ouid=102331275983158874804&rtpof=true&sd=true). All user stories are classified and labeled on github. This task is worth 7.5%.
- Figure out the integration pipeline and the unit tests. Don't spend too much time on this since it's only worth 2.5% of Sprint 3. I feel like if you get the stuff from Sprint 2 working we will get full marks on this.
- Abdullah and I will probably need help implementing some features. I gave most of the documentation to Mike, if you can just go over it with him to make sure all is right (Sprint 4 planning and acceptance tests). Aftet that we will do our best to give you some of the coding tasks.

### Franco

- Connect to the Google maps API for finding the nearest location <ins>DONE</ins>
  - Input will be the user's address
  - Output will be the nearest branch
- Create a post request to use the Google maps function <ins>NEEDS TESTING</ins>
- Implement pricing algorithm for when the user is actively making a reservation (POST_reservationFunction)
- Implement checks that won't allow:
  - Duplicate users <ins>DONE</ins>
  - Reserving a car that's already in use
  - Deleting a car that's currently in a resrevation
  - Deleting a user that has an active reservation
- Writing the check-in function <ins>NEEDS TESTING</ins>
- Writing the check-out function

### Abdullah

- Creating the Customer service interface
  - In place reservation (if the customer didn't reserve on their phone)
  - Checking in the customer
  - Checking out the customer
- Creating the Find a branch UI
