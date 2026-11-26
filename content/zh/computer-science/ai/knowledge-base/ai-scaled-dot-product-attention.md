---
id: ai-scaled-dot-product-attention
title: 缩放点积注意力
tags: [transformers, attention]
linkedQuizQuestions:
  - quizId: ai-transformers
    questionId: scaling-factor
  - quizId: ai-transformers
    questionId: causal-mask
  - quizId: ai-transformers
    questionId: positional-encoding
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## 核心概念

每个词元都会生成查询向量、键向量和值向量。对查询向量与键向量的相似度分数应用 softmax 得到注意力权重，再对值向量加权求和，得到输出。

$$\text{Attention}(Q,K,V)=\text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$

## 要点

- 除以 $\sqrt{d_k}$ 可以防止过大的点积使 softmax 饱和。
- **因果掩码**把未来位置的分数设为 $-\infty$，让解码器无法关注后面的词元。
- 注意力机制本身不包含顺序信息，因此需要在输入中加入位置信息。
