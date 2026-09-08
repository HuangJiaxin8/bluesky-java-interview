---
title: Mybatis 查出了一些结果集，我想对某些字段进行加密，如何处理
date: 2026-09-08
category: 场景题
tags:
  - 场景题
  - 面试

---

> 以下内容来自chatgpt

可以通过 Mybatis 的插件机制来实现对某些字段进行加密的功能。具体步骤如下：

1. 实现自定义的拦截器类，继承自 Mybatis 提供的 Interceptor 接口，并重写其中的 intercept() 方法和 plugin() 方法。
2. 在 intercept() 方法中，对查询结果集中需要加密的字段进行加密处理，并将加密后的结果替换原有的值。
3. 在 plugin() 方法中，使用 Mybatis 提供的 Plugin.wrap() 方法对拦截器进行包装，返回一个新的代理对象。
4. 在 Mybatis 的配置文件中，将自定义的拦截器类配置为插件，并指定需要拦截的 Statement 类型和方法。
5. 在查询时，Mybatis 会自动调用拦截器的 intercept() 方法，对查询结果集进行加密处理。

以下是一个简单的示例代码，演示如何使用 Mybatis 插件机制对查询结果集中的某些字段进行加密处理：

```Java
// 自定义拦截器类
@Intercepts({
    @Signature(type = StatementHandler.class, method = "query", args = {Statement.class, ResultHandler.class})
})
public class EncryptionInterceptor implements Interceptor {
    
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 获取原始的 StatementHandler 对象
        StatementHandler statementHandler = (StatementHandler) invocation.getTarget();
        // 获取原始的 BoundSql 对象
        BoundSql boundSql = statementHandler.getBoundSql();
        // 获取查询语句中的参数
        Object parameterObject = boundSql.getParameterObject();
        // 获取查询语句中的 SQL
        String sql = boundSql.getSql();
        // 判断是否需要对查询结果集进行加密处理
        if (needEncrypt(sql)) {
            // 获取查询结果集
            Object result = invocation.proceed();
            // 对查询结果集中需要加密的字段进行加密处理
            encryptResult(result);
            // 返回加密后的结果
            return result;
        } else {
            // 不需要加密处理，直接执行原始的查询语句
            return invocation.proceed();
        }
    }
    
    @Override
    public Object plugin(Object target) {
        // 使用 Mybatis 提供的 Plugin.wrap() 方法对拦截器进行包装
        return Plugin.wrap(target, this);
    }
    
    @Override
    public void setProperties(Properties properties) {
        // 可以在这里读取配置文件中的参数
    }
    
    // 判断是否需要对查询结果集进行加密处理
    private boolean needEncrypt(String sql) {
        // 根据 SQL 语句中的关键字或表名等信息判断是否需要加密处理
        // 这里只是一个简单的示例，实际应用中需要根据具体情况进行判断
        return sql.contains("user") || sql.contains("password");
    }
    
    // 对查询结果集中需要加密的字段进行加密处理
    private void encryptResult(Object result) {
        // 这里只是一个简单的示例，实际应用中需要根据具体情况进行加密处理
        // 可以使用加密算法对字段进行加密，然后将加密后的值替换原有的值
        if (result instanceof List) {
            List<?> resultList = (List<?>) result;
            for (Object obj : resultList) {
                if (obj instanceof Map) {
                    Map<?, ?> resultMap = (Map<?, ?>) obj;
                    if (resultMap.containsKey("password")) {
                        String password = (String) resultMap.get("password");
                        String encryptedPassword = encrypt(password);
                        resultMap.put("password", encryptedPassword);
                    }
                } else if (obj instanceof User) {
                    User user = (User) obj;
                    String password = user.getPassword();
                    String encryptedPassword = encrypt(password);
                    user.setPassword(encryptedPassword);
                }
            }
        }
    }
    
    // 加密算法，这里只是一个简单的示例，实际应用中需要根据具体情况选择合适的加密算法
    private String encrypt(String str) {
        return DigestUtils.md5Hex(str);
    }
}
```

在 Mybatis 的配置文件中，需要将自定义的拦截器类配置为插件，并指定需要拦截的 Statement 类型和方法：

```XML
<plugins>
    <plugin interceptor="com.example.EncryptionInterceptor">
        <property name="prop1" value="value1"/>
        <property name="prop2" value="value2"/>
    </plugin>
</plugins>
```

其中，`com.example.EncryptionInterceptor` 是自定义的拦截器类的全限定名，`prop1` 和 `prop2` 是自定义的配置参数。
