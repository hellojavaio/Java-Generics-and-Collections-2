《《《 [返回首页](../README.md)

### 泛型方法和可变参数

- 这是接受任何类型的数组并将其转换为列表的方法：

  ```java
    class Lists {
      public static <T> List<T> toList(T[] arr) {
      List<T> list = new ArrayList<T>();
      for (T elt : arr) list.add(elt);
        return list;
      }
    }
  ```
- 静态方法`toList`接受一个`T[]`类型的数组并返回一个类型列表`List<T>`，并且对于任何类型T都这样做。
这通过在开头写入`<T>`来指示方法签名，它将`T`声明为一个新的类型变量。 一种方法用这种方式声明一个类型变量被称为泛型方法。 
类型的范围变量`T`对于方法本身是本地的; 它可能出现在方法签名和方法体，但不在方法之外。  

- 该方法可以如下调用：
 
  ```java
    List<Integer> ints = Lists.toList(new Integer[] { 1, 2, 3 });
    List<String> words = Lists.toList(new String[] { "hello", "world" });
  ```
  在第一行中，装箱将`int`，`1,2,3`转换为`Integer`。

- 将参数打包到一个数组中是非常麻烦的。 对于方法的最后一个参数是数组的情况，可变参数特性允许使用一种特别的，
更方便的语法。 要使用这个特性，我们在方法声明中用`T...`替换`T[]`：  

  ```java
    class Lists {
      public static <T> List<T> toList(T... arr) {
      List<T> list = new ArrayList<T>();
      for (T elt : arr) list.add(elt);
        return list;
      }
    }
  ```
  现在该方法可以被调用，如下所示：
  ```java
    List<Integer> ints = Lists.toList(1, 2, 3);
    List<String> words = Lists.toList("hello", "world");
  ```
  这只是我们上面写的内容的简写。 在运行时，参数就像以前一样被打包到传递给方法的数组中。

- 任何数量的参数都可以在最后的可变参数之前。 这是一个方法，接受一个列表，并将所有附加参数添加到列表的末尾：

  ```java
    public static <T> void addAll(List<T> list, T... arr) {
      for (T elt : arr) list.add(elt);
    }
  ```
  
- 每当声明可变参数时，可以将参数列表传递给数组，或直接显式传递数组。 因此，可以如下调用前面的方法：  
  
  ```java
    List<Integer> ints = new ArrayList<Integer>();
    Lists.addAll(ints, 1, 2);
    Lists.addAll(ints, new Integer[] { 3, 4 });
    assert ints.toString().equals("[1, 2, 3, 4]");
  ```
  
- 我们稍后会看到，当我们尝试创建一个包含泛型类型的数组时，我们总是会收到一个未经检查的警告。 
由于可变参数总是创建一个数组，所以只有在参数没有泛型时才能使用它们（见6.8节）。  
  
- 在前面的例子中，泛型方法的类型参数被推断出来，但是也可以被明确给出，如下面的例子所示：
  
  ```java
    List<Integer> ints = Lists.<Integer>toList();
    List<Object> objs = Lists.<Object>toList(1, "two");
  ```

- 显式参数通常不是必需的，但是在这里给出的例子中它们是有帮助的。 在第一个例子中，
如果没有类型参数，那么`Sun`的编译器用来推断正确类型的类型推断算法的信息就太少了。 
它推断`toList`的参数是一个任意泛型类型的空数组，而不是一个空整型数组，
这触发了前面描述的未经检查的警告。 （`Eclipse`编译器使用不同的推理算法，
并在没有显式参数的情况下正确地编译相同的行。）在第二个示例中，没有类型参数，
类型推理算法的信息太多，无法推断出正确的类型。 你可能会认为`Object`是唯一一个整数和字符串有共同的类型，
但实际上它们都实现了`Serializable`和`Comparable`接口。 类型推断算法不能选择这三种中的哪一种是正确的类型。  
  
- 一般来说，下面的经验法则就足够了：在对通用方法的调用中，如果存在的话是一个或多个参数对应于一个类型参数，
他们都有相同的类型，那么可以推断出类型参数; 如果没有对应于类型参数的参数，
或者参数属于预期类型的不同子类型，则必须明确给出类型参数。
  
- 当一个类型参数传递给泛型方法调用时，它将以角度出现括号在左边，就像在方法声明中一样。
`Java`语法要求类型参数只能出现在使用虚线形式的方法调用中。 即使方法`toList`在调用代码的同一个类中定义，
我们也不能缩短它如下：  
 
  ```java
     List<Integer> ints = <Integer>toList(); // 编译报错
  ```
  这是非法的，因为它会混淆解析器。  
  
- 方法集合框架中的`Arrays.asList`和`Collections.addAll`是类似于之前显示的`toList`和`addAll`。 
（这两个类都在`java.util`包中）`asList`的集合框架版本不返回`ArrayList`，而是返回由给定数组支持的专用列表类。 
此外，其版本的`addAll`作用于一般集合，而不仅仅是列表。
  
《《《 [返回首页](../README.md)