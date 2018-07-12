《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Implementing_Queue.md)

### BlockingQueue

`Java 5` 为集合框架添加了许多类以供并发应用程序使用。其中大部分是 `Queue` 子接口 `BlockingQueue`（见图 `14-5`）的实现，主要用于生产者消费者队列。

使用生产者 - 消费者队列的一个常见例子是在执行打印假脱机的系统中;客户端进程将打印作业添加到假脱机队列中，由一个或多个打印服务进程处理，每个打印服务进
程重复“占用”队列头部的任务。

正如其名称所暗示的，`BlockingQueue` 为这些系统提供的关键功能是入队和出队方法，直到成功执行才会返回。因此，例如，打印服务器不需要持续轮询队列以发现是
否有任何打印作业正在等待;它只需要调用轮询方法，提供超时，系统将暂停它，直到队列元素变为可用或超时过期。`BlockingQueue` 定义了七种新方法，分为三组：

**添加一个元素**

```java
boolean offer(E e, long timeout, TimeUnit unit) //插入e，等待超时
void put(E e) // 添加e，只要需要等待
```

`Queue` 中定义的商品的无阻塞重载将返回 `false`，如果它不能立即插入该元素。 这个新的重载等待使用 `java.util.concurrent.TimeUnit` 指定的时间，
`Enum` 允许以毫秒或秒为单位定义超时。

将这些方法与从 `Queue` 继承的方法一起使用时，向 `BlockingQueue` 添加元素的方法可以采用四种方法：如果它不立即成功，则 `offer` 返回 `false`;如果在
超时内未成功，则提供返回 `false`， 如果它不立即成功，则添加抛出异常，并放置块直到成功。

**移除一个元素**

```java
E poll(long timeout, TimeUnit unit) // 检索并移除头部，等待超时
E take() // 检索并删除此队列的头部，并根据需要等待
```

再次将这些方法与从 `Queue` 继承的方法一起使用，有四种方法可用于从 `BlockingQueue` 中移除元素的方法：如果 `poll` 不能立即成功，`poll` 将返回 
`null`，如果 `poll` 在其超时时间内未成功，则返回 `null`，如果它不立即成功，则抛出异常，并取块直到成功。

**检索或查询队列的内容**

```java
int drainTo(Collection<? super E> c)// 将队列清理成c
int drainTo(Collection<? super E> c, int maxElements) // 至多将指定数量的元素清除为c
int remainingCapacity() // 返回将被接受而没有阻塞的元素的数量，或者如果无界的话返回Integer.MAX_VALUE
```

`drainTo` 方法自动且高效地执行，所以第二个重载在你知道你的处理能力对一定数量的元素立即可用的情况下是有用的，第一个是有用的 - 例如，当所有生产者线程
都停止工作时。他们的返回值是转移的元素的数量。`RemainingCapacity` 报告队列的剩余容量，虽然与多线程上下文中的任何这样的值一样，调用的结果不应该被用作
测试然后动作序列的一部分;在测试（剩余容量的调用）和一个线程的动作（向队列中添加一个元素）之间，另一个线程可能会介入以添加或删除元素。

`BlockingQueue` 保证其实现的队列操作将是线程安全的和原子的。但是这种保证并没有扩展到从 `Collection-addAll`，`containsAll`，`retainAll` 和 
`removeAll` 继承的批量操作 - 单个实现提供它。因此，例如，在添加集合中的一些元素之后，`addAll` 可能会失败并抛出异常。

### 使用BlockingQueue的方法

一次只为一个人工作的待办事项经理非常有限;我们真的需要一个合作解决方案 - 这将允许我们共享任务的生产和处理。例 `14-1` 显示了 `StoppableTaskQueue`，
它是一个基于 `PriorityBlockingQueue` 的并发任务管理器的简单版本，它允许其用户 - 我们 - 在我们发现需要它们的时候，将任务单独添加到任务队列中，并将
它们取出来处理因为我们发现时间。`StoppableTaskQueue` 类有三个方法：`addTask`，`getTask` 和 `shutDown`。`StoppableTaskQueue` 正在工作或停止。方
法 `addTask` 返回一个布尔值，指示它是否成功添加了一个任务;除非停止 `StoppableTaskQueue`，否则此值将为真。方法 `getTask` 从队列中返回头部任务。如
果没有任何可用的任务，它不会阻塞但返回空值。方法 `shutDown` 停止 `StoppableTaskQueue`，等待所有挂起的 `addTask` 操作完成，然后排出 
`StoppableTaskQueue` 并返回其内容。

例 `14-1`。一个并发的基于队列的任务管理器

```java
public class StoppableTaskQueue {
  private final int MAXIMUM_PENDING_OFFERS = Integer.MAX_VALUE;
  private final BlockingQueue<PriorityTask> taskQueue = new PriorityBlockingQueue<PriorityTask>();
  private boolean isStopped = false;
  private Semaphore semaphore = new Semaphore(MAXIMUM_PENDING_OFFERS);
  // 如果任务成功放入队列，则返回true;如果队列已关闭，则返回false。
  public boolean addTask(PriorityTask task) {
    synchronized (this) {
      if (isStopped) 
        return false;
      if (! semaphore.tryAcquire()) 
        throw new Error("too many threads");
    }
    try {
      return taskQueue.offer(task);
    } finally {
      semaphore.release();
    }
  }
  // 返回队列中的头部任务;如果没有任何任务可用，则返回null
  public PriorityTask getTask() {
    return taskQueue.poll();
  }
  // 停止队列，等待制作者完成，然后返回内容
  public Collection<PriorityTask> shutDown() {
    synchronized(this) { 
      isStopped = true; 
    }
    semaphore.acquireUninterruptibly(MAXIMUM_PENDING_OFFERS);
    Set<PriorityTask> returnCollection = new HashSet<PriorityTask>();
    taskQueue.drainTo(returnCollection);
    return returnCollection;
  }
}
```

在这个例子中，与 `java.util.concurrent` 集合的大多数用法一样，集合本身负责处理在添加或删除队列中的项目时不同线程的交互所产生的问题。实例14-1的大部
分代码都是解决了提供有序关闭机制的问题。这种强调的原因是，当我们继续使用 `StoppableTaskQueue` 类作为更大系统中的组件时，我们需要能够停止日常任务队
列而不会丢失任务信息。在并发系统中实现正常关闭常常是一个问题：有关更多详细信息，请参阅 `Brian Goetz et.al` 的“Java Concurrency in Practice”第 
`7` 章。（`Addison-Wesley`出版社）。

较大的系统将在下一年对每一天的计划任务进行建模，使消费者可以从每天的队列中处理任务。本节示例的一个隐含假设是，如果今天没有计划剩余任务，则消费者不会
等待其中一个可用，但会立即继续在第二天的队列中查找任务。 （在现实世界中，我们现在会回家，或者更有可能出去庆祝。）这个假设简化了这个例子，因为我们不需
要调用 `PriorityBlockingQueue` 的任何阻塞方法，尽管我们将使用一个方法，`drainTo`，来自 `BlockingQueue` 接口。

有很多方法可以关闭像这样的生产者 - 消费者队列;在我们为这个例子选择的一个队列中，管理者公开了一个可以由“主管”线程调用的关闭方法，以阻止生产者写入队
列，排空它，并返回结果。`shutdown`方法设置布尔停止，在尝试将任务放入队列之前，哪些任务生成线程将读取它们。`Taskconsuming` 线程只是轮询队列，如果没
有可用的任务，则返回 `null`。这个简单的想法的问题是，一个生产者线程可能会读取停止标志，发现它是错误的，但在将其值放入队列之前暂停一段时间。我们必须通
过确保关闭方法来防止这种情况，停止队列，将等到所有未完成的值已被插入后再排空。

例 `14-1` 使用一个信号量来实现这个功能 - 一个线程安全的对象，它保持固定数量的许可证。例如，信号量通常用于调节对有限资源集的访问 - 例如数据库连接池。
信号量随时可用的许可证代表目前未使用的资源。需要资源的线程从信号量获取许可证，并在释放资源时将其释放。如果所有资源都在使用，信号量将没有可用的许可证;
此时，试图获得许可证的线程将阻塞，直到其他线程返回一个许可证。

这个例子中的信号量的用法是不同的。我们不想限制生产者线程写入队列 - 它是一个无限制的并发队列，毕竟，在没有我们帮助的情况下，它能够处理并发访问。我们只
想保留当前正在进行的写入的计数。所以我们创建了信号量最大的许可证，这在实践中永远都不会被要求。生产者方法 `addTask` 检查队列是否停止 - 在这种情况下，
它的合约说它应该返回 `false` - 如果没有，它使用信号量方法 `tryAcquire` 获得一个许可，它不会阻塞（不像更常用的如果没有许可证可用，`tryAcquire` 立即
返回 `false`。这个测试然后行为序列是原子的，以确保程序在其他线程可见的任何点保持其不变：未写入值的数量不超过可用许可的数量。

`shutdown` 方法将停止标志设置为同步块（通常的方式是确保由一个线程执行的变量写入对另一个线程的读取是可见的，这是因为写入和读取发生在同一个锁中同步的
块内）。 现在，`addTask` 方法不能获得更多的许可证，并且关闭只需要等到所有先前获取的许可证都已返回。 要做到这一点，它要求获得，指明它需要所有的许可
证; 该调用将被阻塞，直到它们全部由制作者线程释放。 此时，不变保证没有任何任务仍然写入队列，并且关闭可以完成。

### 实现BlockingQueue

集合框架提供了五个BlockingQueue实现。

#### LinkedBlockingQueue

该类是基于链接节点结构的线程安全的 `FIFO` 排序队列。 只要你需要一个无限制的阻塞队列，就是选择的实现。 即使是有限使用，它仍然可能比 `ArrayBlockingQueue` 更好（链接队列通常比基于阵列的队列具有更高的吞吐量，但在大多数并发应用程序中性能较差）。

两个标准集合构造函数创建一个容量为 `Integer.MAX_VALUE` 的线程安全阻塞队列。 您可以使用第三个构造函数指定较低的容量：

```java
   LinkedBlockingQueue(int capacity)
```

`LinkedBlockingQueue` 施加的顺序是 `FIFO`。 队列插入和移除是在一定的时间内执行的; 诸如需要遍历阵列的包含的操作需要线性时间。 迭代器是弱一致的。

#### ArrayBlockingQueue

该实现基于圆形阵列 - 一种线性结构，其中第一个元素和最后一个元素在逻辑上相邻。图 `14-6`（`a`）显示了这个想法。标有“head”的位置表示队列的头部;每次头元
素被从队列中移除时，头索引被提前。同样，每个新元素都添加在尾部位置，导致该索引被提前。当任何一个索引需要超过数组的最后一个元素时，它将得到值 `0`.如果
两个索引具有相同的值，则队列可以是满或空的，因此实现必须分别跟踪元素的数量在队列中。

头部和尾部可以以这种方式连续前进的圆形阵列比非圆形的更适合作为队列实现（例如，`ArrayList` 的标准实现，我们将在第 `15.2` 节中介绍），其中删除头元素需
要改变所有剩余元素的位置，以便新头位于位置 `0`.注意，只有队列末尾的元素可以在固定时间内插入和移除。如果要从中间移除一个元素，这可以通过 
`Iterator.remove` 方法为队列完成，那么必须从一端移动所有元素以保持紧凑的表示形式。图 `14-6`（`b`）显示了索引 `6` 处的元素被从队列中移除。结果，插
入和移除队列中间的元素的时间复杂度为 `O(n)`。

![](14_6.png)

图 `14-6`。 圆形阵列

数组支持的集合类的构造函数通常具有单个配置参数，即数组的初始长度。对于像 `ArrayBlockingQueue` 这样的固定大小的类，此参数对于定义集合的容量是必需
的。（对于像 `ArrayList` 这样的可变大小的类，可以使用默认的初始容量，因此提供了不需要容量的构造函数。）对于 `ArrayBlockingQueue`，三个构造函数是：

```java
ArrayBlockingQueue(int capacity)
ArrayBlockingQueue(int capacity, boolean fair)
ArrayBlockingQueue(int capacity, boolean fair, Collection<? extends E> c)
```

这些参数的最后一个允许 `ArrayBlockingQueue` 初始化为指定集合的内容，并按集合迭代器的遍历顺序添加。对于此构造函数，指定的容量必须至少与提供的集合的
容量一样大，或者如果提供的集合为空，则至少为 `1`.除了配置 `backing` 数组之外，最后两个构造函数还需要一个布尔参数来控制该队列将处理多个被阻止的请求。
当多个线程尝试从空队列中移除项目或将项目排入完整队列时，会发生这些情况。当队列变得能够处理这些请求中的一个时，它应该选择哪一个？替代方法是要求保证队
列将选择等待时间最长的队列 - 即实现公平的调度策略 - 或者允许实现选择一个。公平调度听起来是更好的选择，因为它避免了不幸的线程可能无限延迟的可能性，但
实际上，它提供的好处很少足够重要，足以证明它会给队列操作带来很大的开销。如果公平没有指定调度，`ArrayBlockingQueue` 通常近似公平操作，但没有保证。

`ArrayBlockingQueue` 施加的顺序是 `FIFO`。队列插入和移除是在一定的时间内执行的;诸如需要遍历阵列的包含的操作需要线性时间。迭代器是弱一致的。

#### PriorityBlockingQueue

这个实现是一个线程安全的 `PriorityQueue` 阻塞版本（参见 `14.2` 节），具有类似的排序和性能特征。 它的迭代器快速失败，所以在正常使用中它们会抛出 
`ConcurrentModificationException`; 只有队列静止才能成功。要在 `PriorityBlockingQueue` 上安全地进行迭代，请将元素传递给数组，然后对其进行迭代。

#### DelayQueue

这是一个专门的优先级队列，其中排序基于每个元素的延迟时间 - 元素准备从队列中取出之前的剩余时间。 如果所有元素都有一个正的延迟时间 - 也就是说，没有任何
关联的延迟时间已过期，那么轮询队列的尝试将返回 `null`（尽管 `peek` 仍然允许您查看第一个未到期的元素）。 如果一个或多个元素的延迟时间已过期，则延迟时
间最长的元素将位于队列头部。`DelayQueue` 的元素属于实现 `java.util.concurrent.Delayed` 的类:

```java
interface Delayed extends Comparable<Delayed> {
  long getDelay(TimeUnit unit);
}
```

`Delayed` 对象的 `getDelay` 方法返回与该对象关联的其余延迟。 必须定义 `Comparable` 的 `compareTo` 方法（请参阅第 `3.1` 节），以提供与所比较对象
的延迟一致的结果。 这意味着它很少与 `equals` 相兼容，所以 `Delayed` 对象不适合用于 `SortedSet` 和 `SortedMap` 的实现。

例如，在我们的待办事项管理人员中，我们可能需要提醒任务，以确保我们跟进尚未回复的电子邮件和电话信息。 我们可以像例 `14-2` 那样定义一个新类 
`DelayedTask`，并用它来实现提醒队列。

```java
BlockingQueue<DelayedTask> reminderQueue = new DelayQueue<DelayedTask>();
reminderQueue.offer(new DelayedTask (databaseCode, 1));
reminderQueue.offer(new DelayedTask (interfaceCode, 2));
...
// 现在获取准备好处理的第一个提醒任务
DelayedTask t1 = reminderQueue.poll();
if (t1 == null) {
// 没有提醒准备好了
} else {
// process t1
}
```

大多数队列操作都遵循延迟值，并且会将没有未过期元素的队列看作是空的。 例外是偷看和删除，这可能令人惊讶的是，将允许您检查 `DelayQueue` 的头元素是否已
过期。 像他们一样，与 `Queue` 的其他方法不同，`DelayQueue` 上的收集操作不考虑延迟值。 例如，以下是将 `reminderQueue` 的元素复制到集合中的两种方
法：

```java
Set<DelayedTask> delayedTaskSet1 = new HashSet<DelayedTask>();
delayedTaskSet1.addAll(reminderQueue);
Set<DelayedTask> delayedTaskSet2 = new HashSet<DelayedTask>();
reminderQueue.drainTo(delayedTaskSet2);
```

集合 `delayedTaskSet1` 将包含队列中的所有提醒，而集合 `delayedTaskSet2` 将只包含准备使用的提醒。

`DelayQueue` 共享它所基于的 `PriorityQueue` 的性能特征，并且像它一样具有快速迭代器。`PriorityBlockingQueue` 迭代器的注释也适用于这些。

#### SynchronousQueue

乍看之下，您可能会认为没有内部容量的队列没有多大意义，这是 `SynchronousQueue` 的简短描述。 但是，实际上，它可能非常有用;想要向 `SynchronousQueue` 
添加元素的线程必须等到另一个线程准备好同时将其取出，并且相反，对于想要 从队列中取出一个元素。 因此，`SynchronousQueue` 具有名称所暗示的功能，即集合
点 - 一种用于同步两个线程的机制。 （不要混淆以这种方式同步线程的概念 - 允许它们通过交换数据来协作 - 与 `Java` 的关键字 `synchronized` 同步，这会阻
止不同线程同时执行代码。）`SynchronousQueue` 有两个构造函数：

```java
SynchronousQueue()
SynchronousQueue(boolean fair)
```

例 `14-2`。 类 `DelayedTask`

```java
public class DelayedTask implements Delayed {
  public final static long MILLISECONDS_IN_DAY = 60 * 60 * 24 * 1000;
  private long endTime; // in milliseconds after January 1, 1970
  private Task task;
  DelayedTask(Task t, int daysDelay) {
    endTime = System.currentTimeMillis() + daysDelay * MILLISECONDS_IN_DAY;
    task = t;
  }
  public long getDelay(TimeUnit unit) {
    long remainingTime = endTime - System.currentTimeMillis();
    return unit.convert(remainingTime, TimeUnit.MILLISECONDS);
  }
  public int compareTo(Delayed t) {
    long thisDelay = getDelay(TimeUnit.MILLISECONDS);
    long otherDelay = t.getDelay(TimeUnit.MILLISECONDS);
    return (thisDelay < otherDelay) ? -1 : (thisDelay > otherDelay) ? 1 : 0;
  }
  Task getTask() { return task; }
}
```

`SynchronousQueue` 的一个常见应用是工作共享系统，其中设计确保有足够的消费者线程来确保生产者线程无需等待即可完成任务。 在这种情况下，它允许在线程之间
安全传输任务数据，而不会导致入队的 `BlockingQueue` 开销，然后出队，传输每个任务。

就 `Collection` 方法而言，`SynchronousQueue` 表现得像一个空的 `Collection`; `Queue` 和 `BlockingQueue` 方法的行为与您对容量为零的队列的期望值
相同，因此它始终为空。 迭代器方法返回一个空的迭代器，其中 `hasNext` 总是返回 `false`。

《《《 [下一节](04_Deque.md)      <br/>
《《《 [返回首页](../README.md)
