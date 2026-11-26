---
id: computer-systems-architecture
title: Computer Architecture Essentials
tags: [computer-architecture, memory, performance]
linkedQuizQuestions:
  - quizId: computer-systems-architecture
    questionId: computer-systems-instruction-set
  - quizId: computer-systems-architecture
    questionId: computer-systems-cache-miss
  - quizId: computer-systems-architecture
    questionId: computer-systems-endianness
  - quizId: computer-systems-architecture
    questionId: computer-systems-simd
  - quizId: computer-systems-architecture
    questionId: computer-systems-volatile-ram
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Architecture sets the execution model

An instruction-set architecture (ISA) defines the machine instructions and visible state that software targets. Different processors can implement the same ISA with different internal designs. Data representation also matters: endianness specifies byte order for multi-byte values and is relevant when data crosses system boundaries.

Processors use memory hierarchies because small, fast storage is limited. Caches exploit locality; a cache miss requires fetching data from a slower level and can dominate performance. SIMD instructions apply one operation across multiple data elements when the computation and data layout permit it.

## Measure before optimizing

Volatile RAM loses its contents without power, unlike persistent storage. Performance depends on workload, memory behavior, parallelism, and hardware. Profile representative tasks, account for I/O and cache effects, and avoid assuming that more threads or lower-level code will automatically improve end-to-end performance.
