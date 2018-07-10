《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](../ch12/03_Collection_Constructors.md)

## Sets

一个集合是不能包含重复项目的集合; 如果它已经存在于集合中，则添加它不起作用。`Set` 接口的方法与 `Collection` 的方法相同，但它是分开定义的，以允许以这种
方式更改 `add`（和 `addAll`，这是用 `add` 定义的）合约。 回到上一章中的任务管理器示例，假设星期一您有空闲时间执行电话任务。 您可以通过将所有电话任务添
加到星期一任务来进行相应的收集。 让 `mondayTasks` 和 `phone` 任务如例 `12-1` 中所声明的那样。 使用一个集合（再次选择一个方便常见的 `Set` 实现），你
可以写：

```java
Set<Task> phoneAndMondayTasks = new TreeSet<Task>(mondayTasks);
phoneAndMondayTasks.addAll(phoneTasks);
assert phoneAndMondayTasks.toString().equals("[code logic, phone Mike, phone Paul]");
```

这是因为处理重复元素的方式。 在星期一任务和电话任务中的任务麦克电话，只有一次出现在 `phoneAndMondayTasks` 中 - 你绝对不希望两次完成所有这些任务！

《《《 [下一节](01_Implementing_Set.md)      <br/>
《《《 [返回首页](../README.md)
