---
id: machine-learning-practice
title: Reliable Machine Learning in Production
tags: [machine-learning, deployment, model-monitoring]
linkedQuizQuestions:
  - quizId: machine-learning-practice
    questionId: machine-learning-data-schema
  - quizId: machine-learning-practice
    questionId: machine-learning-concept-drift
  - quizId: machine-learning-practice
    questionId: machine-learning-online-inference
  - quizId: machine-learning-practice
    questionId: machine-learning-fairness-metric
  - quizId: machine-learning-practice
    questionId: machine-learning-model-card
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Treat the data contract as part of the model

Production predictions depend on schemas, preprocessing, feature availability, and serving behavior as well as learned parameters. Validate input types, ranges, missing values, and version compatibility. Training-serving skew occurs when production transformations differ from those used during training.

Concept drift is a change in the relationship between inputs and outcomes; changes in input distribution alone do not always imply it. Monitor data and task-level performance where labels become available, and define retraining and rollback criteria. Online inference also requires latency, capacity, and failure handling.

## Document impact and limitations

Fairness metrics capture different properties and may conflict, so choose measures based on the context and affected groups. A model card or similar record can describe intended use, evaluation, limitations, and monitoring. Documentation supports accountability but does not replace ongoing review.
