---
id: computer-networks-fundamentals
title: Packets, Addresses, and Transport
tags: [computer-networks, tcp-ip, packet-switching]
linkedQuizQuestions:
  - quizId: computer-networks-fundamentals
    questionId: computer-networks-packet-switching
  - quizId: computer-networks-fundamentals
    questionId: computer-networks-default-gateway
  - quizId: computer-networks-fundamentals
    questionId: computer-networks-tcp-properties
  - quizId: computer-networks-fundamentals
    questionId: computer-networks-mtu
  - quizId: computer-networks-fundamentals
    questionId: computer-networks-loopback
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## From packets to paths

Packet switching lets network links be shared by sending data in discrete units. Addresses identify endpoints at a network layer, while routers forward packets according to routing information. A host sends traffic for off-subnet destinations to a default gateway; loopback addresses refer back to the local machine.

The maximum transmission unit (MTU) constrains the packet size a link can carry without fragmentation or other handling. Path MTU issues can cause connections to stall even when basic reachability works.

## Transport has different guarantees

TCP provides an ordered byte stream and retransmission behavior, while UDP exposes datagrams without the same built-in delivery and ordering guarantees. Applications choose a transport based on their needs. A successful transport connection does not prove that the application processed a request correctly.
