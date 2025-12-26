### 1. HashMap 与 ConcurrentHashMap 的底层实现

这是重灾区，一定要分 JDK 1.7 和 1.8 两个版本回答，体现深度。

#### **HashMap**

- **底层结构：**
  
  - **JDK 1.7：** 数组 + 链表。
  
  - **JDK 1.8：** 数组 + 链表 + **红黑树**。
    
    - 转换条件： 当链表长度大于 8 **且** 数组长度大于 64 时，链表转为红黑树（查找从 `O(n)` 优化为` O(logn)`）；当节点少于 6 时退化为链表。

- **扩容机制：**
  
  - 默认初始容量 16，加载因子 0.75。
  
  - 当元素个数 > 容量 * 加载因子时，扩容为原来的 **2倍**。

- **线程安全性：** 不安全。多线程下扩容可能导致死循环（1.7）或数据覆盖（1.8）。

#### **ConcurrentHashMap (CHM)**

- **JDK 1.7（分段锁）：**
  
  - **结构：** Segment 数组 + HashEntry 数组。
  
  - **锁机制：** Segment 继承自 ReentrantLock。将数据分成一段一段存储，给每一段数据配一把锁。
  
  - **并发度：** 默认 16（即支持 16 个线程并发写）。

- **JDK 1.8（CAS + synchronized）：**
  
  - **结构：** 与 HashMap 1.8 一致（数组 + 链表 + 红黑树）。
  
  - **锁机制：** 抛弃了分段锁。使用 **CAS** 添加新节点，使用 **synchronized** 锁定链表或树的**首节点**。
  
  - **优势：** 锁粒度更细（只锁当前桶），并发性能更高。

---

### 2. ArrayList 的底层实现

- **底层数据结构：** 动态数组（Object[] elementData）。

- **初始容量：** 默认为 10（注意：JDK 1.8+ 是懒加载，第一次 add 时才初始化数组）。

- **扩容机制：**
  
  - 当容量不足时，扩容为原来的 **1.5 倍**（oldCapacity + (oldCapacity >> 1)）。
  
  - 扩容本质是 System.arraycopy，将老数组元素复制到新数组，比较耗时。

- **特点：**
  
  - 支持随机访问（根据下标查询），时间复杂度 O(1)
    
    。
  
  - 插入/删除效率低（因为要移动后续元素），时间复杂度 O(n)
    
    。

- **线程安全：** 不安全。并发场景建议使用 CopyOnWriteArrayList。

---

### 3. 哈希冲突（Hash Collision）怎么解决？

面试官通常想听前两种，特别是第一种。

1. **链地址法（拉链法 - Chaining）：**
   
   - **原理：** 数组的每个槽位指向一个链表，所有哈希值相同的元素都存在链表中。
   
   - **应用：** **Java 的 HashMap** 就是用的这种（1.8 后链表过长转红黑树）。

2. **开放寻址法（Open Addressing）：**
   
   - **原理：** 发生冲突时，去寻找下一个空的槽位。常见方式有线性探测（+1, +2...）或二次探测。
   
   - **应用：** Java 的 **ThreadLocalMap**。

3. **再哈希法（Re-Hashing）：**
   
   - 准备多个哈希函数，第一个冲突了就用第二个，直到不冲突为止。

4. **公共溢出区法：**
   
   - 建立一个公共的溢出区（通常也是数组），凡是冲突的元素都扔进去。

---

### 4. 其它

#### 1. String、StringBuffer、StringBuilder 的区别？

- **String：** **不可变**字符序列（底层是 final char[]，JDK9改为 byte[]）。每次修改都会创建新对象，适合少量操作。

- **StringBuilder：** **可变**字符序列。**线程不安全**，效率最高。适合单线程大量字符串拼接。

- **StringBuffer：** **可变**字符序列。**线程安全**（方法加了 synchronized），效率较低。

#### 2. == 和 equals 的区别？

- **==：**
  
  - 基本数据类型：比较**值**。
  
  - 引用数据类型：比较**内存地址**。

- **equals：**
  
  - 默认情况（Object类）：等价于 ==，比较内存地址。
  
  - 重写后（如 String, Integer）：比较对象的**内容**。

- **追问：为什么要重写 hashCode？**
  
  - **约定：** 如果两个对象 equals 为 true，它们的 hashCode 必须相同。
  
  - **后果：** 如果只重写 equals 不重写 hashCode，放在 HashMap 中会无法根据 Key 找到 Value（因为 HashMap 先算 Hash 确定位置）。

#### 3. 接口（Interface）和抽象类（Abstract Class）的区别？

- **语法层面：**
  
  - 接口只能有 public abstract 方法（JDK 8+ 可以有 default/static 方法），变量只能是 public static final 常量。
  
  - 抽象类可以有普通方法和普通成员变量。

- **设计层面：**
  
  - 接口是对**行为**的抽象（Can-Do，比如“会飞”）。支持**多实现**。
  
  - 抽象类是对**事物**的抽象（Is-A，比如“是鸟”）。只能**单继承**。

---

### 第二板块：并发编程（JUC）基础

#### 4. volatile 关键字的作用？

- **保证可见性：** 一个线程修改了变量，其他线程立刻可见（强制刷回主内存）。

- **禁止指令重排序：** 保证代码执行顺序，防止编译器/CPU 乱序执行（经典案例：单例模式的双重检查锁 DCL）。

- **注意：** volatile **不保证原子性**（比如 count++ 操作即使加了 volatile 也是不安全的）。

#### 5. 线程池的 7 个核心参数（ThreadPoolExecutor）？

这是必背题，顺序不能乱：

1. **corePoolSize：** 核心线程数（常驻线程）。

2. **maximumPoolSize：** 最大线程数。

3. **keepAliveTime：** 非核心线程空闲存活时间。

4. **unit：** 时间单位。

5. **workQueue：** 阻塞队列（存放任务的地方，如 ArrayBlockingQueue）。

6. **threadFactory：** 线程工厂（用于给线程命名）。

7. **handler：** **拒绝策略**（队列满且线程数达到最大时怎么处理）。
   
   - AbortPolicy（默认）：抛异常。
   
   - CallerRunsPolicy：谁调用的谁去执行（比如主线程）。
   
   - DiscardPolicy：直接丢弃。
   
   - DiscardOldestPolicy：丢弃队列里最老的。

#### 6. ThreadLocal 是什么？有没有内存泄漏问题？

- **作用：** 线程本地变量。每个线程有一份独立的副本，互不干扰（空间换时间）。

- **底层：** 每个 Thread 内部维护了一个 ThreadLocalMap。Key 是 ThreadLocal 实例本身，Value 是存储的值。

- **内存泄漏问题：**
  
  - **原因：** ThreadLocalMap 的 Key 是**弱引用**，Value 是**强引用**。如果 ThreadLocal 对象被回收，Key 变成 null，但 Value 还在，且被线程持有，导致 Value 无法回收。
  
  - **解决：** 使用完必须手动调用 **remove()** 方法。

---
