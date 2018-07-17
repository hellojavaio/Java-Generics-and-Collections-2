《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_Maps.md)

### 使用Map的方法

正如我们在前两章中所做的那样，将待办事项管理器置于优先级队列中的一个问题是优先级队列无法保留将元素添加到它们的顺序（除非可以按优先级顺序 例如作为时间
戳或序列号）。 为了避免这种情况，我们可以使用一系列 `FIFO` 队列作为替代模型，每个队列分配一个优先级。 一个 `Map` 适合于保持优先级与任务队列之间的关
联; 特别是 `EnumMap` 是一个高效的 `Map` 实现，专门用于与枚举成员关键字一起使用。

该模型将依赖于保持 `FIFO` 排序的队列实现。 为了关注 `Map` 方法的使用，我们假设一个单线程客户端并使用一系列 `ArrayDeques` 作为实现：

```java
Map<Priority,ArrayDeque<Task>> taskMap = new EnumMap<Priority,ArrayDeque<Task>>(Priority.class);
for (Priority p : Priority.values()) {
  taskMap.put(p, new ArrayDeque<Task>());
}
// 填充列表，例如：
taskMap.get(Priority.MEDIUM).add(mikePhone);
taskMap.get(Priority.HIGH).add(databaseCode);
```

现在，要进入任务队列之一 - 比如说具有最高优先级任务的队列 - 我们可以这样写：

```java
Queue<Task> highPriorityTaskList = taskMap.get(Priority.HIGH);
```

轮询此队列现在将按照它们进入系统的顺序为我们提供高优先级待办事项。

为了看到其他一些 `Map` 方法的使用，让我们稍微扩展一下这个例子，以允许这些任务中的一些实际上可以通过计费赚取一些钱。 表示这种方法的一种方法是定义一个
类 `Client`：

```java
class Client {...}
Client acme = new Client("Acme Corp.",...);
```

并创建从任务到客户的映射：

```java
Map<Task,Client> billingMap = new HashMap<Task,Client>();
billingMap.put(interfaceCode, acme);
```

我们需要确保系统仍然可以处理无法填写的任务。我们在这里有一个选择：我们可以简单地将不可填写任务的名称添加到 `billingMap` 中，也可以将其映射为 
`null`。无论哪种情况，作为处理任务 `t` 的代码的一部分，我们可以写出：

```java
Task t = ...
Client client = billingMap.get(t);
if (client != null) {
  client.bill(t);
}
```

当我们终于完成了我们的客户 `Acme Corp`.承包的所有工作时，可以删除将任务与 `Acme` 关联的 `Map` 条目：

```java
Collection<Client> clients = billingMap.values();
for (Iterator<Client> iter = clients.iterator() ; iter.hasNext() ; ) {
  if (iter.next().equals(acme)) {
    iter.remove();
  }
}
```

整洁的替代方法利用方法 `Collections.singleton`（参见 `17.2` 节），该方法返回一个只包含指定元素的不可变 `Set`：

```java
clients.removeAll(Collections.singleton(acme));
```

这两种方法的成本都是 `O(n)`，`Sun` 在当前的实施中具有类似的常数因子。

《《《 [下一节](02_Implementing_Map.md)      <br/>
《《《 [返回首页](../README.md)
