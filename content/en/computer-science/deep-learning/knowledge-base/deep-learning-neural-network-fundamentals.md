---
id: deep-learning-neural-network-fundamentals
title: Neural Networks and Training Fundamentals
tags: [deep-learning, neural-networks, optimization]
linkedQuizQuestions:
  - quizId: deep-learning-neural-network-fundamentals
    questionId: deep-learning-neuron-output
  - quizId: deep-learning-neural-network-fundamentals
    questionId: deep-learning-computation-graph
  - quizId: deep-learning-neural-network-fundamentals
    questionId: deep-learning-softmax-axis
  - quizId: deep-learning-neural-network-fundamentals
    questionId: deep-learning-residual-learning
  - quizId: deep-learning-neural-network-fundamentals
    questionId: deep-learning-checkpoint
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Learn parameters through a computation graph

A neural network composes parameterized transformations and nonlinearities to map inputs to outputs. Training compares predictions with targets using a loss, then uses backpropagation to compute gradients through the computation graph. An optimizer updates parameters in response to those gradients; the model architecture alone does not determine whether training will succeed.

Softmax converts a vector of scores into normalized values along a chosen dimension. Residual connections add a path that can help information and gradients travel through deeper networks, though they do not eliminate optimization challenges.

## Track the experiment

Check tensor shapes and the intended reduction axis when computing losses or probabilities. Save checkpoints with model state and relevant optimizer or training metadata so a run can be resumed or analyzed. Monitor training and validation behavior to distinguish optimization problems from overfitting.
