《《《 [返回首页](../README.md)     <p>
《《《 [上一节](00_Subtyping_and_Wildcards.md)

### 子类型化和替代原则

- 子类型化是面向对象语言（如Java）的一个关键特性。 在Java中，一种类型是另一种类型的子类型，如果它们通过扩展或实现子句关联的话。 
这里有些例子：

  ```java
    Integer is a subtype of Number
    Double is a subtype of Number
    ArrayList<E> is a subtype of List<E>
    List<E> is a subtype of Collection<E>
    Collection<E> is a subtype of Iterable<E>
  ```

- 子类型是传递性的，这意味着如果一个类型是一个第二类型的子类型，第二个类型是第三类型的子类型，
那么第一个类型是第三个的子类型。 因此，从前面列表的最后两行可以看出，`List<E>`是`Iterable<E>`的子类型。 
如果一个类型是另一个类型的子类型，我们也可以说第二个类型是第一个类型的超类型。 
每个引用类型都是`Object`的一个子类型，`Object`是每个引用类型的一个超类型。
我们也可以说，每一个类型都是它自己的一个子类型。
  
- 替代原则告诉我们，无论哪种类型的价值，预期的一个可以提供该类型的任何子类型的值：
  - 替代原则：一个给定类型的变量可以被赋予该类型的任何子类型的值，
  并且具有给定类型的参数的方法可以被该类型的任何子类型的变元调用。
  
- 考虑接口`Collection<E>`。 它的一个方法是`add`，它使用`E`类型的参数：  
   
  ```java
    interface Collection<E> {
      public boolean add(E elt);
      ...
    }    
  ```   
- 根据替换原则，如果我们有一个数字集合，我们可以给它添加一个整数或者一个双精度，
因为`Integer`和`Double`是`Number`的子类型. 

  ```java
    List<Number> nums = new ArrayList<Number>();
    nums.add(2);
    nums.add(3.14);
    assert nums.toString().equals("[2, 3.14]"); 
  ```
- 在这里，每种方法调用都使用子类型。 第一个调用是允许的因为`nums`的类型是`List<Number>`，
它是`Collection<Number>`的子类型，而`2`的类型是`Integer`（感谢装箱），这是`Number`的子类型。 
第二个调用同样被允许。 在这两个调用中，`List<E>`中的`E`被视为`Number`。

- 由于`Integer`是`Number`的一个子类型，因此`List<Integer>`是`List<Number>`的子类型。 
但情况并非如此，因为替代原则会使我们很快陷入困境。 将`List<Integer>`类型的值分配给`List<Number>`类型的变量并不总是安全的。 
考虑下面的代码片段：

  ```java
    List<Integer> ints = new ArrayList<Integer>();
    ints.add(1);
    ints.add(2);
    List<Number> nums = ints; // 编译错误
    nums.add(3.14);
    assert ints.toString().equals("[1, 2, 3.14]"); // uh oh!
  ```
- 此代码分配变量`ints`指向一个整数列表，然后分配`nums`指向相同的整数列表; 
因此在第五行中的调用将在这个列表中增加一倍，如最后一行所示。 这不能被允许！ 
通过观察这里的替代原则是不适用的：第四行的赋值是不允许的，因为`List<Integer>`不是`List<Number>`的子类型，
编译器报告第四行是错误的。

- 那反过来呢？ 我们可以把`List<Number>`作为`List<Integer>`的子类型吗？ 
不，那也行不通，如下面的代码所示：

  ```java
    List<Number> nums = new ArrayList<Number>();
    nums.add(2.78);
    nums.add(3.14);
    List<Integer> ints = nums; // 编译错误
    assert ints.toString().equals("[2.78, 3.14]"); // uh oh!
  ```

- 通过观察这里的替代原则是不适用的：第四行的赋值是不允许的，因为`List<Number>`不是`List<Integer>`的子类型，
编译器报告第四行是错误的。

- 所以`List<Integer>`不是`List<Number>`的子类型，`List<Number>`也不是`List<Integer>`的子类型; 
我们所有的只是一个简单的例子，其中`List<Integer>`是它自己的一个子类型，
而且我们也有`List<Integer>`是`Collection<Integer>`的子类型。

- 数组的行为完全不同。 与他们，`Integer[]`是`Number[]`的子类型。 
稍后我们将比较列表和数组的处理方式（参见第2.5节）。

- 有时我们希望列表的行为更像数组，因为我们不仅要接受一个给定类型的元素的列表，
而且也要接受一个具有给定类型的任何子类型的元素的列表。 为此，我们使用通配符。

《《《 [下一节](02_Wildcards_with_extends.md) <p>
《《《 [返回首页](../README.md)