《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_Effective_Generics.md)

### 调用遗留代码时要小心

正如我们所看到的，泛型类型在编译时被检查，而不是运行时。 通常，这正是我们想要的，因为在编译时检查会更早地报告错误，并且不会导致运行时开销。 但是，有
时这可能不合适，因为我们无法确定编译时检查是否足够（比如说，因为我们将参数化类型的实例传递给旧客户端或我们不信任的客户端 ），还是因为我们在运行时需要
关于类型的信息（比如说，因为我们需要一个可重用类型作为数组组件）。 一个托收集合通常会诀窍，如果不行，我们可以创建一个专门的类。 我们考虑本节中的已检
查集合，下一节中的安全问题以及之后的部分中的专门类。

考虑一个遗留库，其中包含将项目添加到给定列表并返回包含给定项目的新列表的方法：

```java
class LegacyLibrary {
  public static void addItems(List list) {
    list.add(new Integer(1)); 
    list.add("two");
  }
  public static List getItems() {
    List list = new ArrayList();
    list.add(new Integer(3)); 
    list.add("four");
    return list;
  }
}
```

现在考虑一个使用这个遗留库的客户端，被告知（不正确）这些项目总是整数：

```java
class NaiveClient {
  public static void processItems() {
    List<Integer> list = new ArrayList<Integer>();
    Legacy Library.addItems(list);
    List<Integer> list2 = LegacyLibrary.getItems(); // unchecked
    // sometime later ...
    int s = 0;
    for (int i : list) s += i; //  类抛出异常
    for (int i : list2) s += i; // 类抛出异常 
  }
}
```

将整数列表传递给方法 `addItems` 时没有警告，因为参数化类型 `List<Integer>` 被认为是 `List` 的一个子类型。由 `getItems` 返回的列表从 `List` 到 
`List<Integer>` 的转换确实发出未经检查的警告。在运行时，尝试从这些列表中提取数据时会引发类转换异常，因为将转换类型为 `Integer` 隐式插入通过擦除将会
失败。 （这些强制转换的失败并不构成对铸铁保证的违反，因为这种保证不适用于存在遗留代码或未经检查的警告。）因为异常引发远离字符串添加的地方到列表中，该
错误可能很难查明。

如果通过应用最小改变或存根技术使遗留文库得到了生化（参见第 `5.4.1` 节和第 `5.4.2` 节），那么只要泛型类型被正确赋值，这些问题就不会出现。

一个不那么客观的客户可能会设计出更早捕获错误并且更易于调试的代码。

```java
class WaryClient {
  public static void processItems() {
    List<Integer> list = new ArrayList<Integer>();
    List<Integer> view = Collections.checkedList(list, Integer.class);
    LegacyLibrary.addItems(view); // 类抛出异常 
    List<Integer> list2 = LegacyLibrary.getItems(); // unchecked
    for (int i : list2) {} // 类抛出异常 
    // sometime later ...
    int s = 0;
    for (int i : list) s += i;
    for (int i : list2) s += i;
  }
}
```

方便类集合中的 `checkedList` 方法获取列表和类标记并返回列表的已选中视图; 每当尝试向检查的视图添加一个元素时，反射用于检查该元素是否属于指定的类，然
后将其添加到基础列表（请参阅第 `17.3.3` 节）。 使用已检查的列表视图将导致在尝试向列表中添加字符串时，在方法 `addItems` 内引发类转换异常。由于方法 
`getItems` 创建自己的列表，客户端不能以相同的方式使用包装器。 但是，在返回列表的位置添加一个空循环可以保证错误被捕获到接近有问题的方法调用。

仅当列表元素具有可确定类型时，检查列表才提供有用的保证。 如果你想在列表不是可确定类型时应用这些技术，你可能需要考虑应用 `8.3` 节的专门化技术。

《《《 [下一节](02_Use_Checked_Collections_to_Enforce_Security.md)      <br/>
《《《 [返回首页](../README.md)
