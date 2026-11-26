---
id: machine-learning-supervised-learning
title: "Supervised Learning: Models and Evaluation"
tags: [machine-learning, supervised-learning, evaluation]
linkedQuizQuestions:
  - quizId: machine-learning-supervised-learning
    questionId: machine-learning-target-variable
  - quizId: machine-learning-supervised-learning
    questionId: machine-learning-tree-split
  - quizId: machine-learning-supervised-learning
    questionId: machine-learning-mae-units
  - quizId: machine-learning-supervised-learning
    questionId: machine-learning-multicollinearity
  - quizId: machine-learning-supervised-learning
    questionId: machine-learning-threshold-selection
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Learn from labeled examples

Supervised learning uses examples with inputs and target values. Classification predicts categories; regression predicts numerical outcomes. Linear models, decision trees, nearest neighbors, and support vector machines make different assumptions about structure and similarity. Feature scaling matters for some methods, especially those based on distances or gradient optimization.

Evaluation must match the task and decision. Mean absolute error is expressed in the target's units, while classification measures such as precision and recall depend on a chosen threshold. ROC AUC summarizes ranking across thresholds and does not specify a single operating point.

## Build a trustworthy comparison

Separate training, validation, and test roles. Use validation data for model and threshold selection, then reserve the test set for final evaluation. Check leakage, class imbalance, calibration, and subgroup performance. Multicollinearity can make coefficient interpretation unstable without necessarily making every prediction unusable.
