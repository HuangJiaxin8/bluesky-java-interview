
# Spring

## Spring的理解（IOC和AOP）

- 首先，spring是个庞大的项目，从官网可以看到包括了：
    
    - SpringFramework
    - SpringData
    - SpringSecurity
    - SpringBoot
    - SpringCloud
    
    当然，除了这些之外，Spring还包括很多其他的项目
    

## Spring最主要的有两个特点是IOC和AOP

- IOC:
    - IOC就是控制反转，指的是创建对象控制权的转移，以前创建对象的时候都是自己控制，现在Spring容器会根据配置文件去帮我们创建和管理对象。
    - 好处：解耦合，对象的属性只需要在配置文件中写，不用在java代码写，把属性与java代码解耦合。
    - 原理：使用反射机制，根据配置文件信息去创建对象。使用了工厂的设计模式。
    - Spring的IOC有三种注入方式 ：构造器注入、setter方法注入、根据注解注入。
- AOP:
    - 把公共的代码提取出来，进行封装。
    - 减少系统代码重复量，降低模块耦合度。
    - 原理：基于动态代理
        - 要代理的对象实现了接口，就用JDK动态代理生成代理类。
        - 没有实现接口，就用cglib，实现子类的方式生成代理类。

## IOC和DI（孙帅）

- IOC 控制反转
    - 控制：对于成员变量赋值的控制权
    - 控制反转：把成员变量赋值的控制权，从代码中反转到Spring工厂和配置文件中完成。
    - 好处：解耦合
    - 底层实现：反射加工厂设计模式
- DI 依赖注入
    - 当一个类需要另一个类时，就意味着依赖，一旦出现了依赖，那么就可以把另一个类作为本类的成员变量，最终通过Spring配置文件注入。

## 代理创建3要素（孙帅）

- 原始对象
- 额外功能
- 代理对象和原始对象实现相同的接口

## JDK动态代理 （孙帅）

- Proxy.newProxyInstance(classloader,interfacce,invocationhandler)
- 为什么JDK动态代理中，该api需要我们传入classloader？
    - 创建代理类的对象需要用到类加载器
    - JDK动态代理没有相应的class文件，那么JVM就不会为其分配ClassLoader，所以需要我们为其指定classLoader（借用类加载器）。

## 动态代理需要传入类加载器，类加载器的作用

- 通过类加载器把对应class文件加载到JVM
- 通过类加载器创建类的Class对象，进而创建这个类的对象
    - User —> user
        - User类的Class对象 —>new User() —>user
- 如何获取类加载器：每一个.class文件，JVM会自动分配与之对应的ClassLoader

## 如何在Spring启动过程中预热缓冲池

- 用事件：ApplicationReadyEvent
- 实现Runner接口：CommandLineRunner和ApplicationRunner
- Bean的初始化去做

## @Lazy注解能解决循环依赖问题吗？

- 能。不过解决的是构造器注入这种循环依赖问题。普通循环依赖可以通过三级缓存来解决，但是三级缓存解决不了构造器注入的循环依赖问题。
- @Lazy修饰的bean他将被延迟初始化，直到第一次使用它。这意味着，如果两个Bean互相依赖，可以通过延迟初始化一个Bean来解决。
- 但是忍不住提一句：循环依赖通常是设计问题，尽量避免它。

## 为什么Spring不建议使用字段注入

- 单一职责问题
    - 如果使用字段注入，我们不会过多注意。使用构造器注入的如果参数过多，写法比较臃肿，所以间接提醒我们，违背了单一职责原则，该重构了。
- 可能产生NPE
    - 在构造方法中获取某块字段注入的内容，会得到null，这是不可避免的。
- 不利于测试
    - @autowired依赖了spring容器，用单元测试的时候就要启动一个很重的容器，很浪费时间。

## Spring中的shutdownhook作用是什么

- 在Srping中，可以使用AbstractApplicationContext及其子类来注册Shutdown hook，该类提供了一个方法叫：registerShutdownHook().
- 很多中间件的优雅停机就是基于该hook实现的
- spirng销毁bean 也是基于该hook。比如DisposableBean的destroy方法和@PreDestory

## Spring AOP和AspectJ 有什么区别？

- AOP是运行时增强，AspectJ是编译时增强。
- AOP是动态代理方式实现，AspectJ是基于ASM修改字节码。
- AspectJ性能比较好，切面多的话，用AspectJ


## aspectJ、cglib、jdk 动态代理的关系

- spring支持full aspect、cglib、jdk动态代理来实现spring aop
- 一般情况下，spring不会使用full aspectJ，但是会用aspectJ注解，spring aop支持aspectJ框架的注解编程，但仅仅只用了注解来方便编写代码。开启注解编程需要加注解@EnableAspectJAutoProxy。aspectJ 注解编程需要引入aspectweaver.jar包，比如@Around就在该包下
- 如果要使用full aspectJ
	- 支持Load-Time Weaving 和 Compile-Time Weaving，即运行时和编译时
	- Compile-Time Weaving 需要引入aspectjrt.jar包，还需要在maven引入aspectJ编译插件才能支持
	- Load-Time Weaving 需要在jvm启动时配置java-agent为AspectJ的aspectjweaver库
		- spring 也可以直接在配置文件配置，具体略
- 不管是注解方式还是xml配置还是切面直接实现MethodInterceptor方法拦截器，默认有接口就是jdk动态代理实现的aop，没有接口就是实现子类方式的cglib。
- 其中要注意的是：虽然cglib能代理protected方法，但是spring aop不管是jdk代理的方式实现的aop还是cglib实现的aop都不支持代理protected方法（虽然技术上cglib能实现，spring 官方搞特殊，如果想要支持private或者protected方法，用full aspectJ）
- 可以通过配置强制使用cglib，但好像意义不大，具体配置有xml和注解，略。

> 以上full aspectJ 的内容仅供参考，来源大语言模型

## 关于spring aop能否代理protected方法？

- spring aop不使用full aspectJ的情况下，默认是通过cglib或者jdk动态代理
- jdk动态代理需要依赖接口方法，由于接口方法是public的，所以jdk只能代理public方法
- 如果没接口时，是通过cglib来实现aop，由于cglib 是通过实现子类来实现动态代理，理论上支持代理protected方法，但是spring aop不管是jdk代理的方式实现的aop还是cglib实现的aop都不支持代理protected方法（虽然技术上cglib能实现，spring 官方搞特殊，如果想要支持private或者protected方法，用full aspectJ）

```
引用：https://docs.spring.io/spring-framework/docs/2.5.5/reference/aop.html
原话：
Due to the proxy-based nature of Spring's AOP framework, protected methods are by definition _not_ intercepted, neither for JDK proxies (where this isn't applicable) nor for CGLIB proxies (where this is technically possible but not recommendable for AOP purposes). As a consequence, any given pointcut will be matched against _public methods only_!
翻译：
由于Spring AOP框架的基于代理的性质，因此，受保护的方法未被拦截，既不适用于JDK代理（在此不适用）也不适用于CGLIB代理（从技术上讲这是可能的，但对于AOP目的而言不建议）。结果，任何给定的点键都将仅与公共方法匹配！
```



## Spring切面的五种通知类型

- before，前置通知，在方法调用前执行
- after 方法执行后调用
- around 之前之后都执行
- after-returning 方法成功执行完成后执行
- after-throwing 方法执行报错后执行



## Autowired和Resource关键字的区别？

- 共同点：
    - 写在字段或者Setter方法上
    - 都用于bean的注入
- 不同点：
    - Autowired是Spring 提供的注解，而@Resource是javax包的注解
    - Autowired 是ByType来装配对象，如果想ByName可以通过配合@Qualifer使用，而@Resource默认是根据ByName来装配，如果想改为ByType，使用type属性

## Spring bean 的生命周期

- 实例化bean：推断构造方法，实例化bean
- 设置对象属性（依赖注入）：实例化后的baen被封装到beanWrapper中，完成依赖注入
- 处理Aware接口：
    - 如果Bean实现了BeanNameAware接口，会调用setBeanName()方法
    - 如果实现了BeanFactoryAware接口，调用setBeanFactory()方法
- BeanPostProcessor
    - 如果bean实现了BeanPostProcessor接口，那么会调用postprocessBeforeInitialization()
- 初始化
    - 如果Bean中的某个方法被@PostConstruct 标记，那么就去调用它
    - 如果实现了InitializingBean，调用afterPropertiesSet方法
    - 如果Bean 指定了init-method 方法，那么就去调用它。
- 如果Bean实现了BeanPostProcessor接口，会调用postProcessAfterInitialization()
- bean不再需要的时候，会被销毁，如果实现了disposableBean接口，那么就调用destory方法。

## spring 初始化的三个方法的先后执行顺序

- @PostConstruct > afterPropertiesSet > init-method
- @PostConstruct 是方法注解
- afterPropertiesSet 是InitializingBean接口的方法
- init-method可以在xml配置，也可以在@Bean 注解作为参数配置

## bean的作用域

- singleton：默认，容器只有一个bean
- prototype：每个请求创建一个bean
- request：每个网络请求创建一个bean
- session：每个session创建一个bean
- global-session：global-session跟Portlet应用相关的

## Spring中单例bean是线程安全的吗

- 关于单例bean的线程安全问题需要由开发者自己去控制，Spring并没有做线程安全方面的控制

## Spring 基于xml注入的方式有哪些

- Set方法注入
- 构造器注入

## Spring如何解决循环依赖问题（简单版本）

- 对于普通Java对象，对象之间的依赖问题很好解决，比如A依赖B，B依赖A。
    - A a= new A(); a.setB ();
    - B b=new B();b.setA()
- 由于Spring bean 有着复杂的生命周期，所以解决循环依赖问题也稍微麻烦一点，主要影响的是
    - 实例化
    - 填充属性
    - 初始化
- Spring 使用了三级缓存来解决循环依赖的问题
    - singletonObjects 用于存放可以直接使用的单例bean
    - earlySingletonObjects 用于存放没填充属性的bean
    - singletonFactories 存放bean工厂
- 对于对象A依赖B，对象B依赖A的情况
    - 在对象A实例化后，会提前暴露到earlySingletonObjects
    - 接着填充属性，发现此时依赖了B，发现没有B，走B的创建过程
    - B实例化后，填充属性，发现依赖了A，从earlySingletonObjects 中获取到了未填充属性的A，设置A，完成初始化后把自己放到singletonObjects里
    - 返回A继续填充B，发现B已经在singletonObjects里面了，直接填充B
    - 解决了循环依赖问题
- 前面有提到三级缓存，三级缓存的作用是什么？
    - 三级缓存是用来存储代理 Bean，当调用 getBean()方法时，发现目标 Bean 需要通过代理工厂来创建，此时会将创建好的实例保存到三级缓存，最终也会将赋值好的 Bean 同步到一级缓存中。
- Spring 中哪些情况下，不能解决循环依赖问题？
    - 多例 Bean 通过 setter 注入的情况，不能解决循环依赖问题
    - 构造器注入的 Bean 的情况，不能解决循环依赖问题
    - 单例的代理 Bean 通过 Setter 注入的情况，不能解决循环依赖问题
    - 设置了@DependsOn 的 Bean 的情况，不能解决循环依赖问

## Spring的循环依赖

- （子路老师[https://www.bilibili.com/video/BV1Ga4y1E7Br](https://www.bilibili.com/video/BV1Ga4y1E7Br)）
- 对于普通的Java对象的循环依赖问题，他们之间是很好解决的，比如X依赖Y，Y依赖X，这种是很好解决的：
    - X x= new X(); x.setY ();
    - Y y=new Y();y.setX()
- Spring的循环依赖之所以复杂，是因为Spring Bean有着不同于普通Java对象的复杂生命周期，所以要讲一下Spring Bean的生命周期
    - 首先Spring 容器启动后，他会去做一个扫描，扫描之后把他变成BeanDefinition存到一个BeanDefinitionMap中
    - 然后对这个Map去遍历，并做验证，比如验证是否单例，是否懒加载，是否有depend on，是否抽象等等。
    - 然后获取当前实例化的类有没有存在单例池中，有没有被提前暴露。如果没有被提前暴露的话，Spring Bean就会被开始创建。
    - 通过推断构造方法，推断出一个最佳的构造方法，然后通过反射去实例化Java对象
    - 判断是否做BeanDefinition的合并，Spring容器是否支持循环依赖，如果支持循环依赖的话，会提前暴露一个半成品的Bean到ObjectFactory，存到一个二级缓存Map中。
    - 做一些属性填充
    - 做一些Aware接口的回调，比如BeanNameAware，ApplicationContextAware，ClassLoaderAware等等。
    - 如果实现了PostProcessor接口的话，就做初始化之前的方法回调。
    - 然后做一些初始化的回调，@PostConstruct，InitializingBean，或者init-method方法。
    - 如果实现了PostProcessor接口的话，就做初始化之后的方法回调。
    - 这样的话，整个Spring Bean基本可以满足使用了。把这个Bean放入到单例池。
- Spring的循环依赖解决大概：
    - 实例化X的时候，首先对X做一些基本的验证，验证完之后，看一下X所对应的ObjectFactory有没有提前暴露，这种时候肯定是没有的 ，接着就推断构造方法。接着就把X实例化出来，X实例化出来就会提前暴露。接着就是X的属性填充，发现了需要填充Y。
    - 发现Y并没有被实例化，走Y的生命周期过程，发现Y也没有提前暴露，继续走实例化Y，实例化Y后继续往下执行，把Y提前暴露。接着做Y的属性填充，发现需要填充X，但是X并没有在单例池中（X实例化只是走了一半）。
    - 继续走X的生命周期流程，当走到去二级缓存中找的时候找到了->往Y中注入X的objectFactory对象->解决循环依赖。

## Spring 实例化Bean推断构造方法

- 如果@Autowired指定了构造方法，那么就使用该构造方法
- 如果没有指定
    - 优先使用无参构造
    - 如果没有无参构造方法，有两个及以上的构造方法，会报错

## Spring事务实现方式

- 编程事务
- 声明式事务@Transcation

## Spring事务的传播级别（7个）

- PROPAGATION_REQUIRED：默认的Spring事务传播级别，若当前存在事务就加入事务，没有就创建一个
- PAOPAGATION_REQUIRE_NEW：不管有没有事务都新建一个，新老事务相互独立
- PROPAGATION_SUPPORTS：当前存在事务，就加入其中，没有事务就不走事务
- PROPAGATION_NOT_SUPPORTED：以非事务的方式运行，存在事务就先把事务挂起
- PROPAGATION_MANDATORY：强制事务执行，若当前不存在，则抛出异常
- PROPAGATION_NEVER: 以非事务的方式执行，如果当前存在事务，则抛出异常
- PROPAGATION_NESTED：存在事务，嵌套其中，没有事务，创建一个



## Spring AOP失效的原因

- 所在方法是非public或者final或者static 方法
- 发生自调用（包括调用自己的方法和调用内部类的方法）


## Spring 事务失效的原因

- 配置错误
	- 异常类型错误，默认是RuntimeExcetion
	- 事务属性配置不正确，propagation属性配置为不适用事务
	- 事务类没有被spring容器管理
	- 数据源没有加载事务管理器
- aop失效
	- 注解所在的方法不是public
		- Spring事务代码层过滤掉非public了，官网说了如果需要其他访问权限，可以用aspectJ
		- 但是理论上cglib是支持代理包和proteced，至于要这么设计，估计是为了与jdk代理保持统一吧
		- 注：jdk代理对象必须实现接口，而接口方法默认是public的，所以jdk代理只支持public方法
	- 注解所在的方法是static方法
	- 注解所在的方法是final方法
	- 发生自调用的情况
		- 调用自己的方法
		- 调用内部类方法
- 代码写法问题
	- 异常被捕获，没有抛出异常
- 数据库存储引擎不支持事务



## 事务注解的本质原理是什么

- 事务注解仅仅代表事务相关的元数据，在运行时被事务基础设施读取并消费，根据这些元数据来配置事务的行为。事务注解主要依赖于Spring AOP，使用了一个事务拦截器，在方法调用前后进行事务增强。

## Spring 框架中用到了哪些设计模式？

- 工厂设计模式 : Spring 使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
    
- 代理设计模式 : Spring AOP 功能的实现。
    
- 单例设计模式 : Spring 中的 Bean 默认都是单例的。
    
- 原型模式：Spring Bean 如果配置了prototype模式的话，那么每次都会通过克隆的方式生成新对象。
    
- 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
    
- 观察者模式: Spring 中的 Event 和 Listener。
    
    - spring 事件：ApplicationEvent，该抽象类继承了EventObject 类，JDK 建议所有的事件都应该继承自 EventObject。
        - spring 事件监听器：ApplicationListener，该接口继承了 EventListener 接口，JDK 建议所有的事件监听器都应该继承EventListener。


- ## BeanPostProcessor与BeanFactoryPostProcessor的区别

`BeanFactoryPostProcessor` 是在bean的定义信息已经加载但尚未创建任何bean实例之前被调用的。它的主要目的是允许对bean的定义（如配置元数据）进行修改。

`BeanPostProcessor` 是在bean初始化之前和之后执行的（对应2个方法）。




## 说说Spring 中 ApplicationContext 和 BeanFactory 的区别

- BeanFactory是最原始的接口，提供了最基本的容器功能
- ApplicationContext实现了BeanFactory 接口，对容器的功能做了进一步的扩展，比如
    - 支持了国际化
    - 支持事件发布与监听
    - 支持读取环境变量
- ApplicationContext的初始化和BeanFactory有一个重大的区别:BeanFactory在初始化容器时，并未实例化Bean,直到第一次访问某个Bean时才实例目标Bean;而ApplicationContext则在初始化应用上下文时就实例化所有的单实例的Bean。因此ApplicationContext的初始化时间会比BeanFactory稍长一些。

## SpringIOC的启动流程

- IOC 是什么
    - IOC是控制反转，把对象的控制权转移到ioc容器。应用程序如果需要使用到某个对象实例，直接从 IOC 容器中去获取就行，这样设计的好处是降低了程序里面对象与对象之间的耦合性。
- Bean的声明方式
    - spring声明bean的方式有很多种，可以在xml配置，@Bean注解，@Component，@Service，@Repository等等。
    - Spring 在启动的时候会去扫描解析这些bean，然后保存到ioc容器中
- ioc的工作流程大致分为两个阶段
    - ioc的初始化
        - 通过xml配置或者注解配置信息解析生成BeanDefiniton，注册到BeanDefinitonMap
        - 遍历这个map，走bean的生命周期
    - ioc容器的使用方式
        - 通过@Autowired自动注入
        - 通过BeanFactory.getBean() 获取IOC容器的bean
    - 另外，需要注意的是，对于那些指定lazy-init的bean，ioc容器启动的时候不会去实例化它，而是在第一次获取的时候去实例化它，而且ioc容器不会去管理这些bean

## Spring常用的注解

- 创建Bean的注解
    - @Configuration 配合@Bean
    - @Component
    - @Controller
    - @Service
    - @Repository
- 注入属性
    - @Autowired
    - @Qualifier
    - @Resource
    - @Value
- 作用域注解
    - @Scope
- 配置类相关
    - @ComponentScan
    - @Import
    - @PropertySource 指定Properties文件的位置

# MVC

## SpringMVC的执行流程

- 用户发送请求到前端控制器DispatcherServlet
- 前端控制器调用处理映射器HandlerMapping
    - 处理映射器根据配置信息生成处理器对象和拦截器对象返回给前端控制器
- 前端控制器调用处理适配器HandlerAdapter
    - HandlerAdapter经过适配后调用具体的Controller
    - Controller返回具体的ModleAndView
    - HandlerAdapter把ModelAndView返回给前端控制器
- 前端控制器把ModelAndView返回给视图解析器
    - 视图解析返回给具体View
- 前端控制器根据View进行渲染

![](attachments/Pasted%20image%2020240202222314.png)

## SpringMVC的执行流程（简化版本）

- 请求到前端控制器，控制器根据处理器映射器，最终找到处理器，处理完成后返回ModelAndVeiw给前端控制器
- 前端控制器用ModelAndView请求到视图解析器解析后渲染页面



# SpringBoot

## 为什么使用SpringBoot

- 不像Spring一样有复杂的xml配置
- 内置Tomcat
- 有Starter，简化开发
- 最重要的是，自动配置

## SpringBoot的核心注解

- 启动类上面的注解是@SpringBootApplication，它也是 Spring Boot 的核心注解，主要组合包含了以下 3 个注解：
    @SpringBootConfiguration：组合了 @Configuration 注解，实现配置文件的功能。
    @EnableAutoConfiguration：打开自动配置的功能，也可以关闭某个自动配置的选项，如关闭数据源自动配置功能： @SpringBootApplication(exclude ={DataSourceAutoConfiguration.class })。
    @ComponentScan：Spring组件扫描。

## 如何理解 Spring Boot 中的 Starter？

- Starter 是启动依赖，它的主要作用有几个:
    - Starter 组件以功能为纬度，来维护对应功能的 jar 包的版本依赖，开发者只需要关心业务层，而无需过多关注版本冲突等问题。
    - Starter内部集成了自动装配机制，导入starter相关的jar包，那么这个组件相关的自动配置类会被Spring管理。
- Spring官方提供了很多Starter 组件，比如 Redis、 JPA、 MongoDB等等。还有一些第三方会维护一些Starter。官方提供的Starter和第三方提供的Starter主要区别在于命名上。
    - 官方提供的Starter以spring-boot-starter 开头的前缀。
    - 而第三方提供的Starter以spring-boot-starter 开头的后缀。

## SpringBoot Starter工作原理

- SpringBoot启动的时候会干几件事：
    - 会找Starter包下的resources/META-INF/spring.factories文件，扫描配置文件的jar包
    - 根据spring.factories配置加载AutoConfigure类
    - 根据@Conditional注解条件，自动注入Bean到容器

## 如何自定义一个Stater

- [https://bbs.huaweicloud.com/blogs/272493](https://bbs.huaweicloud.com/blogs/272493)
- 定义好需要通过配置类来实例化的Bean，XXXService
- 定义好属性类XXXProperties
    - @ConfigurationProperties(prefix = "")来绑定属性前缀
- 定义好配置类，
    - 类名一般是XXXConfiguration
    - EnableConfigurationProperties(XXXProperties.class)
    - 可以配合Conditional的子类来做条件控制
- 定义好spring.factories属性文件
- 打包上传到本地仓库
- 其他项目引入我们自定义的starter模块

## 自动配置原理

- 启动类上有一个注解:@SpringBootApplication,他标明该类是一个SpringBoot的启动类，它内部是由3个核心注解组成：
    - @SpringBootConfiguration ，底层还是@Configuration注解
    - @ComponentScan，扫描使用该注解的类下的包
    - @EnableAutoConfiguration 开启自动配置
- @EnableAutoConfiguration 点进去该注解，会发现有两个核心注解：
    - @AutoConfigurationPackage 自动配置包
        - 底层是@Import
        - 默认情况下，将主配置类下的包及其子包里边的组件扫描到Spring容器中。
        - 跟@ComponentScan有点像，不过他们扫描的类不同，比如加入了Spring Data JPA，@Entity这个注解就是由@AutoConfigurationPackage 扫描加载的。我们平时用到的@Controlelr，@Service，@Component，@Repository都是由@ComponentScan 扫描配置的。
    - @Import(AutoConfigurationImportSelector.class) 给IOC容器导入组件
        - AutoConfigurationImportSelector.class 有getCandidateConfigurations 方法，这个方法扫描META-INF/spring.factories 这个文件下所有配置类，将其包装成Properties对象，最后添加到Spring容器里
- [https://www.bilibili.com/video/BV1NY411P7VX](https://www.bilibili.com/video/BV1NY411P7VX) springboot自动配置


- springboot 自动配置

![](attachments/Pasted%20image%2020240202222327.png)

![](attachments/Pasted%20image%2020240202222335.png)
![](attachments/Pasted%20image%2020240202222410.png)

- 在SpringBoot的Main方法中，调用了SpringApplication的run方法，底层的作用是
    - 启动一个Context容器，
    - 注册源配置类
    - 递归加载和处理所有的配置类，加载那些被@ComponentScan和@Import标注的类
- 而源配置类中，有一个@SpringBootApplication，表明是一个SpringBoot的启动类，他是一个由三个注解组成
    - SpringBootConfiguration，底层是一个@Configuration，表明是一个配置类
    - @ComponentScan 该注解具有组件扫描的功能
    - @EnableAutoConfiguration 表明开启自动配置功能
        - @AutoConfigurationPackage ,底层也是@Import注解，导入一个Register类
        - @Import(AutoConfigurationImportSelector.class)
            - 通过SpringFactories机制加载 spring-boot-autoconfigure-x.x.x.jar包里的spring.factories所配置的自动配置类
            - 根据@Conditional过滤掉不必要的自动配置类



## 自动配置原理（大模型）

Spring Boot的自动装配原理基于Spring框架的条件化配置和Bean的自动化配置。它利用Spring框架提供的强大扩展点，结合Java的注解处理器和反射机制，实现了对Bean的自动化配置。下面是Spring Boot自动装配的主要原理：
1. **启动类注解**：Spring Boot应用的启动类通常使用`@SpringBootApplication`注解。这个注解是一个组合注解，它包含了`@EnableAutoConfiguration`，这是实现自动装配的关键。
2. **@EnableAutoConfiguration**：这个注解会告知Spring Boot开启自动配置功能。它通过`@Import`注解导入`AutoConfigurationImportSelector`类，该类会扫描项目中所有依赖的jar包，查找带有`spring.factories`文件的META-INF目录。
3. **spring.factories**：这是一个典型的Java Properties文件，它列出了所有可自动装配的配置类。这些配置类都是以`EnableAutoConfiguration`为key的属性值。
4. **条件注解**：自动配置类通常会使用`@Conditional`注解及其衍生注解（如`@ConditionalOnClass`、`@ConditionalOnMissingBean`等），确保只有在满足特定条件时，自动配置才会生效。这样可以避免不必要的配置，使得自动配置更加精确和灵活。
5. **配置类**：自动配置类通常使用`@Configuration`注解，表示它是一个Java配置类。在配置类内部，使用`@Bean`注解定义需要创建和管理的Spring Bean。
6. **Bean的创建和管理**：Spring容器负责创建和管理这些Bean。如果容器中已经存在某个Bean，Spring Boot通常不会再次创建，以避免冲突。
7. **自定义配置**：用户可以通过定义自己的Bean或者修改配置文件（如application.properties或application.yml），来覆盖自动配置的默认行为。
总的来说，Spring Boot自动装配通过一系列的注解和约定，极大地简化了Spring应用的配置过程，使得开发者可以快速搭建和启动应用。它遵循“约定大于配置”的原则，提供了零配置或者极少量配置的体验。


> 由智谱清言AI大模型生成，我觉得挺简洁的



