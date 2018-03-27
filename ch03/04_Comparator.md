# 比较

有时候我们想要比较没有实现 `Comparable` 接口的对象，或者使用与该接口指定的不同顺序来比较对象。 由 `Comparable` 接口提供的顺序称为自然顺序，所以 `Comparator` 接口可以说是一种不自然的顺序。 

我们使用 `Comparator` 接口指定附加排序，它包含两种方法：

```java
   interface Comparator<T> {
     public int compare(T o1, T o2);
     public boolean equals(Object obj);
   }
```

根据第一个对象是否小于，等于或大于第二个对象，`compare` 方法返回一个负值，零或正的值 - 就像 `compareTo` 一样。 （`equals` 方法是类 `Object` 所熟悉的方法;它包含在接口中，用于提醒实现者相同的比较器必须具有强制执行相同排序的比较方法。）

例3-1。 允许苹果与橘子进行比较

```java
   abstract class Fruit implements Comparable<Fruit> {
     protected String name;
     protected int size;
     protected Fruit(String name, int size) {
       this.name = name; this.size = size;
	 }
	 public boolean equals(Object o) {
	   if (o instanceof Fruit) {
	     Fruit that = (Fruit)o;
	     return this.name.equals(that.name) && this.size == that.size;
       } else 
	     return false;
    }
    public int hashCode() {
      return name.hashCode()*29 + size;
    }
    public int compareTo(Fruit that) {
      return this.size < that.size ? - 1 :
      this.size == that.size ? 0 : 1 ;
    }
  }
  class Apple extends Fruit {
    public Apple(int size) { super("Apple", size); }
  }
  class Orange extends Fruit {
    public Orange(int size) { super("Orange", size); }
  }
  class Test {
    public static void main(String[] args) {
      Apple a1 = new Apple(1); 
	  Apple a2 = new Apple(2);
      Orange o3 = new Orange(3); 
	  Orange o4 = new Orange(4);
      List<Apple> apples = Arrays.asList(a1,a2);
      assert Collections.max(apples).equals(a2);
      List<Orange> oranges = Arrays.asList(o3,o4);
      assert Collections.max(oranges).equals(o4);
      List<Fruit> mixed = Arrays.<Fruit>asList(a1,o3);
      assert Collections.max(mixed).equals(o3); // ok
    }
  }
```

例3-2。 禁止苹果与橘子进行比较

```java
   abstract class Fruit {
     protected String name;
     protected int size;
     protected Fruit(String name, int size) {
       this.name = name; this.size = size;
     }
     public boolean equals(Object o) {
       if (o instanceof Fruit) {
         Fruit that = (Fruit)o;
         return this.name.equals(that.name) && this.size == that.size;
       } else 
	     return false;
     }
    public int hashCode() {
      return name.hashCode()*29 + size;
    }
    protected int compareTo(Fruit that) {
      return this.size < that.size ? -1 :
      this.size == that.size ? 0 : 1 ;
    }
   }
   class Apple extends Fruit implements Comparable<Apple> {
     public Apple(int size) { super("Apple", size); }
     public int compareTo(Apple a) { return super.compareTo(a); }
   }
   class Orange extends Fruit implements Comparable<Orange> {
     public Orange(int size) { super("Orange", size); }
     public int compareTo(Orange o) { return super.compareTo(o); }
   }
   class Test {
     public static void main(String[] args) {
       Apple a1 = new Apple(1); Apple a2 = new Apple(2);
       Orange o3 = new Orange(3); Orange o4 = new Orange(4);
       List<Apple> apples = Arrays.asList(a1,a2);
       assert Collections.max(apples).equals(a2);
       List<Orange> oranges = Arrays.asList(o3,o4);
       assert Collections.max(oranges).equals(o4);
       List<Fruit> mixed = Arrays.<Fruit>asList(a1,o3);
       assert Collections.max(mixed).equals(o3); // 编译报错
     }
   }
```

这是一个比较器，它认为两个字符串中较短的字符串较小。 只有两个字符串具有相同的长度时，才会使用自然（字母）排序进行比较。

```java
   Comparator<String> sizeOrder =
     new Comparator<String>() {
       public int compare(String s1, String s2) {
         return
           s1.length() < s2.length() ? -1 :
           s1.length() > s2.length() ? 1 :
           s1.compareTo(s2) ;
     }
   };
```

这里是一个例子：

```java
   assert "two".compareTo("three") > 0;
   assert sizeOrder.compare("two","three") < 0;
```

在自然字母顺序中，“two”大于“three”，而在大小排序中它更小。

`Java` 库总是提供 `Comparable` 和 `Comparator` 之间的选择。 对于每个带有由 `Comparable` 限定的类型变量的泛型方法，还有另一个类型为 `Comparator` 的参数的泛型方法。 例如，对应于：

```java
   public static <T extends Comparable<? super T>>
   T max(Collection<? extends T> coll)
```

我们还有：

```java
   public static <T> T max(Collection<? extends T> coll, Comparator<? super T> cmp)
```

有类似的方法来找到最小值。 例如，以下是如何使用自然排序和使用大小排序来查找列表的最大值和最小值：

```java
   Collection<String> strings = Arrays.asList("from","aaa","to","zzz");
   assert max(strings).equals("zzz");
   assert min(strings).equals("aaa");
   assert max(strings,sizeOrder).equals("from");
   assert min(strings,sizeOrder).equals("to");
```

字符串“from”是使用大小排序的最大值，因为它是最长的，“to”是最小值，因为它是最短的。

以下是使用比较器的max版本的代码：

```java
   public static <T> T max(Collection<? extends T> coll, Comparator<? super T> cmp){
     T candidate = coll.iterator().next();
     for (T elt : coll) {
       if (cmp.compare(candidate, elt) < 0) { candidate = elt; }
     }
     return candidate;
   }
```

与之前的版本相比，唯一的变化就是在我们写了 `candidate.compareTo(elt)` 之前，现在我们写了 `cmp.compare(candidate,elt)`。 （为了便于参考，这个代码和下面的内容在例3-3中进行了总结。）

定义一个提供自然排序的比较器很容易：

```java
   public static <T extends Comparable<? super T>> Comparator<T> naturalOrder(){
     return new Comparator<T> {
       public int compare(T o1, T o2) { return o1.compareTo(o2); }
     }
   }
```

使用这种方法，可以很容易地根据使用给定比较器的版本定义使用自然排序的 `max` 版本：

```java
   public static <T extends Comparable<? super T>> T max(Collection<? extends T> coll){
     return max(coll, Comparators.<T>naturalOrder());
   }
```

为了调用通用方法 `naturalOrder`，必须明确提供类型参数，因为推断类型的算法将无法正确计算出正确的类型。

定义一个采用比较器并返回给定顺序反向的新比较器的方法也很容易：

```java
   public static <T> Comparator<T> reverseOrder(final Comparator<T> cmp){
     return new Comparator<T>() {
       public int compare(T o1, T o2) { return cmp.compare(o2,o1); }
     };
   }
```

这简单地反转了比较器的参数顺序。 （根据比较者的合同，这将等同于以原始顺序保留参数，但否定结果。）这里是返回自然排序的反向的方法：

```java
   public static <T extends Comparable<? super T>> Comparator<T> reverseOrder(){
     return new Comparator<T>() {
       public int compare(T o1, T o2) { return o2.compareTo(o1); }
     };
   }
```

`java.util.Collections` 提供了类似的方法，参见17.4节。

最后，通过使用 `reverseOrder` 的两个版本，我们可以根据 `max` 的两个版本来定义 `min` 的两个版本：

```java
   public static <T> T min(Collection<? extends T> coll, Comparator<? super T> cmp){
     return max(coll, reverseOrder(cmp));
   }
   public static <T extends Comparable<? super T>> T min(Collection<? extends T> coll){
     return max(coll, Comparators.<T>reverseOrder());
   }
```

（这样结束了例3-3中总结的代码）。

集合框架确实提供了两个版本，分别是 `min` 和 `max`，这里给出了签名，参见 `17.1` 节。然而，如果你检查库的源代码，你会发现四者中没有一个是以其他方式定义的;相反，每个都是直接定义的。更直接的版本更长，更难维护，但速度更快。使用 `Sun`当前的 `JVM`，测量结果显示加速大约 `30％`。这种加速是否值得代码复制取决于代码的使用情况。由于 `Java`实用程序很可能被用于关键的内部循环，因此类库的设计人员更喜欢执行速度而非表达式的经济性。但情况并非总是如此。`30％`的提高听起来会让人印象深刻，但除非程序的总时间很长，并且程序出现在重复使用的内部循环中，否则这种提高并不重要。不要让你自己的代码不必要地延长，只是为了克服一点点改进。

作为比较器的最后一个例子，下面是一个方法，它在元素上使用比较器并在元素列表上返回一个比较器：

```java
   public static <E> Comparator<List<E>> listComparator(final Comparator<? super E> comp) {
     return new Comparator<List<E>>() {
       public int compare(List<E> list1, List<E> list2) {
         int n1 = list1.size();
         int n2 = list2.size();
         for (int i = 0; i < Math.min(n1,n2); i++) {
           int k = comp.compare(list1.get(i), list2.get(i));
           if (k != 0) return k;
         }
         return (n1 < n2) ? -1 : (n1 == n2) ? 0 : 1;
       }
     };
   }
```

循环比较两个列表中的相应元素，并在发现不相等的相应元素时（在这种情况下，认为较小元素的列表较小）或到达任一列表的末尾（在这种情况下， 较短的列表被认为较小）。 这是通常的列表排序; 如果我们将字符串转换为字符列表，它会给出字符串的通常排序。





























