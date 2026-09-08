

# 微服务

## 说说微服务

- 微服务是一种软件架构风格，用于构建复杂的应用程序。它将一个大的应用拆分多个小的独立服务，可以独立部署运行。每个服务之间用轻量级的通信机制进行调用。

## 什么是Restful风格

- [https://www.ruanyifeng.com/blog/2014/05/restful_api.html](https://www.ruanyifeng.com/blog/2014/05/restful_api.html)
- Restful是一套理念
- 协议：与用户通信的时候总是使用HTTPS协议
- 域名：尽量将API部署在专用域名之下
- 版本：应该将版本放在URL中
- 路径：路径又表示终点，要求每个网址代表一种资源，所以只能是名词，不能是动词。
- HTTP动词：
    - GET（SELECT）：从服务器取出资源（一项或多项）。
    - POST（CREATE）：在服务器新建一个资源。
    - PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
    - PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
    - DELETE（DELETE）：从服务器删除资源。

## HTTP和RPC有什么区别

- 传输协议：
    - RPC，可以基于TCP协议，也可以基于HTTP协议。
    - HTTP，基于HTTP协议。
- 传输效率
    - RPC，可以使用自定义的TCP协议，可以让请求报文体积更小，或者使用HTTP2协议，也可以很好的减少报文的体积，提高传输效率。
    - HTTP，如果是基于HTTP1.1的协议，请求中会包含很多无用的内容，如果是基于HTTP2.0，那么简单的封装一下是可以作为一个RPC来使用的，这时标准RPC框架更多的是服务治理。
- 性能消耗
    - RPC，可以基于thrift实现高效的二进制传输。
    - HTTP，大部分是通过json来实现的，字节大小和序列化耗时都比thrift要更消耗性能。
- 负载均衡
    - RPC，基本都自带了负载均衡策略。
    - HTTP，需要配置Nginx，HAProxy来实现。
- 服务治理
    - RPC，能做到自动通知，不影响上游。
    - HTTP，需要事先通知，修改Nginx/HAProxy配置。

## SOA和微服务之间的主要区别是什么？

- SOA(面向服务的体系架构)主要关注的是服务重用，微服务在关注服务重用的同事，也关注快速交付。
- 微服务不再强调SOA里的ESB企业服务总线，采用的是服务间轻通信，比SOA拆分得更彻底。
- 文字推荐：微服务(Microservice)那点事

# SpringCloud

## 说说SpringCloud的理解

- Spring Cloud 是一套分布式微服务的技术解决方案
    - 它提供了快速构建分布式系统的常用的一些组件比如说配置管理、服务的注册与发现、服务调用的负载均衡、资源隔离、熔断降级等等
    - 不过 Spring Cloud 只是 Spring 官方提供的一套微服务标准定义
    - 而真正的实现目前有两套体系用的比较多，一个是 Spring Cloud Netflix，一个是 Spring Cloud Alibaba
    - Spring Cloud Netflix 是基于 Netflix 这个公司的开源组件集成的一套微服务解决方案，其中的组件有：
        - Ribbon——负载均衡
        - Hystrix——熔断降级
        - Zuul——网关
        - Eureka——服务注册与发现
        - Feign——服务调用
    - Spring Cloud Alibaba 是基于阿里巴巴开源组件集成的一套微服务解决方案，其中包括：
        - Dubbo——消息通讯
        - Nacos——服务注册与发现
        - Seata——事务隔离
        - Sentinel——熔断降级
        - gateway 网关
    - 有了 Spring Cloud 这样的技术生态，使得我们在落地微服务架构时，不用去考虑第三方技术集成带来额外成本，只要通过配置组件来完成架构下的技术问题。


## 搭建一个springcloud架构，你会怎么搞，用哪些组件

- 首先需要服务注册与发现
	- 可以使用zk，nacos，eureka等组件
- 如果是http调用的话，那么需要服务调用
	- 我们可以使用OpenFeign组件
- 网关的话
	- 我们可以使用zuul，或者gateway
- 客户端负载均衡的话
	- 可以使用ribbon
- 熔断机制组件
	- sentinel，hystrix


## 服务端负载均衡与客户端负载均衡的区别？

- 客户端负载均衡，需要获取服务的在线列表，然后根据负载均衡算法，选择出某个地址，直接请求
- 服务端负载均衡，直接调用服务端，服务端有个中间层，比如nginx等，这个中间层根据负载均衡算法，指定到后台真实地址。
- 主要区别：负载均衡无需负载均衡服务器这个中间层