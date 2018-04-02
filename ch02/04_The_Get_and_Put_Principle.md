《《《 [返回首页](../README.md)   <br/>
《《《 [上一节](03_Wildcards_with_super.md)

### 获取和放置原则

尽可能插入通配符可能是一个好习惯，但是如何决定使用哪个通配符？ 你应该在哪里使用 `extends`，你应该在哪里使用 `super`，在哪里不适合使用通配符？

幸运的是，一个简单的原则决定哪一个是合适的。

  > 获取和放置原则：当您只将值从结构中取出时，使用扩展通配符，当您只将值放入结构中时使用超级通配符，并且在双方都得到并放置时不使用通配符。

我们已经在复制方法的签名中看到了这个原理：
  
  ```java
    public static <T> void copy(List<? super T> dest, List<? extends T> src)
  ``` 
  
该方法从源 `src` 中获取值，因此使用扩展通配符声明值，并将值放入目标 `dst` 中，因此使用超级通配符声明值。 

无论何时使用迭代器，都会从结构中获取值，因此请使用扩展通配符。 这是一个需要一个数字集合的方法，每个转换为一个双精度求和：  

  ```java
    public static double sum(Collection<? extends Number> nums) {
      double s = 0.0;
      for (Number num : nums) s += num.doubleValue();
      return s;
    }
  ```
  
由于这个使用 `extends`，所有以下的调用是合法的：
  
  ```java
    List<Integer> ints = Arrays.asList(1,2,3);
    assert sum(ints) == 6.0;
    List<Double> doubles = Arrays.asList(2.78,3.14);
    assert sum(doubles) == 5.92;
    List<Number> nums = Arrays.<Number>asList(1,2,2.78,3.14);
    assert sum(nums) == 8.92;
  ```
  
如果不使用 `extends`，前两个调用将不合法
  
每当你使用add方法时，你把值放到一个结构中，所以使用 `super` 通配符。 这是一个采用数字和整数n的集合的方法将从零开始的前n个整数放入集合中：

  ```java
    public static void count(Collection<? super Integer> ints, int n) {
      for (int i = 0; i < n; i++) ints.add(i);
    }
  ```

由于这使用 `super`，以下所有调用都是合法的：

  ```java
    List<Integer> ints = new ArrayList<Integer>();
    count(ints, 5);
    assert ints.toString().equals("[0, 1, 2, 3, 4]");
    List<Number> nums = new ArrayList<Number>();
    count(nums, 5); nums.add(5.0);
    assert nums.toString().equals("[0, 1, 2, 3, 4, 5.0]");
    List<Object> objs = new ArrayList<Object>();
    count(objs, 5); objs.add("five");
    assert objs.toString().equals("[0, 1, 2, 3, 4, five]");
  ```

如果 `super` 不被使用，最后两个调用将是不合法的。无论何时您将值放入并从同一结构中获取值，都不应使用通配符。
  
  ```java
    public static double sumCount(Collection<Number> nums, int n) {
      count(nums, n);
      return sum(nums);
    }
  ```
  
集合被传递给 `sum` 和 `count`，所以它的元素类型都必须继承 `Number`（按总数要求），`Integer` 的超类（按计数要求）。 唯一满足这两个约束的两个类是
`Number` 和 `Integer`，我们选择了第一个。 以下是一个调用示例：
  
  ```java
    List<Number> nums = new ArrayList<Number>();
    double sum = sumCount(nums,5);
    assert sum == 10;
  ```
  
由于没有通配符，参数必须是 `Number` 的集合。  

如果您不喜欢在 `Number` 和 `Integer` 之间进行选择，那么您可能会想到，如果 `Java` 允许您使用 `extends` 和 `super` 编写通配符，则不需要选择。 例
如，我们可以写下以下内容：

  ```java
    double sumCount(Collection<? extends Number super Integer> coll, int n)
    // 这在java里面是非法的
  ```
  
然后我们可以在一个数字集合或一个整数集合上调用 `sumCount`。 但 `Java` 不允许这样做。 打乱它的唯一原因是简单，可以想象 `Java` 在将来可能会支持这种表
示法。 但是，现在，如果你想同时获取和放置不要使用通配符。
  
获取和放置原则也是相反的。 如果扩展通配符存在，几乎所有的都是获取但不是放置类型的值;如果存在一个超级通配符，几乎所有你能够做的就是放置，但是不能获得
这种类型的值。
    
例如，考虑下面的代码片段，它使用一个用扩展通配符声明的列表：    
  
  ```java
    List<Integer> ints = new ArrayList<Integer>();
    ints.add(1);
    ints.add(2);
    List<? extends Number> nums = ints;
    double dbl = sum(nums); // ok
    nums.add(3.14); // compile-time error
  ```
  
调用它求和是好的，因为它从列表中获取值，但调用 `add` 的不是，因为它将一个值放入列表中。 这也是一样，因为否则我们可以添加双整数列表！相反，考虑下面的
代码片段，它使用一个超级通配符声明的列表：
  
  ```java
    List<Object> objs = new ArrayList<Object>();
    objs.add(1);
    objs.add("two");
    List<? super Integer> ints = objs;
    ints.add(3); // ok
    double dbl = sum(ints); // 编译报错
  ```
  
现在调用 `add` 是正常的，因为它将一个值放入列表中，但是对 `sum` 的调用不是，因为它从列表中获取值。 这也是一样，因为包含一个字符串的列表的总和是没有
意义的！  

例外证明了这个规则，而且每个规则都有一个例外。 你不能把任何东西放到用扩展通配符声明的类型中 -- 除了属于每个引用类型的值为 `null`：
  
  ```java
    List<Integer> ints = new ArrayList<Integer>();
    ints.add(1);
    ints.add(2);
    List<? extends Number> nums = ints;
    nums.add(null); // ok
    assert nums.toString().equals("[1, 2, null]");
  ```
  
同样，你也不能从使用超级通配符声明的类型中获取任何东西 - 除了 `Object` 类型的值，它是每个引用类型的超类型：   
  
  ```java
    List<Object> objs = Arrays.<Object>asList(1,"two");
    List<? super Integer> ints = objs;
    String str = "";
    for (Object obj : ints) str += obj.toString();
    assert str.equals("1two");
  ```
  
你可能会觉得有帮助的想法？ 将 `T` 扩展为包含每个类型的一个区间，该区间由下面的 `null` 类型和上面的 `T`（其中 `null` 的类型是每个引用类型的子类型）
限定。 同样，你可能会想到？ `super T` 包含每个类型在由 `T` 和由上面的 `Object` 限定的区间中。

认为扩展通配符确保不变性是诱人的，但事实并非如此。正如我们前面看到的，给定一个列表 `List <? extends Number>`，你仍然可以添加 `null` 值列表。 您也
可以删除列表元素（使用 `remove`，`removeAll` 或 `retainAll`）或对列表进行置换（在便捷类集合中使用交换，排序或随机操作;参见第 `17.1.1` 节）。 如果
要确保列表不能更改，请使用类 `Collections` 中的 `unmodifiableList` 方法; 其他集合类也有类似的方法（见 `17.3.2` 节）。 如果你想确保列表元素不能被
改变，可以考虑按照 `Joshua Bloch` 在他的书第四章有效 `Java`（`Addison-Wesley`）（“最小化可变性”/“Favour不变性”）中给出的类不可变的规则。; 例如，
在第二部分中，第 `12.1` 节中的类 `CodingTask` 和 `PhoneTask` 是不可变的，就像第 `13.2` 节中的类 `PriorityTask` 一样。
  
因为 `String` 是 `final` 的，并且可以没有子类型，所以您可能期望 `List <String>` 与 `List <? extends String>` 是相同的类型。 但实际上前者是后者
的一个子类型，但不是同样的类型，正如应用我们的原则所能看到的那样。 替代原则告诉我们这是一个子类型，因为传递前者类型的值是可以的。 获取和放置原则告诉
我们它不是相同的类型，因为我们可以添加一个字符串到前一个类型的值而不是后一个。  
  
  
《《《 [上一节](05_Arrays.md)   <br/>
《《《 [返回首页](../README.md)
