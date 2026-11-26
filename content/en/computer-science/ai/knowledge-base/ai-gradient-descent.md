---
id: ai-gradient-descent
title: Gradient Descent
tags: [machine-learning, optimization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: gradient-descent-step
createdAt: 2026-11-14T00:00:00Z
updatedAt: 2026-11-14T00:00:00Z
---

## Key idea

Gradient descent minimizes a loss $L(\theta)$ by repeatedly stepping *against* its gradient:

$$\theta \leftarrow \theta - \eta \nabla_\theta L(\theta)$$

The learning rate $\eta$ sets the step size.

## Things to remember

- Too large an $\eta$ overshoots or diverges; too small converges slowly.
- **Stochastic** and **mini-batch** variants estimate the gradient from a subset of data, trading noise for speed.
- Momentum and Adam-style optimizers adapt the step using past gradients.
