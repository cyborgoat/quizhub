---
id: software-engineering-testing-and-quality
title: Testing and Code Quality
tags: [software-engineering, testing, code-quality]
linkedQuizQuestions:
  - quizId: software-engineering-testing-and-quality
    questionId: software-engineering-unit-test
  - quizId: software-engineering-testing-and-quality
    questionId: software-engineering-test-double
  - quizId: software-engineering-testing-and-quality
    questionId: software-engineering-test-coverage
  - quizId: software-engineering-testing-and-quality
    questionId: software-engineering-flaky-test
  - quizId: software-engineering-testing-and-quality
    questionId: software-engineering-refactoring
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Tests provide different kinds of evidence

Unit tests check focused behavior, often with dependencies controlled or replaced by test doubles. Integration and end-to-end tests exercise broader interactions but may be slower and more environment-sensitive. A balanced suite gives fast feedback while checking important system boundaries.

Coverage indicates which code ran during tests; it does not show whether assertions detect meaningful defects. Flaky tests produce inconsistent results without relevant code changes and weaken trust in the suite. Investigate timing, shared state, network dependencies, and nondeterminism instead of repeatedly rerunning without diagnosis.

## Refactor under protection

Refactoring changes internal structure while preserving externally observable behavior. Small steps and relevant tests reduce risk, but review is still needed for behavior not captured by tests. Use test results, static analysis, and code review as complementary quality signals.
