---
id: computer-systems-operating-systems
title: Operating Systems and Concurrency
tags: [operating-systems, concurrency, processes]
linkedQuizQuestions:
  - quizId: computer-systems-operating-systems
    questionId: computer-systems-process
  - quizId: computer-systems-operating-systems
    questionId: computer-systems-user-kernel-mode
  - quizId: computer-systems-operating-systems
    questionId: computer-systems-deadlock-necessary
  - quizId: computer-systems-operating-systems
    questionId: computer-systems-priority-inversion
  - quizId: computer-systems-operating-systems
    questionId: computer-systems-signal-handler
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Processes, protection, and shared state

An operating system manages processes, memory, devices, and access to privileged operations. User mode restricts direct access to hardware and protected state; a controlled transition to kernel mode allows the OS to perform such work. A process provides an execution and resource boundary, while threads within a process may share memory.

Concurrency introduces ordering concerns. A race occurs when results depend on timing between operations on shared state. Deadlock requires a set of conditions such as mutual exclusion, hold-and-wait, no preemption, and circular wait; breaking a condition can prevent it. Priority inversion occurs when a high-priority task is delayed by lower-priority work holding a needed resource.

## Use synchronization deliberately

Choose locks, queues, or other coordination based on the invariant being protected. Keep critical sections small and review signal or interrupt handlers for operations that are safe in that context. Reproduce timing-sensitive problems with logging and tests rather than relying on a single successful run.
