《《《 [返回首页](../README.md)

### 通配符和继承

- `Collection`接口中的另一个方法是`addAll`，它将一个集合的所有成员添加到另一个集合中：
  
  ```java
    interface Collection<E> {
      ...
      public boolean addAll(Collection<? extends E> c);
      ...
    }
  ```
- 显然，给定`E`类型的元素的集合，可以将另一个集合的所有成员添加到`E`类型的元素中。
这个古怪的短语`? extends E`意味着也可以添加元素任何类型都是`E`的子类型的所有成员 。
问号称为通配符，因为它代表某种类型，它是`E`的子类型。

- 这是一个例子。 我们创建一个空的数字列表，并首先添加一个整数列表，
然后是一个双精度列表：

  ```java
    List<Number> nums = new ArrayList<Number>();
    List<Integer> ints = Arrays.asList(1, 2);
    List<Double> dbls = Arrays.asList(2.78, 3.14);
    nums.addAll(ints);
    nums.addAll(dbls);
    assert nums.toString().equals("[1, 2, 2.78, 3.14]");
  ```

- 第一个调用是允许的，因为`nums`的类型是`List<Number>`，它是`Collection<Number>`的子类型，
而`ints`的类型是`List<Integer>`，它是`Collection`的子类型`Collection<? extends Number>`。 
第二个调用同样被允许。 在这两个调用中，`E`被认为是`Number`。 如果`addAll`的方法签名没有使用通配符，
那么将不允许添加整数列表和双精度列表的调用; 你只能添加一个明确声明为数字列表的列表。

- 声明变量时我们也可以使用通配符。 下面是上一节末尾的示例变体，通过在第二行添加通配符进行更改：

  ```java
    List<Integer> ints = new ArrayList<Integer>();
    ints.add(1);
    ints.add(2);
    List<? extends Number> nums = ints;
    nums.add(3.14); // 编译报错
    assert ints.toString().equals("[1, 2, 3.14]"); // uh oh!
  ```
- 之前，第四行导致了一个编译时错误（因为`List<Integer>`不是`List<Number>`的子类型），
但是第五行没有问题（因为`double`是一个数字，所以你可以添加一个`double`到一个`List<Number>`）。 
现在，第四行是正确的（因为`List<Integer>`是`List<? extends Number>`的子类型），
但是第五行会导致编译时错误（因为您不能将一个`double`添加到`List<? extends Number>` ，
因为它可能是一些其他的数字子类型的列表）。 和以前一样，最后一行显示为什么之前的行是非法的！

- 一般来说，如果一个结构包含一个表单类型的元素？ 扩展`E`，我们可以从结构中获得元素，
但是我们不能将元素放入结构中。 为了将元素放入结构中，我们需要使用另一种通配符，
如下一节所述。


《《《 [返回首页](../README.md)