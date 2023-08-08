const l=JSON.parse('{"key":"v-6fbe830e","path":"/java/Linux.html","title":"Linux","lang":"en-US","frontmatter":{"icon":"pen-to-square","date":"2023-08-08T00:00:00.000Z","category":["java"],"tag":["linux"],"description":"Linux linux 常用命令 基本操作 cd mkdir mv 移动文件 ls 查看当前文件夹下的文件名 ls -l 查看文件夹下的文件详细信息【权限，文件名，文件更新时间，大小（单位为Byte）等】 进程相关 ps -ef 标准格式显示静态进程 top 动态查看进程 日志相关 linux 三剑客：grep ， sed ，awk tail 用于查看动态日志 内存相关 free -h 磁盘文件大小相关 du ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】 查看文件的具体大小，比如多少M ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】 linux 杀掉一个进程 kill -9 暴力式杀进程 kill -15 温和式杀进程，等应用操作完成后再杀掉进程 查看当前有哪些Java进程在运行，用什么命令？ jps 想查看一个进程中有哪些线程在运行，如何看？ 首先要通过top或者ps或者jps查看当前进程的进程id 然后用JDK工具jstack pid，输出jstack文件 jstack 文件里面就会有当前进程的所有线程信息 如何查看一个端口是否被占用 .netstat -anp |grep 端口号","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/bluesky-java-interview/java/Linux.html"}],["meta",{"property":"og:site_name","content":"BlueSky的八股文"}],["meta",{"property":"og:title","content":"Linux"}],["meta",{"property":"og:description","content":"Linux linux 常用命令 基本操作 cd mkdir mv 移动文件 ls 查看当前文件夹下的文件名 ls -l 查看文件夹下的文件详细信息【权限，文件名，文件更新时间，大小（单位为Byte）等】 进程相关 ps -ef 标准格式显示静态进程 top 动态查看进程 日志相关 linux 三剑客：grep ， sed ，awk tail 用于查看动态日志 内存相关 free -h 磁盘文件大小相关 du ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】 查看文件的具体大小，比如多少M ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】 linux 杀掉一个进程 kill -9 暴力式杀进程 kill -15 温和式杀进程，等应用操作完成后再杀掉进程 查看当前有哪些Java进程在运行，用什么命令？ jps 想查看一个进程中有哪些线程在运行，如何看？ 首先要通过top或者ps或者jps查看当前进程的进程id 然后用JDK工具jstack pid，输出jstack文件 jstack 文件里面就会有当前进程的所有线程信息 如何查看一个端口是否被占用 .netstat -anp |grep 端口号"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:author","content":"blueSky"}],["meta",{"property":"article:tag","content":"linux"}],["meta",{"property":"article:published_time","content":"2023-08-08T00:00:00.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-08-08T00:00:00.000Z\\",\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"blueSky\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[],"git":{},"readingTime":{"minutes":1.24,"words":372},"filePathRelative":"java/Linux.md","localizedDate":"August 8, 2023","excerpt":"<h1> Linux</h1>\\n<ul>\\n<li>\\n<p>linux 常用命令</p>\\n<ul>\\n<li>基本操作\\n<ul>\\n<li>cd</li>\\n<li>mkdir</li>\\n<li>mv 移动文件</li>\\n<li>ls 查看当前文件夹下的文件名</li>\\n<li>ls -l 查看文件夹下的文件详细信息【权限，文件名，文件更新时间，大小（单位为Byte）等】</li>\\n</ul>\\n</li>\\n<li>进程相关\\n<ul>\\n<li>ps  -ef  标准格式显示静态进程</li>\\n<li>top  动态查看进程</li>\\n</ul>\\n</li>\\n<li>日志相关\\n<ul>\\n<li>linux 三剑客：grep ， sed ，awk</li>\\n<li>tail  用于查看动态日志</li>\\n</ul>\\n</li>\\n<li>内存相关\\n<ul>\\n<li>free -h</li>\\n</ul>\\n</li>\\n<li>磁盘文件大小相关\\n<ul>\\n<li>du</li>\\n<li>ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】</li>\\n</ul>\\n</li>\\n</ul>\\n</li>\\n<li>\\n<p>查看文件的具体大小，比如多少M</p>\\n<ul>\\n<li>ls -lh 会显示当前文件夹下的所有文件的详细信息，【权限，文件名，文件更新时间，大小（单位为Byte）等】</li>\\n</ul>\\n</li>\\n<li>\\n<p>linux 杀掉一个进程</p>\\n<ul>\\n<li>kill -9 暴力式杀进程</li>\\n<li>kill -15 温和式杀进程，等应用操作完成后再杀掉进程</li>\\n</ul>\\n</li>\\n<li>\\n<p>查看当前有哪些Java进程在运行，用什么命令？</p>\\n<ul>\\n<li>jps</li>\\n</ul>\\n</li>\\n<li>\\n<p>想查看一个进程中有哪些线程在运行，如何看？</p>\\n<ul>\\n<li>首先要通过top或者ps或者jps查看当前进程的进程id</li>\\n<li>然后用JDK工具jstack pid，输出jstack文件</li>\\n<li>jstack 文件里面就会有当前进程的所有线程信息</li>\\n</ul>\\n</li>\\n<li>\\n<p>如何查看一个端口是否被占用</p>\\n<ul>\\n<li>.netstat -anp |grep 端口号</li>\\n</ul>\\n</li>\\n</ul>","autoDesc":true}');export{l as data};
