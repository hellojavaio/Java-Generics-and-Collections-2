《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_The_Collection_Interface.md)

### 使用集合方法

为了说明集合类的用法，我们来构造一个小例子。 你的作者永远都想组织起来; 让我们想象一下，我们最新的努力涉及编写我们自己的待办事项经理。我们首先定义一个
表示任务的类，然后用子类表示不同类型的任务，例如编写代码或拨打电话。

以下是我们将要使用的任务的定义：

```java
public abstract class Task implements Comparable<Task> {
  protected Task() {}
  public boolean equals(Object o) {
    if (o instanceof Task) {
      return toString().equals(o.toString());
    } else 
      return false;
  }
  public int compareTo(Task t) {
    return toString().compareTo(t.toString());
  }
  public int hashCode() {
    return toString().hashCode();
  }
  public abstract String toString();
}
```

我们只需要四个任务操作：`equals`，`compareTo`，`hashCode` 和 `toString`。 `Equality` 将用于测试集合是否包含给定任务，比较将被有序集合（如 
`OrderedSet` 和 `OrderedMap`）使用，并且哈希代码将被基于哈希表（例如 `HashSet` 和 `HashMap`）的集合使用，并且每当我们显示集合的内容时，都会使用任
务的字符串表示形式。前三种方法是根据 `toString` 方法定义的，它被声明为抽象的，所以它必须在 `Task` 的每个子类中定义。如果两个任务由同一个字符串表示，
我们认为两个任务相等，任务的自然排序与其字符串排序相同。这保证了任务的自然顺序与平等一致，正如 `3.1` 节所讨论的 - 也就是说，当 `equals` 返回 `true` 
时，`compareTo` 返回 `0`。

我们为两类任务定义子类，编写一些代码并拨打电话：

```java
public final class CodingTask extends Task {
  private final String spec;
  public CodingTask(String spec) {
    this.spec = spec;
  }
  public String getSpec() { 
    return spec; 
  }
  public String toString() { 
    return "code " + spec; 
  }
}
public final class PhoneTask extends Task {
  private final String name;
  private final String number;
  public PhoneTask(String name, String number) {
    this.name = name;
    this.number = number;
  }
  public String getName() { 
    return name; 
  }
  public String getNumber() { 
    return number; 
  }
  public String toString() { 
    return "phone " + name; 
  }
}
```

编码任务由字符串指定，电话任务由要调用的人员的姓名和号码指定。在每种情况下，我们都提供了类的构造函数，访问其字段的方法以及将其转换为字符串的方法。根
据良好的实践，我们已经通过声明这些字段为 `final` 来使这两种任务不可变，并且我们已声明两个子类都是最终的，以便任何人稍后可以定义可变子类（参见“最小化
可变性”/“最喜欢不变性“）由 `Joshua Bloch`，`Addison-Wesley` 撰写的 `Effective Java` 第 `4` 章）。

`toString` 方法将字符串“code”和每个电话任务的每个编码任务的前面加上字符串“phone”。由于第一个字母顺序是按照字母顺序排在第二位，并且由于任务按照 
`toString` 返回的结果排序，编码任务在任务自然排序之前出现在电话任务之前，这符合我们的需求 - 毕竟我们是极客！

为了紧凑，电话任务的 `toString` 方法仅返回要呼叫的人员的姓名，而不是电话号码。我们假设我们从不会创建两个具有相同名称和不同号码的电话任务;如果我们这
样做了，使用 `toString` 返回的结果来测试相等性是错误的。

我们也定义一个空的任务：

```java
public class EmptyTask extends Task {
  public EmptyTask() {}
  public String toString() { 
    return ""; 
  }
}
```

例 `12-1`。 任务管理器的示例任务和任务集合

```java
PhoneTask mikePhone = new PhoneTask("Mike", "987 6543");
PhoneTask paulPhone = new PhoneTask("Paul", "123 4567");
CodingTask databaseCode = new CodingTask("db");
CodingTask interfaceCode = new CodingTask("gui");
CodingTask logicCode = new CodingTask("logic");
Collection<PhoneTask> phoneTasks = new ArrayList<PhoneTask>();
Collection<CodingTask> codingTasks = new ArrayList<CodingTask>();
Collection<Task> mondayTasks = new ArrayList<Task>();
Collection<Task> tuesdayTasks = new ArrayList<Task>();
Collections.addAll(phoneTasks, mikePhone, paulPhone);
Collections.addAll(codingTasks, databaseCode, interfaceCode, logicCode);
Collections.addAll(mondayTasks, logicCode, mikePhone);
Collections.addAll(tuesdayTasks, databaseCode, interfaceCode, paulPhone);
assert phoneTasks.toString().equals("[phone Mike, phone Paul]");
assert codingTasks.toString().equals("[code db, code gui, code logic]");
assert mondayTasks.toString().equals("[code logic, phone Mike]");
assert tuesdayTasks.toString().equals("[code db, code gui, phone Paul]");
```

由于空字符串在字符串上的自然排序中位于所有其他字符串之前，因此空任务在任务的自然排序中位于所有其他字符之前。当我们构造有序集合的范围视图时，这个任务
会很有用（见 `13.2` 节）。

例 `12-1` 展示了我们如何定义一系列要执行的任务（即使在真实系统中，他们更可能从数据库中检索）。我们选择了 `ArrayList` 作为本例中使用的 `Collection` 
的实现，但我们不打算利用列表的任何特殊属性;我们将 `ArrayList` 视为 `Collection` 的实现，仅此而已。作为检索过程的一部分，我们已经使用 `1.4` 节中介
绍的方法 `Collections.addAll` 将这些任务组织到由列表表示的各种类别中。

现在我们可以使用 `Collection` 的方法来处理这些类别。我们在这里介绍的例子按照前面介绍的顺序使用了这些方法。

**添加元素**我们可以将新任务添加到计划中：

```java
mondayTasks.add(new PhoneTask("Ruth", "567 1234"));
assert mondayTasks.toString().equals("[code logic, phone Mike, phone Ruth]");
```

或者我们可以将时间表组合在一起：

```java
Collection<Task> allTasks = new ArrayList<Task>(mondayTasks);
allTasks.addAll(tuesdayTasks);
assert allTasks.toString().equals("[code logic, phone Mike, phone Ruth, code db, code gui, phone Paul]");
```

**删除元素**任务完成后，我们可以从时间表中删除它：

```java
boolean wasPresent = mondayTasks.remove(mikePhone);
assert wasPresent;
assert mondayTasks.toString().equals("[code logic, phone Ruth]");
```

我们可以完全清除一个时间表，因为它的所有任务都已完成（是的，正确的）：

```java
mondayTasks.clear();
assert mondayTasks.toString().equals("[]");
```

删除方法还允许我们以各种方式组合整个集合。 例如，要查看电话以外的其他任务是否安排在星期二，我们可以编写：

```java
Collection<Task> tuesdayNonphoneTasks = new ArrayList<Task>(tuesdayTasks);
tuesdayNonphoneTasks.removeAll(phoneTasks);
assert tuesdayNonphoneTasks.toString().equals("[code db, code gui]");
```

或查看当天计划拨打哪些电话：

```java
Collection<Task> phoneTuesdayTasks = new ArrayList<Task>(tuesdayTasks);
phoneTuesdayTasks.retainAll(phoneTasks);
assert phoneTuesdayTasks.toString().equals("[phone Paul]");
```

最后一个例子可以通过不同的方式获得相同的结果：

```java
Collection<PhoneTask> tuesdayPhoneTasks = new ArrayList<PhoneTask>(phoneTasks);
tuesdayPhoneTasks.retainAll(tuesdayTasks);
assert tuesdayPhoneTasks.toString().equals("[phone Paul]");
```

请注意，`phoneTuesdayTasks` 具有 `List<Task>` 类型，而星期二 `PhoneTasks` 具有更精确的 `List<PhoneTask>` 类型。

这个例子提供了对这个组和下一个方法的签名的解释。我们已经讨论过（第 `2.6` 节），当添加到集合中的方法将它们的参数限制为它的参数类型时，他们为什么会接受 
`Object` 或 `Collection<?>` 类型的参数。以 `retainAll` 为例，它的合同要求删除这个集合中不存在于参数集合中的那些元素。这没有理由限制论证集合可能包
含的内容;在前面的示例中，它可以包含任何种类的任务的实例，而不仅仅是 `PhoneTask`。即使将参数限制为参数类型的超类型的集合也太狭窄了;我们希望可能的限制
性最小的类型是 `Collection<?>。类似的推理适用于 `remove`，`removeAll`，`contains` 和 `containsAll`。

**查询集合的内容**这些方法允许我们检查，例如，上述操作是否正常工作。我们将在这里使用断言来使系统检查我们的信念，即我们已经正确编程了以前的操作。例
如，如果 `tuesdayPhoneTasks` 不包含 `paulPhone`，则第一条语句将抛出一个 `AssertionError`：

```java
assert tuesdayPhoneTasks.contains(paulPhone);
assert tuesdayTasks.containsAll(tuesdayPhoneTasks);
assert mondayTasks.isEmpty();
assert mondayTasks.size() == 0;
```

使集合内容可用于进一步处理此组中的方法为集合提供迭代器或将其转换为数组。

第 `11.1` 节展示了如何在 `Java 5` 中用 `foreach` 语句代替 `iterator` 的最简单和最常见的显式使用，`foreach` 语句隐式使用它们。 但是有一些 
`foreach` 不能帮助迭代的用法; 如果要更改集合的结构而不遇到 `ConcurrentModificationException`，或者想要并行处理两个列表，则必须使用显式迭代器。 例
如，假设我们决定在星期二没有时间进行电话任务。 使用 `foreach` 将它们从我们的任务列表中过滤出来可能会很诱人，但是这不会出于第 `11.1` 节中描述的原因：

```java
// throws ConcurrentModificationException
for (Task t : tuesdayTasks) {
  if (t instanceof PhoneTask) {
    tuesdayTasks.remove(t);
  }
}
```

如果仍然使用修改结构的 `Collection` 方法，则显式使用迭代器并不会有任何改进：

```java
// throws ConcurrentModificationException
for (Iterator<Task> it = tuesdayTasks.iterator() ; it.hasNext() ; ) {
  Task t = it.next();
  if (t instanceof PhoneTask) {
    tuesdayTasks.remove(t);
  }
}
```

但是使用迭代器的结构变化方法给出了我们想要的结果：

```java
for (Iterator<Task> it = tuesdayTasks.iterator() ; it.hasNext() ; ) {
  Task t = it.next();
  if (t instanceof PhoneTask) {
    it.remove();
  }
}
```

例 `12-2`。 使用自然顺序合并集合

```java
public class MergeCollections {
  static <T extends Comparable<? super T>> List<T> merge(Collection<? extends T> c1, Collection<? extends T> c2) {
    List<T> mergedList = new ArrayList<T>();
    Iterator<? extends T> itr1 = c1.iterator();
    Iterator<? extends T> itr2 = c2.iterator();
    T c1Element = getNextElement(itr1);
    T c2Element = getNextElement(itr2);
    // 每次迭代都会从迭代器中取一个任务;继续下去，直到迭代器都没有任何进一步的任务
    while (c1Element != null || c2Element != null) {
      //使用当前的c1元素，如果当前c2
      //元素为null，或者两者都是非空和c1元素
      //以自然顺序在c2元素之前
      boolean useC1Element = c2Element == null ||c1Element != null && c1Element.compareTo(c2Element) < 0;
      if (useC1Element) {
        mergedList.add(c1Element);
        c1Element = getNextElement(itr1);
      } else {
        mergedList.add(c2Element);
        c2Element = getNextElement(itr2);
      }
    }
    return mergedList;
  }
  static <E> E getNextElement(Iterator<E> itr) {
    if (itr.hasNext()){
      E nextElement = itr.next();
      if (nextElement == null) 
        throw new NullPointerException();
      return nextElement;
    } else {
      return null;
    }
  }
}
```

再举一个例子，假设我们是挑剔的人，喜欢按照升序排列我们所有的任务列表，并且我们希望将两个任务列表合并到一个列表中，同时保持顺序。 例 `12-2` 展示了如何
将两个集合合并到第三个集合中，前提是每个集合的迭代器按照自然顺序返回它们的元素。 此方法依赖于要合并的集合不包含空元素的事实; 如果遇到一个，该方法抛出
一个 `NullPointerException`。碰巧，例 `12-1` 中的集合 `mondayTasks` 和 `tuesdayTasks` 都是按升序排列的，我们可以按如下方式合并它们：

```java
Collection<Task> mergedTasks = MergeCollections.merge(mondayTasks, tuesdayTasks);
assert mergedTasks.toString().equals("[code db, code gui, code logic, phone Mike, phone Paul]");
```

《《《 [下一节](02_Implementing_Collection.md)      <br/>
《《《 [返回首页](../README.md)
