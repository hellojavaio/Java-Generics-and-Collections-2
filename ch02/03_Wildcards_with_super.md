《《《 [返回首页](../README.md)     </br>
《《《 [上一节](02_Wildcards_with_extends.md)

### 通配符和超类

- 下面是一个方法，它将方便类集合中的源列表中的所有元素复制到目标列表中：

  ```java
    public static <T> void copy(List<? super T> dst, List<? extends T> src) {
      for (int i = 0; i < src.size(); i++) {
        dst.set(i, src.get(i));
      }
    }
  ```

- 这个奇怪的短语`? super T`意味着目的地列表可能有元素任何类型都是`T`的超类型，
就像源列表可能有任何类型的元素是`T`的子类型:

- 这是一个调用示例：

  ```java
    List<Object> objs = Arrays.<Object>asList(2, 3.14, "four");
    List<Integer> ints = Arrays.asList(5, 6);
    Collections.copy(objs, ints);
    assert objs.toString().equals("[5, 6, four]");
  ```

- 与任何泛型方法一样，可以推断或者可以明确给出类型参数。 在这种情况下，
有四种可能的选择，所有这些类型检查和所有这些都具有相同的效果：

  ```java
    Collections.copy(objs, ints);
    Collections.<Object>copy(objs, ints);
    Collections.<Number>copy(objs, ints);
    Collections.<Integer>copy(objs, ints);
  ```
- 第一次调用离开类型参数隐式; 它被认为是`Integer`，因为这是最有效的选择。 
在第三行中，类型参数`T`取为`Number`。 该调用被允许，因为`objs`的类型是`List<Object>`，
它是`List<? super Number>`的子类型（因为对象是一个数字的超类型，通配符的要求）和整数有`List<Integer>`，
这是`List<? extends Number>`的子类型（因为`Integer`是`Number`的子类型，
正如扩展通配符所要求的那样）。

- 我们也可以用几个可能的签名来声明这个方法。

  ```java
    public static <T> void copy(List<T> dst, List<T> src)
    public static <T> void copy(List<T> dst, List<? extends T> src)
    public static <T> void copy(List<? super T> dst, List<T> src)
    public static <T> void copy(List<? super T> dst, List<? extends T> src)
  ```
- 第一种限制性太强，因为只有当目的地和来源具有完全相同的类型时才允许呼叫。 
其余三个对于使用隐式类型参数的调用是等效的，但是对于显式类型参数不同。 
对于上面的示例调用，第二个签名仅在类型参数为`Object`时起作用，第三个签名仅在类型参数为`Integer`时起作用，
最后一个签名对所有三个类型参数起作用（如我们所见），即`Object` ，`Number`和`Integer`。 
在签名中始终使用通配符，因为这样可以实现最广泛的调用。


《《《 [返回首页](../README.md)