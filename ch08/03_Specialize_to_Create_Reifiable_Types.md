《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Use_Checked_Collections_to_Enforce_Security.md)

### 专注于创建可维持类型

参数化类型不可确定，但某些操作（如实例测试，转换和数组创建仅适用于可重用类型）。 在这种情况下，一种解决方法是创建参数化类型的专用版本。 专业版本可以通过委托（即包装）或继承（即子类化）来创建，我们依次讨论每个版本。

例 `8-1` 显示了如何将列表专门化为字符串; 专门针对其他类型是相似的。 我们首先将 `List`  接口专门化为所需的类型：

```java
   interface ListString extends List<String> {}
```

例 `8-1`。 专注于创建可调整类型

```java
   interface ListString extends List<String> {}
   class ListStrings {
     public static ListString wrap(final List<String> list) {
       class Random extends AbstractList<String> implements ListString, RandomAccess {
         public int size() { return list.size(); }
         public String get(int i) { return list.get(i); }
         public String set(int i, String s) { return list.set(i,s); }
         public String remove(int i) { return list.remove(i); }
         public void add(int i, String s) { list.add(i,s); }
       }
       class Sequential extends AbstractSequentialList<String> implements ListString {
         public int size() { return list.size(); }
         public ListIterator<String> listIterator(int index) {
           final ListIterator<String> it = list.listIterator(index);
           return new ListIterator<String>() {
             public void add(String s) { it.add(s); }
             public boolean hasNext() { return it.hasNext(); }
             public boolean hasPrevious() { return it.hasPrevious(); }
             public String next() { return it.next(); }
             public int nextIndex() { return it.nextIndex(); }
             public String previous() { return it.previous(); }
             public int previousIndex() { return it.previousIndex(); }
             public void remove() { it.remove(); }
             public void set(String s) { it.set(s); }
           };
         }
       }
       return list instanceof RandomAccess ? new Random() : new Sequential();
     }
   }
   class ArrayListString extends ArrayList<String> implements ListString {
     public ArrayListString() { super(); }
     public ArrayListString(Collection<? extends String> c) { super(c); }
     public ArrayListString(int capacity) { super(capacity); }
   }
```

这声明了 `ListString`（一个非参数化类型，因此是可修饰的）是 `List<String>` 的一个子类型（一个参数化类型，因此不可赋予）。 因此，第一类型的每个值也属于第二类型，但不是相反。 接口声明没有新的方法; 它只是将现有方法专用于参数类型 `String`。

委托要委托专门化，我们定义一个静态方法包装，它接受一个 `List<String>` 类型的参数并返回一个 `ListString` 类型的结果。`Java` 库在一个名为 `Collections` 的类中放置了作用于接口 `Collection` 的方法，因此我们将方法包放入名为 `ListStrings` 的类中。

这是一个使用的例子：

```java
  List<? extends List<?>> lists = Arrays.asList(
    ListStrings.wrap(Arrays.asList("one","two")),
    Arrays.asList(3,4),
    Arrays.asList("five","six"),
    ListStrings.wrap(Arrays.asList("seven","eight"))
  );
  ListString[] array = new ListString[2];
  int i = 0;
  for (List<?> list : lists)
  if (list instanceof ListString)
  array[i++] = (ListString)list;
  assert Arrays.toString(array).equals("[[one, two], [seven, eight]]");
```

这将创建一个列表列表，然后扫描它以查找实现 `ListString` 的列表并将它们放入数组中。现在，数组创建，实例测试和强制转换不会产生任何问题，因为它们对可重用类型 `ListString` 而不是不可重派类型 `List<String>` 起作用。注意到未包装的 `List<String>` 不会被识别为 `ListString` 的实例;这就是为什么列表中的第三个列表未被复制到数组中的原因。

`ListStrings` 类很容易实现，但需要注意保持良好的性能。 `Java` 集合框架规定，无论何时列表支持快速随机访问，它应该实现标记接口 `RandomAccess`，以允许通用算法在应用于随机或顺序访问列表时执行良好。它还提供了两个抽象类 `AbstractList` 和 `AbstractSequentialList`，它们适用于定义随机和顺序访问列表。例如，`ArrayList` 实现 `RandomAccess` 并扩展 `AbstractList`，而 `LinkedList` 扩展 `AbstractSequentialList`。`AbstractList` 类根据提供随机访问的五种抽象方法来定义 `List` 接口的方法，并且必须在子类（`size`，`get`，`set`，`add`，`remove`）中定义。同样，类`AbstractSequentialList` 按照提供顺序访问的两个抽象方法定义了 `List` 接口的所有方法，并且必须在子类（`size`，`listIterator`）中定义。

`wrap` 方法检查给定列表是否实现了接口 `RandomAccess`。如果是这样，它将返回一个 `Random` 类的实例，该类扩展了 `AbstractList` 并实现了 `RandomAccess`，否则它将返回继承 `AbstractSequentialList` 的 `Sequential` 类的实例。 类 `Random` 实现了 `AbstractList` 的子类必须提供的五个方法。同样，`Sequential` 类实现了必须由 `AbstractSequentialList` 的子类提供的两个方法，其中第二个方法返回一个实现 `ListIterato` 接口九个方法的类。如下所述，通过委派实现列表迭代器而不是简单地返回原始列表迭代器可以改进包装器的安全属性。所有这些方法都是通过授权直接实施的。

`wrap` 方法返回底层列表的视图，如果试图将元素插入到非 `String` 类型的列表中，将引发类转换异常。这些检查与 `checkedList` 包装器提供的检查类似。但是，对于包装来说，相关的强制转换由编译器插入（通过委托来实现 `listIterator` 接口的九个方法的一个原因是为了确保插入这些强制转换），而对于已检查的列表，强制转换是通过反射来执行的。泛型通常会使这些检查变得冗余，但是它们在遗留代码或未检查警告的存在或处理诸如 `8.2` 节中讨论的安全问题时会有所帮助。

此处显示的代码旨在平衡权力与简洁性（它只有三条线），但其他变体也是可能的。不完整的版本可能只实现随机访问，如果可以保证它从未应用于顺序访问列表，反之亦然。更高效的版本可能会跳过 `AbstractList` 和 `AbstractSequentialList` 的使用，而直接将所有 `25` 个 `List` 接口的方法与 `toString` 方法（模型的 `Collections.checkedList` 的源代码）一起委托。您还可能希望在 `ListString` 接口中提供其他方法，例如返回基础 `List<String>` 的 `unwrap` 方法或通过递归将换行应用于返回 `ListString` 而不是 `List<String>` 的 `subList`的版本委托调用。

继承为了通过继承进行特殊化，我们声明了一个实现专用接口并从适当的列表实现继承的专用类。示例 `8-1` 显示了专门化 `ArrayList` 的实现，我们在此重复：

```java
   class ArrayListString extends ArrayList<String> implements ListString {
     public ArrayListString() { super(); }
     public ArrayListString(Collection<? extends String> c) { super(c); }
     public ArrayListString(int capacity) { super(capacity); }
   }
```

代码非常紧凑。 所有的方法都是从超类继承的，所以我们只需要定义专门的构造函数。 如果唯一需要的构造函数是默认的构造函数，那么类的主体可能是完全空的！

前面的例子仍然有效，如果我们使用继承而不是委托来创建初始列表：

```java
   List<? extends List<?>> lists = Arrays.asList(
     new ArrayListString(Arrays.asList("one","two")),
     Arrays.asList(3,4),
     Arrays.asList("five","six"),
     new ArrayListString(Arrays.asList("seven","eight"))
   );
   ListString[] array = new ListString[2];
   int i = 0;
   for (List<?> list : lists)
     if (list instanceof ListString)
       array[i++] = (ListString) list;
   assert Arrays.toString(array).equals("[[one, two], [seven, eight]]");
```

像以前一样，数组创建，实例测试和强制转换现在没有问题。

但是，委派和继承是不可互换的。 委派专业化创建了一个基础列表的视图，而通过继承进行专业化构建了一个新列表。 此外，委托专业化比继承专业化具有更好的安全属性。 这里是一个例子：

```java
   List<String> original = new ArrayList<String>();
   ListString delegated = ListStrings.wrap(original);
   ListString inherited = new ArrayListString(original);
   delegated.add("one");
   inherited.add("two");
   try {
     ((List)delegated).add(3); // 未经检查，类型转换错误
   } catch (ClassCastException e) {}
   ((List)inherited).add(4); // 未经检查，没有类型转换错误
   assert original.toString().equals("[one]");
   assert delegated.toString().equals("[one]");
   assert inherited.toString().equals("[two, 4]");
```

在这里，原始列表是两个专业列表的基础，一个是由代表团创建的，一个是由继承组成的。添加到委托列表中的元素显示在原始列表中，但添加到继承列表中的元素不会。类型检查通常会阻止任何尝试将不是字符串的元素添加到任何类型为 `List<String>` 的对象，这些对象是专用的或非专用的，但这些尝试可能会在存在旧代码或未经检查的警告时发生。在这里，我们转换为原始类型，并使用未经检查的调用尝试向委托和继承列表添加整数。委派列表上的尝试引发类转换异常，而继承列表上的尝试成功。为了强制第二次尝试失败，我们应该使用 `checkedList` 来包装继承的列表，如第 `8.1` 节所述。

另一个区别是继承只能应用于可以被子类化的公共实现（例如 	`ArrayList` 或 `LinkedList`），而委托可以创建任何列表的视图（包括由 `Arrays.asList` 或 `Collections.immutableList` 等方法返回的列表，或者通过列表上的子列表方法）。

通过为列表添加元素或设置元素的任何方法声明专用签名，可以提高通过继承进行专业化的安全属性：

```java
   class ArrayListString extends ArrayList<String> implements ListString {
     public ArrayListString() { super(); }
     public ArrayListString(Collection<? extends String> c) { this.addAll(c); }
     public ArrayListString(int capacity) { super(capacity); }
     public boolean addAll(Collection<? extends String> c) {
       for (String s : c) {} // check that c contains only strings
       return super.addAll(c);
     }
     public boolean add(String element) { return super.add(element); }
     public void add(int index, String element) { super.add(index, element); }
     public String set(int index, String element) {
       return super.set(index, element);
     }
   }
```

现在，任何尝试添加或设置不是字符串的元素都会引发类转换异常。 然而，这个属性依赖于细微的实现细节，即任何其他添加或设置元素的方法（例如，`listIterator` 中的 `add` 方法）都是按照上面专门的方法实现的。 一般来说，如果需要安全性，授权更加健壮。

其他类型其他类型的专业化工作类似。 例如，在例 `8-1` 中用 `Integer` 替换 `String` 给出了一个接口 `ListInteger` 和类 `ListIntegers` 和 `ArrayListInteger`。 这甚至适用于列表清单。 例如，在例 `8-1` 中用 `ListString` 替换 `String` 给出了一个接口 `ListListString` 和类 `ListListStrings` 和 `ArrayListListString`。

但是，通配符类型的专业化可能会产生问题。 假设我们想要专门化两种类型的 `List<Number>` 和 `List<? extends Number>`。 我们可能期望使用以下声明：

```java
   // illegal
   interface ListNumber extends List<Number>, ListExtendsNumber {}
   interface ListExtendsNumber extends List<? extends Number> {}
```
 
这有两个问题：第一个接口使用相同的擦除扩展了两个不同的接口，这是不允许的（见 `4.4` 节），而第二个接口的顶级使用通配符的超类型，这也是不允许的 见 `2.8` 节）。 唯一的解决方法是避免包含通配符的类型的专业化; 幸运的是，这应该很少成为问题。

《《《 [下一节](04_Maintain_Binary_Compatibility.md)      <br/>
《《《 [返回首页](../README.md)



