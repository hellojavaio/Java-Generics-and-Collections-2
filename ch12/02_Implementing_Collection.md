《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](01_Using_the_Methods_of_Collection.md)

### 集合实现

`Collection` 没有具体的实现。 类 `AbstractCollection` 部分实现它，它是一系列骨架实现中的一个 - 包括 `AbstractSet`，`AbstractList`等 - 它们提供了
每个接口的不同具体实现的通用功能。 这些框架实现可用于帮助框架接口的新实现的设计者。例如，`Collection` 可以作为包（无序列表）的接口，而实现包的程序员可
以扩展 `AbstractCollection` 并查找大部分已经完成的实现工作。

《《《 [下一节](03_Collection_Constructors.md)      <br/>
《《《 [返回首页](../README.md)
