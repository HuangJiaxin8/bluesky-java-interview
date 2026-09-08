---
title: 简化版：CopletionService 使用不当oom
date: 2026-09-08
category: 线上问题排查
tags:
  - 线上问题
  - 面试
---

## 在线程池 ExecutorCompletionService 提交了没有返回值任务，导致oom

- 后来排查发现是因为没有返回值，所以同事没用正确的写法
- 正确的写法应该是：向线程池提交任务后，要调用service.take().get()
- 因为CompletionService 内部维护了一个 LinkedBlockingQueue，任务执行完成就会放到这个队列里，也就是说take()出来的都是已经完成的任务。如果没有调用take()，那么任务将会一直堆积在队列里面，久而久之，就会oom

