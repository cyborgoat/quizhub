---
id: computer-networks-routing-and-applications
title: Routing and Internet Applications
tags: [routing, dns, tls, http]
linkedQuizQuestions:
  - quizId: computer-networks-routing-and-applications
    questionId: computer-networks-routing-table
  - quizId: computer-networks-routing-and-applications
    questionId: computer-networks-routing-metrics
  - quizId: computer-networks-routing-and-applications
    questionId: computer-networks-tls-certificate
  - quizId: computer-networks-routing-and-applications
    questionId: computer-networks-cdn
  - quizId: computer-networks-routing-and-applications
    questionId: computer-networks-http3-head-of-line
createdAt: 2026-11-26T00:00:00Z
updatedAt: 2026-11-26T00:00:00Z
---

## Forwarding is a per-hop decision

Routers compare a destination address with routing-table prefixes and select an applicable next hop. The longest matching prefix is the most specific route; route metrics and policy can further influence selection. A route describes where to forward traffic, not whether the destination application is healthy.

Internet applications combine several layers. DNS resolves names to records, TLS protects a connection and helps authenticate a server, and HTTP defines request/response semantics. A CDN places content closer to users, but caching behavior and invalidation still affect freshness.

## Diagnose the layer that failed

Separate name resolution, routing, transport, encryption, and application errors. HTTP/3 uses QUIC over UDP and can avoid some TCP-level head-of-line effects between streams, but network conditions and application behavior still matter. Look at evidence from each layer rather than treating every timeout as a routing fault.
