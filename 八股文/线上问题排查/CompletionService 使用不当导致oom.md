## 问题参考

https://mp.weixin.qq.com/s/XPInv8Ecwt_UANR7CAq7BQ
- 问题
	- 向CompletionService提交任务，因为是无返回值不关心它的最终结果，导致没有正确使用take方法取出完成的任务（线程池完成的任务会丢到链表型队列里），因为链表是无界的，所以链表型的队列也是无界队列。久而久之，链表就会存放很多的任务对象，最终oom。
	- 正确的做法是不管是有返回值还是无返回值，使用CompletionService线程池，都要调用take方法取出完成后的任务。

## 代码模拟
- 首先，service层去写个方法，这个方法利用 CompletionService 去提交一个无返回值的任务。不要去调用take()方法。
```java
package com.hjx.completionserviceoom.service;  
  
import org.springframework.stereotype.Service;  
import java.util.concurrent.CompletionService;  
import java.util.concurrent.Executor;  
import java.util.concurrent.ExecutorCompletionService;  
import java.util.concurrent.Executors;  
  
@Service  
public class CompletionServiceService {  
  
    private static Executor executor = Executors.newFixedThreadPool(10);  
    private static CompletionService<String> service = new ExecutorCompletionService<>(executor);  
  
    public String test1(){  
        for (int i = 0; i < 50; i++) {  
            service.submit(()->{  
                return "HelloWorld--" + Thread.currentThread().getName();  
            });  
        }  
        return "";  
    }  
}
```
- controller层去调用service层的方法
```java
package com.hjx.completionserviceoom.controller;  
  
import com.hjx.completionserviceoom.service.CompletionServiceService;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RestController;  
  
  
import java.util.concurrent.atomic.AtomicInteger;  
  
  
@RestController  
public class CompletionServiceController {  
  
    private static AtomicInteger count = new AtomicInteger();  
    @Autowired  
    CompletionServiceService completionServiceService;  
  
    @RequestMapping("/test1")  
    public String test1(){  
        completionServiceService.test1();  
        int num = count.incrementAndGet();  
        return num+"";  
    }  
}

```

- 启动springboot ，配置最大堆的参数  -Xmx20m （为了快速oom）
- 设置 oom 自动内存dump日志设置
	-  [jvm启动参数设置OOM异常时，自动生成dump文件_EmineWang的博客-CSDN博客](https://blog.csdn.net/a718515028/article/details/86703186)
	- -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=D:\\heapdump.hprof
![](attachments/Pasted%20image%2020240205231020.png)


![](attachments/Pasted%20image%2020240205231030.png)

命令：
-Xms20m -Xmx20m -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=D:\\heapdump.hprof
其中 D:\\heapdump.hprof  是dump文件生成的路径
- 浏览器无限刷新，直到oom 

执行了948次，终于转不动了，按得我手酸emmm，建议20m调成17m左右，不能太小，起不来程序。或者service层for次数调大一点。

![](attachments/Pasted%20image%2020240205231041.png)


oom了，jconsole 断开了链接
![](attachments/Pasted%20image%2020240205231050.png)
终于拿到内存dump文件
![](attachments/Pasted%20image%2020240205231105.png)

## 排查思路
- oom是怎么排查的呢？
	- 首先拿到了hrpof文件，也就是内存dump文件，那么就可以借助第三方工具验证了
	- [Java内存泄漏分析工具Memory Analyzer Tool - 腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1643827)
	- 我的很尴尬，下载后要求jdk11才能启用。只能重新配置一下环境变量
![](attachments/Pasted%20image%2020240205231116.png)


### 开始排查
打开mat分析工具，打开heapdump.hprof文件
![](attachments/Pasted%20image%2020240205231126.png)

![](attachments/Pasted%20image%2020240205231137.png)
### 总结
mat的分析,最终发现了是ExecutorComopletionService的completionQueue属性占用了打量的内存，导致oom。 最终就要去看源码了。