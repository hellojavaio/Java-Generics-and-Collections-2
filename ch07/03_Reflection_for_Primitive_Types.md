《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](02_Reflected_Types_are_Reifiable_Types.md)

### 对原始类型的反思

`Java` 中的每种类型（包括基元类型和数组类型）都具有类文字和相应的类标记。

例如，`int.class` 表示整数的基本类型的类标记（该标记也是静态字段 `Integer.TYPE` 的值）。 这个类标记的类型不能是 `Class<int>`，因为 `int` 不是一个引
用类型，所以它被认为是 `Class<Integer>`。 可以说，这是一个奇怪的选择，因为根据这种类型，您可能期望调用 `int.class.cast(o)` 和 
`int.class.newInstance()` 返回 `Integer` 类型的值，但实际上这些调用会引发异常。 同样，你可能会期待这个调用：

```java
java.lang.reflect.Array.newInstance(int.class,size)
```

返回 `Integer[]` 类型的值，但实际上该调用返回的是一个 `int[]` 类型的值。 这些例子表明，给类标记 `int.class` 的 `Class<?>` 类型可能更有意义.

另一方面，`int[].class` 表示具有基本类型 `integer` 的组件的数组的类标记，并且此类标记的类型为 `Class<int[]>`，这是允许的，因为 `int[]` 是引用类型。

《《《 [下一节](04_A_Generic_Reflection_Library.md)      <br/>

《《《 [返回首页](../README.md)
