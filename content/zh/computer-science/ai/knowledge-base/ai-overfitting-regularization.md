---
id: ai-overfitting-regularization
title: 过拟合与正则化
tags: [machine-learning, generalization]
linkedQuizQuestions:
  - quizId: ai-ml-basics
    questionId: regularization-techniques
  - quizId: ai-ml-basics
    questionId: bias-variance
  - quizId: ai-ml-basics
    questionId: test-set-tuning
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## 核心概念

模型把训练数据中的噪声也学进去了，在新数据上的表现较差，这就是**过拟合**。典型迹象是训练误差很低，而验证误差高得多。

## 应对方法

| 方法 | 作用 |
|---|---|
| L2 权重衰减 | 惩罚过大的权重 |
| Dropout（随机失活） | 在训练时随机停用部分单元 |
| 提前停止 | 验证损失不再改善时停止训练 |
| 增加数据或进行数据增强 | 让模型更难靠记住训练样本完成任务 |

## 评估方法

用验证集调参，并且只在最后用测试集评估一次。反复查看测试结果会让最终报告的分数偏高。
