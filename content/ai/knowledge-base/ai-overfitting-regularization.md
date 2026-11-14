---
id: ai-overfitting-regularization
title: Overfitting and Regularization
tags: [machine-learning, generalization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: regularization-techniques
  - quizId: ai-ml-basics
    questionId: bias-variance
  - quizId: ai-ml-basics
    questionId: test-set-tuning
createdAt: 2026-11-14T00:00:00Z
updatedAt: 2026-11-14T00:00:00Z
---

## Key idea

A model **overfits** when it fits noise in the training data and generalizes poorly. The tell-tale sign is low training error with much higher validation error.

## Remedies

| Technique | How it helps |
|---|---|
| L2 weight decay | Penalizes large weights |
| Dropout | Randomly disables units during training |
| Early stopping | Halts when validation loss stops improving |
| More data / augmentation | Makes memorization harder |

## Evaluation hygiene

Tune on a validation set and report once on the test set. Repeated peeking at the test set makes the final number optimistic.
