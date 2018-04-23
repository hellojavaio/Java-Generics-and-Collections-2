《《《 [返回首页](../README.md)       <br/>
《《《 [上一节](00_Design_Patterns.md)

### 游客

通常情况下，数据结构由案例分析和递归定义。例如，`Tree<E>` 类型的二叉树是以下之一：

  - 一个叶子，包含E类型的单个值
  - 包含一个左子树和一个右子树的分支，都是 `Tree<E>` 类型很容易想到很多其他示例：形状可以是三角形，矩形，两种形状的组合或转换形状; `XML` 节点可以是文本节点，属性节点或元素节点（可能包含其他节点）;等等。

为了以面向对象的语言来表示这样的结构，数据结构由抽象类表示，并且每个事例由子类表示。抽象类为数据结构上的每个可能的操作声明一个抽象方法，并且每个子类都根据相应的情况实现该方法。

例 `9-1` 说明了应用于树的这种技术。有一个抽象类 `Tree<E>`，它有两个抽象方法，`toString` 和 `sum`。 （前者适用于任何树，后者仅适用于数字树 - 为了简单起见，这种限制是在运行时通过强制转换强制执行的，而不是编译时的类型，如后面讨论的那样）。有两个静态工厂方法，一个构造一个叶子，一个构造分支。其中每一个都包含一个嵌套类，它扩展了 `Tree<E>` 并实现了每个方法 `toString` 和 `sum`。

如果您事先知道数据结构上所需的所有操作，或者可以修改需求更改时定义结构的类，则此方法就足够了。 但是，有时情况并非如此，特别是当不同的开发人员时。

例 `9-1`。 一棵简单的树和客户端

```java
   abstract class Tree<E> {
     abstract public String toString();
     abstract public Double sum();
     public static <E> Tree<E> leaf(final E e) {
       return new Tree<E>() {
         public String toString() {
           return e.toString();
         }
         public Double sum() {
           return ((Number)e).doubleValue();
         }
       };
     }
     public static <E> Tree<E> branch(final Tree<E> l, final Tree<E> r) {
       return new Tree<E>() {
         public String toString() {
           return "("+l.toString()+"^"+r.toString()+")";
         }
         public Double sum() {
           return l.sum() + r.sum();
         }
       };
     }
   }
   class TreeClient {
     public static void main(String[] args) {
       Tree<Integer> t = Tree.branch(Tree.branch(Tree.leaf(1), Tree.leaf(2)), Tree.leaf(3));
       assert t.toString().equals("((1^2)^3)");
       assert t.sum() == 6;
     }
   }
```

负责定义结构的类和作为结构客户的类。

`Visitor` 模式可以在不修改定义数据结构的类的情况下提供新的操作。 在这种模式中，表示结构的抽象类声明了抽象访问方法，它将访问者作为参数。访问者实现了一个接口，该接口为结构规范中的每个个案指定一种方法。 每个子类通过调用相应案例的访问者方法来实现访问方法。

例 `9-2`。 与访客的一棵树

```java
   abstract class Tree<E> {
     public interface Visitor<E, R> {
       public R leaf(E elt);
       public R branch(R left, R right);
     }
     public abstract <R> R visit(Visitor<E, R> v);
       public static <T> Tree<T> leaf(final T e) {
         return new Tree<T>() {
           public <R> R visit(Visitor<T, R> v) {
             return v.leaf(e);
         }
       };
     }
     public static <T> Tree<T> branch(final Tree<T> l, final Tree<T> r) {
       return new Tree<T>() {
         public <R> R visit(Visitor<T, R> v) {
           return v.branch(l.visit(v), r.visit(v));
         }
       };
     }
   }
```

例 `9-2` 说明了应用于树的这种模式。现在抽象类 `Tree<E>` 只有一个抽象方法 `visit`，它接受 `Visitor<E，R>` 类型的参数。接口 `Visitor<E，R>` 指定了两个方法，一个接受类型值的叶方法 `E` 并返回一个 `R` 类型的值，以及一个接受两个 `R` 类型值并返回 `R` 类型值的分支方法。叶子对应的子类通过调用叶子元素上的访问者的叶子方法来实现访问，而分支对应的子类通过调用访问者的递归调用的结果调用访问者的分支方法来实现访问左边和右边的子树。

例 `9-3` 说明了如何在客户端树中实现 `toString` 和 `sum` 方法，而不是在定义数据结构的类中。而在这些方法之前，以树为接收方，现在它们是以树为参数的静态方法。

这两种方法之间存在令人愉快的双重性。对于简单树，每个工厂方法（叶和分支）将每个运算符方法（`toString` 和 `sum`）的定义分组在一起。对于具有访问者的树，每个运算符方法（`toString` 和 `sum`）将每个访问者方法（叶和分支）的定义分组在一起。

使用泛型时，每个访问者都有两个类型参数，一个用于树的元素类型，另一个用于访问者的返回类型。没有泛型，每个访问者都必须返回 `Object` 类型的结果，并且需要许多额外的演员。因此，当仿制药不存在时，访问者经常被设计为不返回价值;相反，结果会累积在访问者的本地变量中，从而使数据在整个程序中的流动变得复杂。

例 `9-3`。有访客的客户

```java
   class TreeClient {
     public static <T> String toString(Tree<T> t) {
       return t.visit(new Tree.Visitor<T, String>() {
         public String leaf(T e) {
           return e.toString();
         }
         public String branch(String l, String r) {
           return "("+l+"^"+r+")";
         }
       });
     }
     public static <N extends Number> double sum(Tree<N> t) {
       return t.visit(new Tree.Visitor<N, Double>() {
         public Double leaf(N e) {
           return e.doubleValue();
         }
         public Double branch(Double l, Double r) {
           return l+r;
         }
       });
     }
     public static void main(String[] args) {
      Tree<Integer> t = Tree.branch(Tree.branch(Tree.leaf(1),
      Tree.leaf(2)),
      Tree.leaf(3));
      assert toString(t).equals("((1^2)^3)");
      assert sum(t) == 6;
     }
   }
```

有趣的是，总和方法的通用类型对访问者可能更精确。 对于简单的树，`sum` 方法必须有一个类型签名，表明它可以处理任何元素类型; 需要强制转换以将每个叶转换为 `Number` 类型; 如果在不包含数字的树上调用 `sum`，则会在运行时引发类转换错误。 对于访问者来说，`sum` 方法可能有一个类型签名，表示它只对数字元素有效; 不需要演员; 如果在不包含数字的树上调用 `sum`，则会在编译时报告类型错误。

实际上，您通常会使用简单方法和访问者模式的组合。 例如，您可以选择使用简单的方法定义标准方法，比如 `toString`，而将 `Visitor` 用于其他方法（如 `sum`）。

例 `9-4`。 一位具有泛型的口译员

```java
   class Pair<A, B> {
     private final A left;
     private final B right;
     public Pair(A l, B r) { left=l; right=r; }
     public A left() { return left; }
     public B right() { return right; }
   }
   abstract class Exp<T> {
     abstract public T eval();
     static Exp<Integer> lit(final int i) {
       return new Exp<Integer>() { public Integer eval() { return i; } };
     }
     static Exp<Integer> plus(final Exp<Integer> e1, final Exp<Integer> e2) {
       return new Exp<Integer>() { 
	     public Integer eval() {
           return e1.eval()+e2.eval();
         } 
	   };
     }
     static <A, B> Exp<Pair<A, B>> pair(final Exp<A> e1, final Exp<B> e2) {
       return new Exp<Pair<A, B>>() { 
	     public Pair<A, B> eval() {
           return new Pair<A, B>(e1.eval(), e2.eval());
         } 
	   };
     }
     static <A, B> Exp<A> left(final Exp<Pair<A, B>> e) {
       return new Exp<A>() { 
	     public A eval() { 
		   return e.eval().left(); 
		 } 
	   };
     }
     static <A, B> Exp<B> right(final Exp<Pair<A, B>> e) {
       return new Exp<B>() { 
	     public B eval() { 
		   return e.eval().right(); 
		 } 
	   };
     }
     public static void main(String[] args) {
       Exp<Integer> e = left(pair(plus(lit(3),lit(4)),lit(5)));
       assert e.eval() == 7;
     }
   }
```
《《《 [下一节](02_Interpreter.md)      <br/>
《《《 [返回首页](../README.md)