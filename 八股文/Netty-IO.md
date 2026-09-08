
## Java的IO流的分类

- 按照流的方向：输入流（inputStream）和输出流（outputStream）；
- 按照处理数据的单位：字节流和字符流。分别由四个抽象类来表示（每种流包括输入和输出两种所以一共四个）:InputStream，OutputStream，Reader，Writer。

## 字节流和字符流有什么区别

- 字节流读写都是字节的形式来读写，而字符流就是字符的形式来读写
- 读写文件，不关心内容的话使用字节流。需要对文件内容做操作就用字符流。

## BIO,NIO,AIO的区别

- BIO:同步阻塞，一个连接一个线程，连接少的情况下可以使用。
- NIO:异步阻塞，利用了多路复用器，每个连接都会注册到多路复用器上，多路复用器会轮询，当有连接请求过来的时候，就开一个线程去处理。
- AIO:异步非阻塞，一个有效连接一个线程。

## Java IO 用到哪些设计模式

- 设配器模式
    - Reader reader = new InputStreamReader(inputStream);
    - 字节流通过设配器模式转化为字符流
- 装配器模式：
    - 一种动态的往类中添加新行为的设计模式。
    - new BufferedInputStream(new FileInputStream(inputStream));

## IO多路复用

- IO多路复用指的是单个线程能够同时完成多个IO事件的监听处理。
- Linux提供了select、poll和epoll三种多路复用方式。本质上是利用内核缓存文件描述符fd，并在内核完成对文件描述符的监听操作。
- select是将所用文件描述符的集合从用户态拷贝到内核空间，底层采用的是数组。
- poll和select相似，主要区别是poll底层使用的是链表，所以其能够监听的文件描述符不受限制。但是这两种方法都需要多次的内核与用户空间的复制拷贝，并且用户空间还需要再O(N)的时间复杂度下对描述符进行遍历才具体知道哪个文件描述符发生了事件。
- epoll在内核开辟空间，底层采用的是红黑树，用户可以直接在内核创建需要关注的文件描述的节点，当事件发生，内核将对应文件描述符直接存入队列并将其返回到用户空间。epoll这种方式可以减少每次调用时从用户空间复制到内核的操作，并且因为内核返回的发送事件描述符的队列，可以减少每次轮询的操作，使用O(1)的时间复杂度就能找到发送事件的描述符。


## IO 多路复用

- IO多路复用指的是单个线程能够同时完成多个IO事件的监听处理。
- Linux提供了select、poll和epoll三种多路复用方式。


## IO多路复用机制的优点

- 由于一个线程可以处理多个文件句柄，其他线程可以空出来干其他事情
- 所以
	- 可以提高并发能力
	- 提高系统资源利用率


## select/poll/epoll

- select
    - select 管理多个 socket，我们调用select时，select会把所有要给管理的socket fd 传到内核中，然后遍历所有socket，看看有没有感兴趣的事件发生，没有的话就select线程就要让出cpu时间片。
    - 当网卡接收到数据塞到socket的接收队列时，socket就会去它的睡眠队列里遍历entry，调用entry的callback方法，唤醒select。
    - 缺点：
        - 每次都要遍历所有的socket
        - select 管理的 socket fd 需要从用户空间拷贝到内核空间，所以为了控制拷贝的大小而，每个 select 能拷贝的 fds 集合大小只有1024
- poll
    - 主要在select的基础上优化了fds结构，不会受到1024的限制
- epoll
    - epoll会在内核中维护socket集合，这样就不用像select那样，每次都要拷贝所挂你的socket fd 集合到内核（socket 集合是用红黑树实现的）。
    - 所有接收到网卡数据的socket都会被存到到一个ready_list 双向链表，这样epoll就不用像select那样去遍历所有socket集合。


## select/poll/epoll 简单版本

- select 传统的，性能差，支持文件句柄数量有限，只有1024
- poll select的优化版本，支持更多的文件句柄
- epoll 目前效率最高的IO多路复用机制
