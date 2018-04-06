


## 比较队列实现

表 `14-1` 显示了我们讨论的 `Deque` 和 `Queue` 实现的一些示例操作的顺序性能，不考虑锁定和 `CAS` 开销。这些结果对于理解您选择的实现的行为而言应该很有意思，但正如我们在本章开头提到的那样，它们不可能是决定性因素。 您的选择更可能取决于应用程序的功能和并发性要求。

在选择队列时，首先要问的问题是你选择的实现是否需要支持并发访问; 如果不是，你的选择很简单。 对于 `FIFO` 排序，请选择 `ArrayDeque`; 优先级排序，`PriorityQueue`。

如果您的应用程序确实需要线程安全性，则您需要考虑订购。 如果您需要优先级或延迟排序，则显然必须分别选择 `PriorityBlockingQueue` 或 `DelayQueue`。另一方面，如果 `FIFO` 排序是可以接受的，则第三

表 `14-1`。不同 `Queue` 和 `Deque` 实现的比较性能

　  　                  |offer     | peek     | poll      | size
---                    |---       |---       |---        |---
PriorityQueue          |O(log n)  | O(1)     | O(log n)  | O(1)
ConcurrentLinkedQueue  |O(1)      | O(1)     | O(1)      | O(n)
ArrayBlockingQueue     |O(1)      | O(1)     | O(1)      | O(1)
LinkedBlockingQueue    |O(1)      | O(1)     | O(1)      | O(1)
PriorityBlockingQueue  |O(log n)  | O(1)     | O(log n)  | O(1)
DelayQueue             |O(log n)  | O(1)     | O(log n)  | O(1)
LinkedList             |O(1)      | O(1)     | O(1)      |O(1)
ArrayDeque             |O(1)      | O(1)     | O(1)      |O(1)
LinkedBlockingDeque    |O(1)      | O(1)     | O(1)      |O(1)

问题在于你是否需要阻塞方法，就像你通常为生产者 - 消费者问题所做的那样（要么是因为消费者必须通过等待来处理一个空队列，要么是因为想通过限制队列限制对它们的需求，然后生产者有时必须等待）。如果您不需要阻塞方法或队列大小的限制，请选择高效且免等待的 `ConcurrentLinkedQueue`。

如果您确实需要阻塞队列，因为您的应用程序需要支持生产者与消费者的协作，请暂停以考虑是否真的需要缓冲数据，或者您是否需要在线程之间安全地交换数据。如果您可以不使用缓冲（通常是因为您确信会有足够的消费者来防止数据堆积），那么 `SynchronousQueue` 是剩余 `FIFO` 阻止实现 `LinkedBlockingQueue` 和 `ArrayBlockingQueue` 的有效替代方案。

否则，我们终于留下了这两者之间的选择。如果无法修复队列大小的实际上限，则必须选择 `LinkedBlockingQueue`，因为 `ArrayBlockingQueue` 总是有界的。对于有限使用，您将根据性能在两者之间进行选择。它们在图 `14-1` 中的性能特点是相同的，但这些只是顺序访问的公式;它们在并发使用中的表现是一个不同的问题。正如我们上面提到的，如果超过三个或四个线程正在服务，`LinkedBlockingQueue` 总体上比 `ArrayBlockingQueue` 更好。这符合 `LinkedBlockingQueue` 的头部和尾部被独立锁定的事实，允许同时更新两端。另一方面，`ArrayBlockingQueue` 不必为每个插入分配新的对象。如果队列性能对于您的应用程序的成功至关重要，那么您应该使用对您来说最重要的基准来衡量这两个实现：您的应用程序本身。

