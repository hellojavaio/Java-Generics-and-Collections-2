《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_Reification.md)

### 可定义类型

在 `Java` 中，数组的类型是用其组件类型来表示的，而参数化类型的类型是在没有其类型参数的情况下被指定的。 例如，一个数组的数组将带有指定类型 
`Number []`，而一个数字列表将带有指定类型 `ArrayList`，而不是 `ArrayList<Number>`; 原始类型，而不是参数化类型被通用化。 当然，列表中的每个元素都会附
加一个指定类型 - 比如整数或双精度 - 但这与指定参数类型并不相同。 如果列表中的每个元素都是整数，我们将无法判断是否有 `ArrayList<Integer>`，
`ArrayList<Number>` 或 `ArrayList<Object>`; 如果列表为空，我们将无法确定它是什么样的空列表。

在 `Java` 中，如果类型在运行时完全表示，即擦除不会删除任何有用的信息，那么我们说类型是可重用的。 准确地说，如果是以下类型之一，则类型是可验证的：

   - 原始类型（如 `int`）
   - 非参数化类或接口类型（如数字，字符串或可运行）
   - 所有类型参数都是无界通配符（例如 `List<?>`，`ArrayList<?>` 或 `Map<?,?>`）的参数化类型
   - 原始类型（如 `List`，`ArrayList` 或 `Map`）
   - 其组件类型可调整的数组（如 `int []`，`Number []`，`List<?> []`，`List []` 或 `int [][]`）如果是以下类型之一，则该类型不可调整：
   - 类型变量（如 `T`）
   - 带有实际参数的参数化类型（例如 `List<Number>`，`ArrayList<String>` 或 `Map<String,Integer>`）
   - 带有边界的参数化类型（例如 `List<? extends Number>` 或 `Comparable <? super String>`）
   
所以类型 `List<? extends Object>` 不可赋值，尽管它与 `List<?>` 等效。 以这种方式定义可定义类型使得它们易于在语法上识别。   

《《《 [下一节](02_Instance_Tests_and_Casts.md)      <br/>
《《《 [返回首页](../README.md)
