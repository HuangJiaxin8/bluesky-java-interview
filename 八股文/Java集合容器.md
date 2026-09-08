
# Java集合

## 集合继承关系：

- Collection
    - List
    - Queue
    - Set
- Map

- List：有序可重复
- Set：无序不重复
- Queue：先进先出，有序可重复
- Map：key-value 映射，key无序不重复，value无序可重复

## List 和 Array如何想换转换

- List接口里有个toArray方法 可以把List转换为Array
- Arrays.asList() 可以把数组转化为List

## ArrayList扩容为什么是1.5倍

[https://www.cnblogs.com/fortunely/p/14279231.html](https://www.cnblogs.com/fortunely/p/14279231.html)

- 首先，为了充分利用空间，最好是1-2之间
- 为什么不是1.25和1.75,为啥选择1.5呢
    - 为了使用位运算，提高性能:newCapacity = oldCapacity +( oldCapacity>>1)

## ArrayList 有100个元素，如何删除20-50的元素

- list.subList(20,51).clear();
- 因为是左闭右开，所以50要+1

## ArrayList与LinkedList的区别

- 区别的话，我们要站在底层的数据结构的角度来进行分析的。
- ArrayList底层是基于数组来实现的，数组容量满的时候是需要扩容的。
- 而LinkedList底层是基于链表来实现的，而链表是不需要扩容的。他在存放数据的时候只需要.next,.next,把我们的数据存放到尾结点。所以，LinkedList是没有容量限制的，只要我们的服务器内存足够的话，它是可以无限存放的。相对于ArrayList，它在做新增的时候它的效率是高非常多的。

## ArrayList与LinkedList查询时候有什么区别

- 查询的时候，也是要站在底层的数据结构角度来进行分析的。
- ArrayList底层是基于数组来实现的，数据可以根据索引下标Index来查询的，时间复杂度是O(1)。
- 而LinkedList查询的时间复杂度是O(n),它需要从头查询到尾部，它的查询效率是非常低的。
- 反过来，如果ArrayList不是根据index下标来查询的话，那么查询效率也是比较低，是需要一直从头查询到尾部的。所以在中间就要整合到一些折半算法。

## ArrayList的扩容机制

- ArrayList 是一个数组的数据结构，默认情况下，数组的长度是 10。
- 当底层数组容量不够时，会自动发生扩容，扩容后大小是原来的1.5倍。
- 扩容的具体流程很简单：
    - 首先，创建一个新的数组，这个新数组的长度是原来数组长度的 1.5 倍。
    - 然后使用 Arrays.copyOf 方法把老数组里面的数据拷贝到新的数组里面。
    - 扩容完成后再把当前要添加的元素加入到新的数组里面，从而完成动态扩容的过程。

## HashMap存放数据是有序还是无序的

- 是无序的，为什么HashMap是无序的呢
- 是因为我们HashMap集合，他在存放数据时候，会根据我们的key来计算index值，而这个index值它是散列的，是无序的。
- 如果想要实现有序的map的话，可以使用LinkedHashMap，底层是通过双链表，连接每一个key，保证我们在遍历时候是有定顺序的。

## HashMap的底层原理

- 数据结构
    - 在JDK1.7中，使用的是数组+链表的数据结构。
    - 在JDK1.8的时候，使用的是数组+链表，链表到达一定条件转化为红黑树的数据结构。
- put值的过程
    - 首先根据key的hashCode参数去做hash算法得到hash值，然后通过算法（n-1）& hash 得到该元素存放的数组位置，如果数组位置上没值直接插入，如果有值通过比较key是否相同，如果相同就直接覆盖，不相同则通过拉链法解决冲突。
- 数组初始容量为16，扩容因子为0.75，每次采用2倍扩容。
    - 啊里巴巴规范中，提到HashMap构造的时候就要传入数组的大小，而且最好是n次幂。
    - 数组大小一般传入2的n次幂，如果传入的不是2的n次幂，内部会自动转化为2的n次幂。
    - 2的n次幂的目的是：
        - 底层有个算法(n-1)&hash用来计算元素具体在哪个位置，如果n是2次幂，（n-1）的二进制就是，11...111 ,比较方便位计算，同时能够更散列，减少hash冲突。
    - 为什么采用2倍扩容：
        - 为了方便位运算
- JDK1.7采用头插法，JDK1.8采用尾插法。目的：解决循环链表。
    - 死循环是发生在并发环境下，并且发生数组扩容
    - 比如链表ABC，因为是头插法，然后扩容后的链表是CBA
    - 而扩容前，有两个线程T1，T2，都指向了A,而next都指向了B，而扩容发生在线程T1中，那么线程T2是不知道的，那么线程B中的链表会变成CBAB这样的循环链表
- 树化条件是：链表长度大于8，并且数组长度大于64。
- 链化条件:链表长度等于6
    - 为啥要设计为6，不设计为7，是为了不频繁的进行链化和树化。
    - 如果设计为7，那么删除一个元素，就要链化，再增加一个元素，等于8，又要树化。反复的树化和链化都很浪费性能。

## HashMap与HashTable的区别

- 父类不同
    - HashMap是继承自AbstractMap类，而Hashtable是继承自 Dictionary类
- 对null支持不同
    - Hashtable： key和value都不能为null。
    - HashMap： key可以为null，但是这样的key只能有一个，因为必须保证key的唯一性；可以有多个key值对应的value为null。
- 线程安全不同
    - HashMap线程不安全
    - HashTable线程安全

## ConcurrentHashMap的底层原理

- 在JDK7 中
    - ConcurrentHashMap是通过分段锁来设计的，把一个大的HashTable集合，拆分成n多个小的hashtable集合（segment），这样的话，它的锁粒度就比较小。
    - 不像HashTable集合，把整个table数组都锁住了，所以HashTable效率比较低。
    - ConcurrentHashMap默认拆分成16个小的HashTable集合，这样的话在多线程中，它们在执行put操作的时候，只要它们计算的index值不是落在同一个小的HashTable集合里面，这样的话是支持多线程同时去做put操作。
    - 但是它有一个缺陷，就是每次put/get的时候，是需要计算两次index值的。因为它要计算我这个key是存放在哪一个小的HashTable里面，再计算在小的HashTable里面具体哪个位置。
- 在JDK8中
    - ConcurrentHashMap的底层数据结构采用的和HashMap一样，即采用“数组+链表+红黑树”的形式。采用Synchronized+CAS+Node来保证并发安全的进行。他采用锁定头结点的方式降低了锁粒度。
    - 线程安全的实现机制：
        - 初始化头结点时，并没有加锁，而是以CAS的方式进行原子替换。
        - 插入数据时会进行加锁处理，但是锁的是头节点，而不是整个数数组，降低了锁的粒度，并发性能很好
        - 扩容时会进行加锁操作，锁定的仍然是头节点。
        - 查询数据时不会进行加锁，所以性能很好。
        - 在扩容的时候,多个线程共同分担数据迁移任务,每个线程负责的迁移数量是 `(数组长度 >>> 3) / CPU核心数`

## ConcurrentHashMap 的 size()方法是线程安全的吗

- 不是，ConcurrentHashMap 是弱一致性的，不能保证高并发环境下，size()返回和实际的存储的大小一致。

## 为什么ConcurrentHashMap不允许null值

- 二义性问题无解：
    - get的null：1. 代表该值不存在map中 2. 该值的value为null
- HashMap运行key和value都为null值，是因为二义性问题可以解决。get到null的时候，用containsKey方法就可以判断。
- ConcurrentHashMap 由于是并发map，如果调用containsKey那么可能调用该方法的时候就被其他线程put进去了。

## LinkedListHashMap的底层

- 为啥可以实现有序

## TreeMap

- TreeMap 的底层数据结构是一棵红黑树，它是一种自平衡的二叉查找树，具有以下特点：
    1. 每个节点要么是红色，要么是黑色。
    2. 根节点是黑色的。
    3. 每个叶子节点（NIL 节点）是黑色的。
    4. 如果一个节点是红色的，则它的两个子节点都是黑色的。
    5. 对于每个节点，从该节点到其所有后代叶子节点的简单路径上，均包含相同数目的黑色节点。
- TreeMap 中的每个节点都包含三个属性：key、value 和 color。其中，key 和 value 分别表示键和值，color 表示节点的颜色，红色或黑色。TreeMap 中的节点按照键的自然顺序或者指定的比较器顺序进行排序，具有以下特点：
    1. 对于任意节点 x，其左子树中所有节点的键都小于 x 的键，其右子树中所有节点的键都大于 x 的键。
    2. 对于任意节点 x，其左子树和右子树的高度差不超过 1。
- 在 TreeMap 中，查找、插入、删除操作都是基于红黑树的基本操作实现的，具体实现方式如下：
    1. 查找操作：从根节点开始，按照键的自然顺序或者指定的比较器顺序进行查找，直到找到对应的节点或者遇到 NIL 节点。
    2. 插入操作：从根节点开始，按照键的自然顺序或者指定的比较器顺序进行查找，找到插入位置后，将新节点插入到该位置，并进行颜色调整和旋转操作，保持红黑树的平衡性。
    3. 删除操作：从根节点开始，按照键的自然顺序或者指定的比较器顺序进行查找，找到要删除的节点后，根据其子节点的情况进行删除操作，并进行颜色调整和旋转操作，保持红黑树的平衡性。
- TreeMap为什么可以指定比较器（不指定比较器默认就是自然排序）进行排序？就是用到了红黑树的插入操作和查找操作。
- ps：如果面试问你这问题，我倒觉得不比较把整个红黑树都讲了，主要提一下用到了红黑树，然受说一下为什么可以指定比较器（不指定比较器默认就是自然排序）进行排序这个问题的答案，我觉得够了。除非后面面试管细纹红黑树的结构细节。

## 怎么确保一个集合不被修改

- Collections.unmodifiableCollection(Collection c)创建一个只读
- 如果被修改了会抛出java.lang.UnsupportedOperationException

## 迭代器

## fail-fast机制

- fail-fast 这种遍历方式是直接在容器上进行的，在遍历过程中，一旦发现数据被修改了，就会立刻抛出ConcurrentModificationExcetion异常从而遍历失败。常见使用fail-fast方式的容器有HashMap和ArrayList。
- fail-safe这种遍历方式基于容器的一个克隆。因此在对容器中的内容进行修改不会影响遍历。常见使用fail-safe遍历的容器的有ConcurrentHashMap和CopyOnWriteArrayList。

## ListIterator和Iterator

- ListIterator可以增删改，Iterator只可删
- ListIterator可以从顺序和逆序遍历，而Iterator只能顺序
- ListIterator可以获取索引下标，Iterator不可以

## 迭代器与普通for循环有什么区别

- 主要区别是迭代器可以在循环时候删除元素，而for不可以，会报错
- Iterator没有索引下标，但是其实ListIterator可以获取索引下标，for是基于下标获取元素




## CopyOnWrite 

其核心思想是，当需要修改一个数据结构时，不是直接在原始数据上修改，而是先复制一份数据，在副本上进行修改，修改完成后，再替换掉原来的数据。

特点：
- 读写分离
	- 读不需要加锁
	- 写操作则需要对数据进行复制和修改，这个过程需要加锁，以防止多个写操作同时进行导致数据不一致。
- 延迟复制
	- 写操作不会立即影响数据结构，而是在写操作完成并准备替换原始数据时才发生。
	- 减少了复制的频率，因为多个写操作可能会连续发生，但只需要进行一次复制。
- 内存占用大
	- 由于写操作需要复制整个数据结构，CopyOnWrite可能会在某些情况下增加内存使用。特别是在数据结构较大时，复制操作可能会导致显著的内存开销。
- 适用读多写少的场景


## CopyOnWriteArrayList会发生fail-fast吗

- fail-fast 发生在 迭代过程中 被修改，除了通过迭代器自己的remove方法外，迭代器会抛出ConcurrentModificationException。
- 而CopyOnWrite 是写时复制，会操作在副本上，迭代器没办法检测到被修改


## Stream流取出最大的年龄

```java
public static void main(String[] args) {
        Person[] people = {
            new Person("Alice", 30),
            new Person("Bob", 25),
            new Person("Charlie", 35)
        };
        Optional<Integer> maxAge = Arrays.stream(people)
                                        .map(Person::getAge)
                                        .max(Integer::compare);
        if (maxAge.isPresent()) {
            System.out.println("最大年龄是: " + maxAge.get());
        } else {
            System.out.println("数组为空");
        }
    }
```