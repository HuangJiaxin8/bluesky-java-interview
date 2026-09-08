---
title: 刷一个boss的信息，第一次刷到，得48小时之后才能刷到，用redis怎么实现
date: 2026-09-08
category: 场景题
tags:
  - 场景题
  - 面试

---

用redis的sorted set




每次推送之前，只需要把待推送的推文id的集合 减去 48小时之内记录的所有推文id 即可。（代码逻辑）

可以用sorted set记录所有推文的id，用score 记录时间戳，member记录推文id。
想办法获取最近48小时的推文id，那么可以用命令：
zrangebysocre key 48小时之前的时间戳 当前时间的时间戳 withscores  （redis api能力）



例子：
```
zadd test 1710086400 // 20240311-0点帖子
zadd test 1710172800 // 20240312-0点帖子
zadd test 1710216000 // 20240312-12点帖子
zadd test 1710302400 // 20240313-12点帖子
zadd test 1710345600 // 20240314-0点帖子
zadd test 1710432000 // 20240315-0点帖子

查询20240312-0点到20240314-0点之间的帖子，只需要
zrangebyscore test 1710172800 1710345600 withscores
```




