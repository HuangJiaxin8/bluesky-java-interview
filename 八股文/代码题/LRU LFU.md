

## LRU


注意：
由于LinkedHashMap是为自动扩容的，当table数组中元素大于Capacity * loadFactor的时候，就会自动进行两倍扩容。但是为了使缓存大小固定，就需要在初始化的时候传入容量大小和负载因子。  
为了使得到达设置缓存大小不会进行自动扩容，需要将初始化的大小进行计算再传入，可以将初始化大小设置为(缓存大小 / loadFactor) + 1，这样就可以在元素数目达到缓存大小时，也不会进行扩容了。这样就解决了上述第一点问题。
https://www.jianshu.com/p/c627a30cf14a


```JAVA
import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int CACHE_SIZE;

    public LRUCache(int cacheSize) {
        // true 表示让 LinkedHashMap 按照访问顺序来进行排序,最近访问的放在头，最老访问的放在尾
        // (int) Math.ceil(cacheSize / 0.75) + 1, 0.75f 可以阻塞LinkedHashMap自动扩容
        super((int) Math.ceil(cacheSize / 0.75) + 1, 0.75f, true);
        CACHE_SIZE = cacheSize;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // 当 map 中的数据量大于指定的缓存个数的时候，就自动删除最老的数据
        return size() > CACHE_SIZE;
    }

    public static void main(String[] args) {
        LRUCache<Integer, String> cache = new LRUCache<>(3);

        cache.put(1, "A");
        cache.put(2, "B");
        cache.put(3, "C");

        // 访问元素
        cache.get(1);
        cache.put(4, "D");

        System.out.println(cache.keySet()); // 输出 [3, 1, 4]，元素2被移除
    }
}

//注意：LinkedHashMap 线程不安全
```


```java
// 线程安全的LRU

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public class ThreadSafeLRUCache<K, V> {
    private final Map<K, V> cacheMap;
    private final int CACHE_SIZE;

    public ThreadSafeLRUCache(int cacheSize) {
        CACHE_SIZE = cacheSize;
        // 创建一个访问顺序的LinkedHashMap
        Map<K, V> linkedHashMap = new LinkedHashMap<K, V>((int) Math.ceil(cacheSize / 0.75) + 1, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                // 当 map 中的数据量大于指定的缓存个数的时候，就自动删除最老的数据
                return size() > CACHE_SIZE;
            }
        };
        // 使用Collections.synchronizedMap来包装，实现线程安全
        cacheMap = Collections.synchronizedMap(linkedHashMap);
    }

    public V get(K key) {
        synchronized (cacheMap) {
            return cacheMap.get(key);
        }
    }

    public void put(K key, V value) {
        synchronized (cacheMap) {
            cacheMap.put(key, value);
        }
    }

    public void remove(K key) {
        synchronized (cacheMap) {
            cacheMap.remove(key);
        }
    }

    public static void main(String[] args) {
        ThreadSafeLRUCache<Integer, String> cache = new ThreadSafeLRUCache<>(3);

        // 模拟多线程环境
        Thread t1 = new Thread(() -> {
            cache.put(1, "A");
            cache.put(2, "B");
            cache.put(3, "C");
            System.out.println(cache.get(1)); // 输出 A
        });

        Thread t2 = new Thread(() -> {
            cache.put(4, "D");
            System.out.println(cache.get(2)); // 可能输出 B，也可能因为LRU被移除而输出 null
        });

        t1.start();
        t2.start();
    }
}

```


>智谱清言大模型生成



## LFU


```java
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

public class ThreadSafeLFUCache<K, V> {
    private final int capacity;
    private final ConcurrentHashMap<K, V> cache;
    private final ConcurrentHashMap<K, FrequencyNode<K, V>> frequencyMap;
    private final FrequencyNode<K, V> head;
    private final ReentrantLock lock;
    private int size;

    public ThreadSafeLFUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new ConcurrentHashMap<>(capacity);
        this.frequencyMap = new ConcurrentHashMap<>();
        this.head = new FrequencyNode<>(-1, null, null);
        this.head.next = head;
        this.head.prev = head;
        this.lock = new ReentrantLock();
        this.size = 0;
    }

    public V get(K key) {
        lock.lock();
        try {
            return getInternal(key);
        } finally {
            lock.unlock();
        }
    }

    private V getInternal(K key) {
        V value = cache.get(key);
        if (value != null) {
            FrequencyNode<K, V> node = frequencyMap.get(key);
            increaseFrequency(node);
        }
        return value;
    }

    public void put(K key, V value) {
        lock.lock();
        try {
            if (capacity <= 0) {
                return;
            }
            if (cache.containsKey(key)) {
                FrequencyNode<K, V> node = frequencyMap.get(key);
                node.value = value;
                increaseFrequency(node);
            } else {
                if (size >= capacity) {
                    removeLeastFrequent();
                }
                FrequencyNode<K, V> newNode = new FrequencyNode<>(1, key, value);
                cache.put(key, value);
                frequencyMap.put(key, newNode);
                addNode(newNode);
                size++;
            }
        } finally {
            lock.unlock();
        }
    }

    private void increaseFrequency(FrequencyNode<K, V> node) {
        node.frequency++;
        removeNode(node);
        addNode(node);
    }

    private void removeNode(FrequencyNode<K, V> node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void addNode(FrequencyNode<K, V> node) {
        FrequencyNode<K, V> prev = head;
        FrequencyNode<K, V> next = head.next;
        while (next != head && next.frequency <= node.frequency) {
            prev = next;
            next = next.next;
        }
        node.next = next;
        node.prev = prev;
        prev.next = node;
        next.prev = node;
    }

    private void removeLeastFrequent() {
        FrequencyNode<K, V> tail = head.prev;
        cache.remove(tail.key);
        frequencyMap.remove(tail.key);
        removeNode(tail);
        size--;
    }

    private static class FrequencyNode<K, V> {
        int frequency;
        K key;
        V value;
        FrequencyNode<K, V> prev;
        FrequencyNode<K, V> next;

        public FrequencyNode(int frequency, K key, V value) {
            this.frequency = frequency;
            this.key = key;
            this.value = value;
            this.prev = null;
            this.next = null;
        }
    }

     public static void main(String[] args) {
        LFUCache<Integer, String> cache = new LFUCache<>(3);

        cache.put(1, "A");
        cache.put(2, "B");
        cache.put(3, "C");

        System.out.println(cache.get(1)); // 输出 A
        cache.put(4, "D"); // 这时会移除访问频率最低的元素，即2

        System.out.println(cache.get(2)); // 输出 null，因为2已经被移除
    }
}

```

>智谱清言大模型生成