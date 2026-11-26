---
id: ai-gradient-descent
title: 梯度下降
tags: [machine-learning, optimization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: gradient-descent-step
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## 核心概念

梯度下降通过反复沿梯度的反方向更新参数，来最小化损失 $L(\theta)$。

$$\theta \leftarrow \theta - \eta \nabla_\theta L(\theta)$$

学习率 $\eta$ 决定更新的步长。

## 要点

- $\eta$ 太大可能会越过最小值，甚至导致发散。$\eta$ 太小则会让收敛变慢。
- **随机梯度下降**和**小批量梯度下降**用部分训练数据估算梯度，提高计算速度，但也会引入噪声。
- 动量法和 Adam 等优化器会根据过去的梯度调整更新步长。
