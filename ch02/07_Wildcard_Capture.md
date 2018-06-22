《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](06_Wildcards_Versus_Type_Parameters.md)

### 通配符捕获

当调用泛型方法时，可以选择类型参数以匹配由通配符表示的未知类型。这被称为通配符捕获。

考虑工具类 `java.util.Collections` 中的反向方法，它接受任何类型的列表并将其反向。它可以是以下两个签名中的任何一个，它们是相同的：

```java
  public static void reverse(List<?> list);
  public static void <T> reverse(List<T> list);
```

通配符签名稍短且更清晰，是类库中使用的签名。如果使用第二个签名，则很容易实现该方法：

```java
  public static void <T> reverse(List<T> list) {
    List<T> tmp = new ArrayList<T>(list);
    for (int i = 0; i < list.size(); i++) {
      list.set(i, tmp.get(list.size()-i-1));
    }
  }
```
  
这会将参数复制到临时列表中，然后以相反的顺序将副本写回到原始文件中。如果您尝试使用类似方法体的第一个签名，它将不起作用：

```java
  public static void reverse(List<?> list) {
    List<Object> tmp = new ArrayList<Object>(list);
    for (int i = 0; i < list.size(); i++) {
      list.set(i, tmp.get(list.size()-i-1)); // 编译报错
    }
  }
```
  
现在从拷贝写入原始文件是不合法的，因为我们试图从对象列表写入未知类型的列表。 用 `List<?>` 替换 `List<Object>` 不会解决问题，因为现在我们有两个带有
（可能不同）未知元素类型的列表。  

相反，您可以通过使用第二个签名实现私有方法并从第一个签名调用第二个签名来实现具有第一个签名的方法：

```java
  public static void reverse(List<?> list) { rev(list); }
  private static <T> void rev(List<T> list) {
    List<T> tmp = new ArrayList<T>(list);
    for (int i = 0; i < list.size(); i++) {
      list.set(i, tmp.get(list.size()-i-1));
    }
  }
```

在这里我们说类型变量 `T` 已经捕获了通配符。 这是处理通配符时通常有用的技巧，值得了解。
 
了解通配符捕获的另一个原因是，即使您不使用上述技术，它也可以显示在错误消息中。通常，每次出现通配符都表示某种未知类型。 如果编译器打印包含此类型的错误
消息，则称为捕获？。 例如，使用 `Sun` 当前的编译器，反向版本不正确会生成以下错误消息：

```java
  Capture.java:6: set(int,capture of ?) in java.util.List<capture of ?>
  cannot be applied to (int,java.lang.Object)
  list.set(i, tmp.get(list.size()-i-1));
      ^
```
  
因此，如果你看到这个奇怪的短语 ` capture of ?` 在错误消息中，它将来自通配符类型。 即使有两个不同的通配符，编译器也会打印与每个相关的类型作为
`capture of ?`。 有界的通配符会生成更加冗长的名称，如 `capture of ? extends Number`。  

《《《 [下一节](08_Restrictions_on_Wildcards.md)      <br/>
《《《 [返回首页](../README.md)
