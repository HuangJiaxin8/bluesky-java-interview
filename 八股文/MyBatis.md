
## 什么是Mybatis

- Mybatis是一个半ORM框架，内部封装了JDBC，开发时候只需要关注sql本身，无需关注加载驱动，创建连接，创建statement的过程。
- 它可以使用注解和xml配置来映射原生信息，将POJO映射到数据库中的记录。
- 通过xml文件或注解的方式将各种statement配置起来，并通过java对象和statement中的sql的动态参数进行映射生成最终执行的sql语句，最后由Mybatis框架执行sql并将结果映射为java对象并返回。（从执行sql到返回result的过程）

## Mybatis和Hibernate有哪些不同？

- Hibernate是一个ORM框架，Mybatis是一个半ORM框架，因为Mybatis需要开发者自己编写Sql语句。
- Mybatis直接编写原生态sql，可以严格控制sql执行性能，灵活度高，非常适合关系数据模型要求不高的软件开发，因为这类软件的需求变化频繁。
- 但是灵活的前提是Mybatis无法做到数据库无关性，如果需要实现支持多种数据库的话，需要自定义多套sql映射文件，工作量大。
- Hibernate 对象关系映射能力强，数据库无关性好。

## Mybatis是一个半ORM映射框架，它与全ORM框架的区别在哪里？

- Hibernate属于全自动ORM框架，使用Hibernate查询关联对象或者关联集合对象时候，可以根据对象关系模型直接获取，所以它是全自动的。而Mybatis在查询关联对象或关联集合对象时，需要手动编写SQL语句来完成，所以它是半ORM框架。

## Mybatis的优缺点

- 优点：
    - sql写在xml里，解除sql与代码的耦合，便于管理。
    - 提供动态标签，所以支持动态SQL语句的编写，而且可以重用。
    - 与JDBC相比，可以减少一半的代码量，消除JDBC的大量冗余代码，不需要手动开关连接。
    - 兼容很多数据库，因为Mybatis是通过JDBC连接数据库，所以只要JDBC支持的数据库Mybatis都支持。
    - 提供映射标签，支持对象与数据库ORM映射。
- 缺点
    - SQL编写工作量大，特别是对于字段多，关联表多的时候。
    - SQL语句依赖于数据库，所以不能随意更换数据库。

## #{}和${}的区别是什么？

- #{}是预编译处理，${}是字符串替换
- Mybatis在处理#{}时，会将sql中的#{}替换为?号，调用PreparedStatement的set方法来赋值；
- Mybatis在处理{}时，就是把{}替换成变量的值。
- 使用#{}可以有效的防止SQL注入，提高系统安全性。

## Mybatis不同的xml映射文件，id是否可以重复

- 不同xml映射文件，如果配置了不同的namespace，那么id可以重复，如果没有则不能。
- 因为namespace+id 是作为Map的key使用的。

## 什么是Mybatis的接口绑定？有哪些实现方式？

- 接口绑定，就是Mybatis中定义的接口方法和Sql语句进行绑定，开发者直接调用方法就可以了。
- 接口绑定有两种方式：
    - 通过注解，在接口的方法上加上@select 、@Update 等注解，里面包含SQL语句来绑定。
    - 通过在xml里写SQL语句来绑定，在这种情况下，要指定xml映射文件里的namespace必须为接口的全路径名。
    - 当SQL语句简单可以用注解绑定，SQL语句复杂的话，使用xml绑定，一般都是用xml绑定。

## 编写Mapper接口和mapper.xml，要注意什么

- Mapper.xml 文件中的 namespace 即是 mapper 接口的类路径。
- Mapper 接口方法名和 mapper.xml 中定义的每个 sql 的 id 相同；
- Mapper 接口方法的输入参数类型和 mapper.xml 中定义的每个 sql 的 parameterType 的类型相同；
- Mapper 接口方法的输出参数类型和 mapper.xml 中定义的每个 sql 的 resultType 的类型相同；

## Mapper接口的方法可以重载吗

- Mybatis 的 Dao 接口可以有多个重载方法，但是多个接口对应的映射必须只有一个，否则启动会报错。
- 可以配合Mybatis的动态标签使用。

## MyBatis 中如何执行批处理？

- 使用 BatchExecutor 完成批处理。

## Mybatis 动态 sql 有什么用？执行原理？有哪些动态 sql？

- Mybatis 动态 sql 可以在 Xml 映射文件内，以标签的形式编写动态 sql，执行原理 是根据表达式的值 完成逻辑判断并动态拼接 sql。
- Mybatis 提供了 9 种动态 sql 标签：trim | where | set | foreach | if | choose | when | otherwise | bind

## xml映射文件中，有哪些标签

- 常见的CURD标签：
```xml
<select> <insert> <update><delete>
    <sql>、<parameterMap>、<resultMap>、<include>、<selectKey>
```

- 9个动态sql标签：where | when | if | trim | foreach | set | bind | choose | otherwise
    
- 当实体类中的属性名和表中的字段名不一样，怎么办
    
    - 第一种：编写sql语句的时候，为字段设置别名，使其跟实体类的属性名一致。

```XML
<select id=”selectorder” parametertype=”int” resultetype=”me.gacl.domain.order”>
   <!-- id orderno price 跟实体类的属性名是一致的-->
   select order_id id, order_no orderno ,order_price price form orders where
  order_id=#{id};
 </select>

```

```
- 第二种：通过resultMap标签，来映射字段名和实体类属性名，使其一一对应。
```

```XML
<select id="getOrder" parameterType="int" resultMap="orderresultmap">
   select * from orders where order_id=#{id}
 </select>
 <resultMap type=”me.gacl.domain.order” id=”orderresultmap”>
   <!–用id属性来映射主键字段–>
   <id property=”id” column=”order_id”>
   <!–用result属性来映射非主键字段，property为实体类属性名，column为数据表中的属性–>
   <result property = “orderno” column =”order_no”/>
   <result property=”price” column=”order_price” />
 </reslutMap>
```

- 在mapper中如何传递多个参数？
    - 在xml的sql语句中使用#{0},#{1}这样的标志，分别代表第一个第二个参数。

```Java
public UserselectUser(String name,String area);
对应的 xml,#{0}代表接收的是 dao 层中的第一个参数，#{1}代表 dao 层中第二
参数，更多参数一致往后加即可。

<select id="selectUser"resultMap="BaseResultMap">
    select * fromuser_user_t
    whereuser_name = #{0}
    anduser_area=#{1}
</select>
```


- 在mapper接口中使用@param("xxx") 参数，然后再xml中使用 #{xxx}


```Java
public interface usermapper {
    user selectuser(@param("username") string username,@param("hashedpassword") string hashedpassword);
}

<select id="selectuser" resulttype="user">
    select id, username, hashedpassword
    from some_table
    where username = #{username}
    and hashedpassword = #{hashedpassword}
</select>

```


- 封装成map


## Mybatis是如何进行分页的？分页插件的原理是什么？

- 如何分页
    - Mybatis使用RowBounds对象进行分页，它是针对ResultSet结果集执行的的内存分页，而非物理分页。
    - 也可以在sql内直接拼写limit参数来进行sql的物理分页。
- 分页插件原理
    - 分页插件的原理是通过使用Mybatis提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的sql，然后重写sq，添加对应的物理分页语句。

## Mybatis 是如何将sql执行的结果封装为目标对象并返回的？都有哪些映射形式？

- 使用resultMap标签，定义数据库列名与对象属性名之间的映射关系。
- 也可以sql语句的列别名功能，将列别名书写为对象属性名。
- 有了列名和属性名的映射关系后，Mybatis通过反射创建对象，同时使用反射给对象的属性逐一赋值并返回，那些找不到映射关系的属性，是无法完成赋值的。

## 如何执行批量插入

- 首先，需要在xml创建一个insert语句：

```XML
<insert id=”insertname”>
   insert into names (name) values (#{value})
 </insert>
```

- 然后在java代码中像下面这样执行批处理插入：

```Java
list<string> names = new arraylist();
 names.add(“fred”);
 names.add(“barney”);
 names.add(“betty”);
 names.add(“wilma”);
 // 注意这里 executortype.batch
 sqlsession sqlsession = sqlsessionfactory.opensession(executortype.batch);
 try {
   namemapper mapper = sqlsession.getmapper(namemapper.class);
   for (string name : names) {
     mapper.insertname(name);
   }
    sqlsession.commit();
 }catch(Exception e){
   e.printStackTrace();
   sqlSession.rollback(); 
   throw e; 
 }finally {
   sqlsession.close();
 }

```

## 说说Mybatis延迟加载？它的实现原理是什么？

- Mybatis仅支持association关联对象和collection关联集合对象的延迟加载，association指的就是一对一查询，collection指的就是一对多查询。在Mybatis配置文件中，可以配置是否启用延迟加载lazyLoadingEnabled=true|false
- 它的原理是，使用CGLIB创建目标对象的代理对象，当调用目标方法时，进入拦截器方法，比如调 用a.getB().getName()，拦截器invoke()方法发现a.getB()是null的话，那么就会单独发送事先保存好的查询关联B对象的sql语句，把B对象查询上来，然后调用a.setB(b)，于是a对象b的属性就有值了，接着完成a.getB().getName()方法的调用。
- 当然，不光是Mybatis，几乎所有的包括Hibernate，支持延迟加载的原理都是一样的。

## Mybatis的缓存机制

[MyBatis 一级缓存和二级缓存存在的问题和原理源码介绍_君悅黎心的博客-CSDN博客_mybatis 二级缓存](https://blog.csdn.net/qq_33522040/article/details/106305504)

- 一级缓存LocalCache，默认开启，不能关闭
    
    - 每个SqlSession中持有Executor，每个Executor中有一个LocalCache。当用户发起查询时，先在Local Cache进行查询，如果缓存命中的话，直接返回结果，没有命中就走数据库，再把结果缓存到Local Cache，然后返回结果。
    - 如图：
    
![](attachments/Pasted%20image%2020240202223154.png)

- 需要注意的是：
	- 一级缓存的生命周期和SqlSession一致。
	- 一级缓存最大范围是 SqlSession 内部，有多个 SqlSession 或者分布式的环境下，数据库写操作会引起脏数据，建议设定缓存级别为 Statement。
	- 一级缓存内部设计简单，只是一个HashMap。
- 二级缓存：
    
    - 如果多个SqlSession之间需要共享缓存，则需要开启二级缓存。
    - 开启二级缓存后，会使用CachingExecutor装饰Executor，进入一级缓存查询前，先在CachingExecutor查询二级缓存。二级缓存是被多个SqlSession共享的全局变量。
    
![](attachments/Pasted%20image%2020240202223206.png)

    
    开启二级缓存后：执行查询的顺序为：二级缓存→一级缓存→数据库
    

## 一级缓存的作用域：

- MyBatis提供了一个配置参数localCacheScope，用于控制一级缓存的级别。
- 该参数的取值为SESSION、STATEMENT
    - 当指定localCacheScope参数值为SESSION时，缓存对整个SqlSession有效，只有执行DML语句（更新语句）时，缓存才会被清除。
    - 当localCacheScope值为STATEMENT时，缓存仅对当前执行的语句有效，当语句执行完毕后，缓存就会被清空。

## Mybatis一级缓存为什么是默认开启且不能关闭的

- 一级缓存为什么不能关闭，MyBatis核心开发人员做出了解释：MyBatis的一些关键特性（例如通过</association>和</collection>建立级联映射、避免循环引用（circular references）、加速重复嵌套查询等）都是基于MyBatis一级缓存实现的，而且MyBatis结果集映射相关代码重度依赖CacheKey，所以目前MyBatis不支持关闭一级缓存。
- 默认情况下，本地缓存数据的生命周期等同于整个 session 的周期。由于缓存会被用来解决循环引用问题和加快重复嵌套查询的速度，所以无法将其完全禁用。但是你可以通过设置 localCacheScope=STATEMENT 来只在语句执行时使用缓存。

## 二级缓存的优缺点

- 优点：
    - 可以实现多个SqlSession的共享缓存
    - 粒度更细，能够到namespace级别，通过Cache接口实现类的不同组合，对Cache的可控性更强。
- 缺点：
    - Mybatis在多表查询的时候，极大可能会出现脏数据，有设计上的缺陷，安全使用二级缓存的条件比较苛刻。
    - 在分布式环境下，由于默认的Mybatis Cache实现都是基于本地的，分布式环境下必然会出现读取到脏数据，需要使用集中式将Mybatis的Cache接口实现，有一定的开发成本，建议直接使用Redis缓存，成本更低，安全性更高。

## JDBC编写的步骤有哪些？

- 加载JDBC驱动
    - Class.forName("com.mysql.jdbc.Driver");
- 建立JDBC和数据库的Connection连接
    - Connection c = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/test? characterEncoding=UTF-8", "root", "123456");
- 创建statement或者PreparedStatement，执行SQL语句
- 处理和显示结果
- 释放资源

## Mybatis中比如UserMapper.java是接口，为什么没有实现类还能调用？

- 因为使用JDK动态代理+MapperProxy，本质上调用的是MapperProxy实现类的invoke方法。

## Spring 集成Mybatis 为什么会一级缓存失效

- Spring 每一个查询都是获取不同的SqlSession ，而一级缓存是会话级别的缓存，所以当然失效。
- 想要使用到，就手动开启事务，这样每一次查询就会使用到同一个SQLSession

## RowBounds分页原理

- 内存分页

## PageHelper分页

- 物理分页
- 通过Mybatis拦截器，会修改SQL语句，在后面动态拼接limit语句。