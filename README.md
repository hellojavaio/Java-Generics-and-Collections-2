#  Java 泛型与集合

使用[谷歌翻译](https://translate.google.cn) 进行初步翻译.

---

将利用碎片时间进行整理和校对，完整的时间段适合做其他需要大量思考的事，如果你有兴趣欢迎提交PR。

## TODO
- 目录完善
- 数据校对

## 目录

* [前言](Preface.md)
* [第一部分：泛型](ch01/00_Introduction.md)
  * [第一章(简介)](ch01/00_Introduction.md#第一章(简介))
    * [1.1 泛型](ch01/01_Generics.md#泛型)
    * [1.2 装箱与拆箱](ch01/02_Boxing_and_Unboxing.md#装箱与拆箱)
    * [1.3 循环](ch01/03_Foreach.md#循环)
    * [1.4 泛型方法和可变参数](ch01/04_Generic_Methods_and_Varargs.md#泛型方法和可变参数)
    * [1.5 断言](ch01/05_Assertions.md#断言)
  * [第二章(子类型化和通配符)](ch02/00_Subtyping_and_Wildcards.md#第二章(子类型化和通配符))
    * [2.1 子类型化和替代原则](ch02/01_Subtyping_and_the_Substitution_Principle.md#子类型化和替代原则)
    * [2.2 通配符和继承](ch02/02_Wildcards_with_extends.md#通配符和继承)
    * [2.3 通配符和超类](ch02/03_Wildcards_with_super.md#通配符和超类)
    * [2.4 获取和放置原则](ch02/04_The_Get_and_Put_Principle.md#获取和放置原则)
    * [2.5 数组](hc02/05_Arrays.md#数组)
    * [2.6 通配符与类型参数](ch02/06_Wildcards_Versus_Type_Parameters.md#通配符与类型参数)
    * [2.7 通配符捕获](ch02/07_Wildcard_Capture.md#通配符捕获)
    * [2.8 对通配符的限制](ch02/08_Restrictions_on_Wildcards.md)
  * [第三章(集合类)](ch03/00_Comparison_and_Bounds.md)
    * [3.1 可比较的](ch03/01_Comparable.md)
    * [3.2 集合的最大值](ch03/02_Maximum_of_a_Collection.md)
    * [3.3 水果相关示例](ch03/03_A_Fruity_Example.md)
    * [3.4 比较](ch03/04_Comparator.md)
    * [3.5 枚举类型](ch03/05_Enumerated_Types.md)
    * [3.6 多重界限](ch03/06_Multiple_Bounds.md)
    * [3.7 桥梁](ch03/07_Bridges.md)
    * [3.8 协变覆盖](ch03/08_Covariant_Overriding.md)
  * [第四章(声明)](ch04/00_Declarations.md)
    * [4.1 构造函数](ch04/01_Constructors.md)
    * [4.2 静态成员](ch04/02_Static_Members.md)
    * [4.3 嵌套类](ch04/03_Nested_Classes.md)
    * [4.4 擦除的工作原理](ch04/04_How_Erasure_Works.md)
  * [第五章(进化，而不是革命)](ch05/00_Evolution_Not_Revolution.md)
    * [5.1 旧版客户端的旧版库](ch05/01_Legacy_Library_with_Legacy_Client.md)
    * [5.2 具有通用客户端的通用库](ch05/02_Generic_Library_with_Generic_Client.md)
    * [5.3 具有传统客户端的通用库](ch05/03_Generic_Library_with_Legacy_Client.md)
    * [5.4 具有通用客户端的旧版库](ch05/04_Legacy_Library_with_Generic_Client.md)
    * [5.5 结论](ch05/05_Conclusions.md)
  * [第六章(具体化)](ch06/00_Reification.md)
    * [6.1 可定义类型](ch06/01_Reifiable_Types.md)
    * [6.2 实例测试和示例](ch06/02_Instance_Tests_and_Casts.md)
    * [6.3 异常处理](ch06/03_Exception_Handling.md)
    * [6.4 数组创建](ch06/04_Array_Creation.md)
    * [6.5 广告中的真理原则](ch06/05_The_Principle_of_Truth_in_Advertising.md)
    * [6.6 不雅暴露的原则](ch06/06_The_Principle_of_Indecent_Exposure.md)
    * [6.7 如何定义 ArrayList](ch06/07_How_to_Define_ArrayList.md)
    * [6.8 数组创建和可变参数](ch06/08_Array_Creation_and_Varargs.md)
    * [6.9 作为已弃用类型的阵列](ch06/09_Arrays_as_a_Deprecated_Type.md)
    * [6.10 加起来](ch06/10_Summing_Up.md)    
  * [第七章(反射)](ch07/00_Reflection.md)
    * [7.1 反射的泛型](ch07/01_Generics_for_Reflection.md)
    * [7.2 反射类型是可维持类型](ch07/02_Reflected_Types_are_Reifiable_Types.md)
    * [7.3 对原始类型的反思](ch07/03_Reflection_for_Primitive_Types.md)
    * [7.4 一个通用的反射库](ch07/04_A_Generic_Reflection_Library.md)
    * [7.5 泛型的反思](ch07/05_Reflection_for_Generics.md)
    * [7.6 反思泛型类型](ch07/06_Reflecting_Generic_Types.md)

## PR
提交 PR 前请先确认排版,示例: [中文文案排版](https://github.com/maskleo-doc/chinese-copywriting-guidelines)

## 高清英文版 PDF[下载](https://github.com/maskleo/Java-Generics-and-Collections/files/1634266/Java.pdf)

## LICENSE
![](LICENSE.png)
