《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](07_Wildcard_Capture.md)
 
 通配符可能不会出现在类实例创建表达式（新建）的顶层，泛型方法调用中的显式类型参数或超类型（扩展和实现）中。
 
 **实例创建**在类实例创建表达式中，如果类型是参数化类型，则没有任何类型参数可能是通配符。 例如，以下是非法的：
 
    ```java
       List<?> list = new ArrayList<?>(); // 编译报错
       Map<String, ? extends Number> map = 
       new HashMap<String, ? extends Number>(); // 编译报错
    ```
    
这通常不是困难。 `Get` 和 `Put` 原则告诉我们，如果一个结构体包含通配符，那么我们只应该从中得到值（如果它是一个扩展通配符）或者只将值放入它中（如果它
是一个超级通配符）。 为了使结构有用，我们必须同时做到这两点。 因此，我们通常以精确的类型创建结构，即使我们使用通配符类型将值放入或从结构中获取值，如
下例所示：    

    ```java
       List<Number> nums = new ArrayList<Number>();
       List<? super Number> sink = nums;
       List<? extends Number> source = nums;
       for (int i=0; i<10; i++) sink.add(i);
       double sum=0; for (Number num : source) sum+=num.doubleValue();
    ```
    
这里通配符出现在第二行和第三行，但不在创建列表的第一行。

禁止包含通配符的实例创建中只有顶级参数。 允许嵌套通配符。 因此，以下是合法的：
         
    ```java
       List<List<?>> lists = new ArrayList<List<?>>();
       lists.add(Arrays.asList(1,2,3));
       lists.add(Arrays.asList("four","five"));
       assert lists.toString().equals("[[1, 2, 3], [four, five]]");    
    ```   
          
即使列表的列表是以通配符类型创建的，其中的每个单独列表都有一个特定的类型：第一个列表是整数列表，第二个列表是字符串列表。 通配符类型禁止我们将内部列表
中的元素作为 `Object` 以外的任何类型提取，但由于这是 `toString` 使用的类型，因此此代码的类型很好。  

记住限制的一种方式是通配符和普通类型之间的关系类似于接口和类通配符之间的关系，接口更普遍，普通类型和类更具体，实例创建需要更具体的信息。 考虑以下三条
陈述：  

    ```java
       List<?> list = new ArrayList<Object>(); // ok
       List<?> list = new List<Object>() // 编译报错
       List<?> list = new ArrayList<?>() // 编译报错
    ```
    
第一个是合法的; 第二个是非法的，因为实例创建表达式需要一个类，而不是一个接口; 第三个是非法的，因为实例创建表达式需要普通类型而不是通配符。
    
你可能想知道为什么这个限制是必要的。 `Java` 设计人员记住，每种通配符类型都是一些普通类型的简写，所以他们相信最终每个对象都应该使用普通类型创建。 目前
尚不清楚这种限制是否有必要，但这不太可能成为问题。 （我们努力想办法解决这个问题，但是我们失败了！）

**泛型方法调用**如果泛型方法调用包含显式类型参数，那么这些类型参数不能是通配符。 例如，假设我们有以下通用方法：

    ```java
       class Lists {
          public static <T> List<T> factory() { return new ArrayList<T>(); }
       }
    ```  

您可以选择推断的类型参数，也可以传递一个明确的类型参数。 以下两项都是合法的：
        
    ```java
       List<?> list = Lists.factory();
       List<?> list = Lists.<Object>factory();
    ```
    
如果传递一个显式的类型参数，它不能是通配符：
    
  ```java
       List<?> list = Lists.<?>factory(); // 编译报错
  ```    
    
和以前一样，可以使用嵌套通配符：

  ```java
       List<List<?>> = Lists.<List<?>>factory(); // ok
  ```  
         
这种限制的动机与之前的相似。 再次，目前还不清楚是否有必要，但这不太可能成为问题。

**超类**在创建类实例时，它会为其超类型调用初始值设定项。 因此，适用于实例创建的任何限制也必须适用于超类型。在类声明中，如果超类型或任何超级接口具有类
型参数，则这些类型不能是通配符。例如，这个声明是非法的：

  ```java
       class AnyList extends ArrayList<?> {...} // 编译报错
  ``` 
  
这也是：

  ```java
       class AnotherList implements List<?> {...} // 编译报错
  ```   
    
但是，像以前一样，嵌套通配符是允许的：    
    
    ```java
       class NestedList extends ArrayList<List<?>> {...} // ok
    ```      

这种限制的动机与前两种类似。 与以前一样，目前还不清楚是否有必要，但不太可能成为问题。
  
《《《 [下一节](ch03/00_Comparison_and_Bounds.md)      <br/>
《《《 [返回首页](../README.md)    
