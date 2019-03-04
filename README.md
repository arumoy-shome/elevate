# Elevate: Improving the Cognitive Assessment of Individuals with Down Syndrome

Elevate is the result of 8 months of intensive work that was put
together by my final year design team as part of our capstone design
project. This repository contains the code for our final designed
solution. A brief introduction to the problem spaces follows. Please
consult the [report](docs/report.pdf) for more details.

## Team members
- Arumoy Shome: Lead Developer
- Maathusan Rajendram: Product Manager
- Mira Sleiman: Lead Designer

## Situation of Concern
Down syndrome is a chromosomal disorder that impacts 1 in 700 births in the US
alone. It is the most common chromosomal cause of mild to moderate intellectual
disability. Currently, the modern form of assessment of cognitive abilities is
through pen and paper (i.e. a Cognitive Test Battery). However, this current
state of the art is very costly where the cost of a typical assessment can range
anywhere from $300-$4400 for initial assessments to a full diagnostics
assessment. Furthermore, an average assessment can take approximately 90 minutes
per day which can range from 1 to 5 days depending on the scale of it. This
makes the assessment process very time consuming. Last and most importantly,
cognitive tasks are typically viewed as effortful, frustrating, and repetitive,
which often leads to participant disengagement. This, in turn, can negatively
impact data quality and/or reduce intervention effects. Due to the three main
aforementioned downfalls of the current assessment process, an improved form of
assessment is proposed.

![System Diagram](assets/images/system-diagram.png)

## Why Does This Matter?
From the user interviews conducted with the secondary users (parents of children
with Down syndrome), it was found that individuals with Down syndrome typically
only get assessed 1-2 times in their lifetime. This depicts the lack of
effectiveness of the current assessment tools. Therefore, by reducing the cost
and time taken per assessment, there is less of a barrier for taking the tests
more frequently thus, providing the parents and guardians with more feedback on
the progress of the development of their child.

![Functional Diagram](assets/images/functional-diagram.png)

## Designed Solution
A game-based assessment tool to determine the level of cognitive impairment of
users was developed as the final design solution. The assessment tool was built
using native web technologies. Phaser, a game engine was used to utilize the
native web APIs through a single, uniform interface. The Mini Mental State Exam
(MMSE) was used as a reference whilst developing the games. Three games were
developed, each representing a test from three different categories of MMSE
namely Registration, Attention and Calculation and Recall. Modifications were
made to the games in order to define custom win and lose states based on the
requirements dictated by the corresponding MMSE test. The scoring logic for each
game was modified based on the MMSE scoring technique. Code was added to
transmit metrics from game such as time taken to complete level, score, all
answers (right and wrong) and total wrong answers (ie. repetitions until right
answer was selected) which can be later used for analysis. Finally, the 3 games
were combined into one such that they are played in a specific sequence,
mimicking the way in which a MMSE evaluation would be carried out.

![Prototype](assets/images/prototype.png)
