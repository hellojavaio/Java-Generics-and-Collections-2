# 前言
- Java现在支持泛型，这是自从`Java 1.2`中增加内部类以来语言最重大的变化 - 有些人会说这是语言中最重大的变化。
- 假设你想处理列表。 有些可能是整数列表，其他列表的字符串，还有其他列表的字符串列表。 在泛型之前的`Java`中，这很简单。 
你可以用同一个类来表示所有这三个类，名为`List`，它具有`Object`类的元素
    ```
    list of integers List
    list of strings List
    list of lists of strings List
    ```
- 为了保持简单的语言，你必须自己完成一些工作：你必须跟踪你有一个整数列表（或字符串或字符串列表）的事实，并且当你从 列表你必须把它从对象转换回整数（或字符串或列表）。 
例如，泛型之前的集合框架广泛使用了这个习惯用法。

- 爱因斯坦被誉为说：“一切应该尽可能简单，但不要简单”。 有人可能会说上面的方法太简单了。 
在使用泛型的`Java`中，您可以区分不同类型的列表：
    ```
    list of integers List<Integer>
    list of strings List<String>
    list of lists of strings List<List<String>>
    ```