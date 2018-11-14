---
title: java运行期的版本控制方案
id: 1
date: 2018-11-14 22:06:58
category:
 - Java
tags:
 - 依赖冲突
---
# 前言
前两天我们组负责的一个组件发生了一个与jar包版本号有关的线上bug，最近没啥事情，就顺便分析了一下。

其实是个非常无脑的小bug：`commons-lang3`包中有一堆`@since 3.5`的新增方法，我们的组件依赖了`3.5`版本以上的一个包；业务方依赖了我们的这个组件，同时也直接依赖了一个`3.5`版本以下的包。在gradle打包的时候，由于老版本的是直接依赖，新版本的是间接依赖，直接依赖优先级高于间接依赖，因此最终采用的是老版本的包。这就导致在运行期调用新方法的时候会报`NoSuchMethod`的错。

虽然问题很简单，但毕竟也是一个影响了GMV的线上事故（可怕），值得吸取一波教训。

# 方案
一般来说，在比较大的项目里，依赖冲突这种事情几乎是无法避免的。一般来说，这种问题的解决方法大多是下面几种：
1. 对于业务方来说，写代码的时候小心一点，遇到不同依赖的时候，有意识的检查一下依赖树，尽量使用较新的包，并且代码上线之前需要在测试环境充分测试。
2. 对于组件开发方来说，在写接入文档的时候要同时指明依赖的包的最低版本号，清楚地告诉接入方最低的依赖，然后再由接入方手动指定。
3. 采用容器技术，比如OSGI、Jigsaw、Karaf这些容器，对jar包再进行一层权限控制。这是一种十分重量级的方法，一般项目得上了一定的规模才会使用。
4. 采用ClassLoader隔离技术，各个包都使用自己的classLoader，互相不影响。这种方法其实很像是容器技术的阉割版，逻辑上很像容器，对jar包再做一层隔离控制。不过这种方式一般不是很优雅，有点像hack，因此目前看起来没什么像样的完整解决方案。稍微像样点的大概就是阿里最近搞的[Sofa ark](https://github.com/alipay/sofa-ark)，功能挺强大，但是用起来也比较复杂，对jar包的侵入性也很强。

各个方法其实都不是很方便，那就换一个思路，既然避免问题比较困难，那就尽量早点暴露问题。编译错误或者启动错误肯定会比运行时不知道啥时候报错更让人放心。因此根据`fail fast`原则，我们应当保证在不增加沟通成本的情况下，快速暴露问题。

# 分析
既然很多依赖冲突问题在编译、打包时都不会报错，那就只能尽量在启动时报错了。因此对于一个稳定的组件来说，做一个运行时的启动检查也就有一定的合理性了。

为了能在运行时进行依赖检查，肯定要想办法在运行时获得某个包的版本号。那如何在打包时把版本信息写在jar包里，然后再读出来呢？这就要从JarFile的加载说起了。

## 源码分析
加载一个jarFile，当然是要用ClassLoader，比如对于URLClassLoader。根据之前[对ClassLoader的分析](/2017/12/17/1/)，查询下源码就会发现如下的加载流程：

1. URLClassLoader在`loadClass`时，根据双亲委托模型，最终会用`findClass(String name)`方法用于查询特定类。

2. `findClass(String name)`方法会调用`defineClass(String name, Resource res)`方法用于加载特定类，并通过`ucp.getResource`去加载`JarFile`：
```java
protected Class<?> findClass(final String name)
        throws ClassNotFoundException
    {
        final Class<?> result;
        try {
            result = AccessController.doPrivileged(
                new PrivilegedExceptionAction<Class<?>>() {
                    public Class<?> run() throws ClassNotFoundException {
                        String path = name.replace('.', '/').concat(".class");
                        Resource res = ucp.getResource(path, false);
                        if (res != null) {
                            try {
                                return defineClass(name, res);
                            } catch (IOException e) {
                                throw new ClassNotFoundException(name, e);
                            }
                        } else {
                            return null;
                        }
                    }
                }, acc);
        } catch (java.security.PrivilegedActionException pae) {
            throw (ClassNotFoundException) pae.getException();
        }
        if (result == null) {
            throw new ClassNotFoundException(name);
        }
        return result;
    }

```
3. `JarFile`中定义了一个`Manifest`对象，用于存储Jar包的元信息：
```java
public
class JarFile extends ZipFile {
    private SoftReference<Manifest> manRef;
    private JarEntry manEntry;
    private JarVerifier jv;
    private boolean jvInitialized;
    private boolean verify;

    // indicates if Class-Path attribute present (only valid if hasCheckedSpecialAttributes true)
    private boolean hasClassPathAttribute;
    // true if manifest checked for special attributes
    private volatile boolean hasCheckedSpecialAttributes;

    // Set up JavaUtilJarAccess in SharedSecrets
    static {
        SharedSecrets.setJavaUtilJarAccess(new JavaUtilJarAccessImpl());
    }

    /**
     * The JAR manifest file name.
     */
    public static final String MANIFEST_NAME = "META-INF/MANIFEST.MF";

```
可见这里明确指定了MANIFEST文件的路径。

4. `ManiFest`类中定义了一个`Attributes`对象，用来保存一些关键的特征：
```java
public class Manifest implements Cloneable {
    // manifest main attributes
    private Attributes attr = new Attributes();

    // manifest entries
    private Map<String, Attributes> entries = new HashMap<>();

    /**
     * Constructs a new, empty Manifest.
     */
    public Manifest() {
    }

```

5. `Attributes`对象定义了一个叫`Name`的内部类，用来保存一些内定的属性（关键）：
```java
    public static class Name {
        private String name;
        private int hashCode = -1;

        /**
         * Constructs a new attribute name using the given string name.
         *
         * @param name the attribute string name
         * @exception IllegalArgumentException if the attribute name was
         *            invalid
         * @exception NullPointerException if the attribute name was null
         */
        public Name(String name) {
            if (name == null) {
                throw new NullPointerException("name");
            }
            if (!isValid(name)) {
                throw new IllegalArgumentException(name);
            }
            this.name = name.intern();
        }

        private static boolean isValid(String name) {
            int len = name.length();
            if (len > 70 || len == 0) {
                return false;
            }
            for (int i = 0; i < len; i++) {
                if (!isValid(name.charAt(i))) {
                    return false;
                }
            }
            return true;
        }

        private static boolean isValid(char c) {
            return isAlpha(c) || isDigit(c) || c == '_' || c == '-';
        }

        private static boolean isAlpha(char c) {
            return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
        }

        private static boolean isDigit(char c) {
            return c >= '0' && c <= '9';
        }

        /**
         * Compares this attribute name to another for equality.
         * @param o the object to compare
         * @return true if this attribute name is equal to the
         *         specified attribute object
         */
        public boolean equals(Object o) {
            if (o instanceof Name) {
                Comparator<String> c = ASCIICaseInsensitiveComparator.CASE_INSENSITIVE_ORDER;
                return c.compare(name, ((Name)o).name) == 0;
            } else {
                return false;
            }
        }

        /**
         * Computes the hash value for this attribute name.
         */
        public int hashCode() {
            if (hashCode == -1) {
                hashCode = ASCIICaseInsensitiveComparator.lowerCaseHashCode(name);
            }
            return hashCode;
        }

        /**
         * Returns the attribute name as a String.
         */
        public String toString() {
            return name;
        }

        /**
         * <code>Name</code> object for <code>Manifest-Version</code>
         * manifest attribute. This attribute indicates the version number
         * of the manifest standard to which a JAR file's manifest conforms.
         * @see <a href="../../../../technotes/guides/jar/jar.html#JAR_Manifest">
         *      Manifest and Signature Specification</a>
         */
        public static final Name MANIFEST_VERSION = new Name("Manifest-Version");

        /**
         * <code>Name</code> object for <code>Signature-Version</code>
         * manifest attribute used when signing JAR files.
         * @see <a href="../../../../technotes/guides/jar/jar.html#JAR_Manifest">
         *      Manifest and Signature Specification</a>
         */
        public static final Name SIGNATURE_VERSION = new Name("Signature-Version");

        /**
         * <code>Name</code> object for <code>Content-Type</code>
         * manifest attribute.
         */
        public static final Name CONTENT_TYPE = new Name("Content-Type");

        /**
         * <code>Name</code> object for <code>Class-Path</code>
         * manifest attribute. Bundled extensions can use this attribute
         * to find other JAR files containing needed classes.
         * @see <a href="../../../../technotes/guides/jar/jar.html#classpath">
         *      JAR file specification</a>
         */
        public static final Name CLASS_PATH = new Name("Class-Path");

        /**
         * <code>Name</code> object for <code>Main-Class</code> manifest
         * attribute used for launching applications packaged in JAR files.
         * The <code>Main-Class</code> attribute is used in conjunction
         * with the <code>-jar</code> command-line option of the
         * <tt>java</tt> application launcher.
         */
        public static final Name MAIN_CLASS = new Name("Main-Class");

        /**
         * <code>Name</code> object for <code>Sealed</code> manifest attribute
         * used for sealing.
         * @see <a href="../../../../technotes/guides/jar/jar.html#sealing">
         *      Package Sealing</a>
         */
        public static final Name SEALED = new Name("Sealed");

       /**
         * <code>Name</code> object for <code>Extension-List</code> manifest attribute
         * used for declaring dependencies on installed extensions.
         * @see <a href="../../../../technotes/guides/extensions/spec.html#dependency">
         *      Installed extension dependency</a>
         */
        public static final Name EXTENSION_LIST = new Name("Extension-List");

        /**
         * <code>Name</code> object for <code>Extension-Name</code> manifest attribute
         * used for declaring dependencies on installed extensions.
         * @see <a href="../../../../technotes/guides/extensions/spec.html#dependency">
         *      Installed extension dependency</a>
         */
        public static final Name EXTENSION_NAME = new Name("Extension-Name");

        /**
         * <code>Name</code> object for <code>Extension-Name</code> manifest attribute
         * used for declaring dependencies on installed extensions.
         * @deprecated Extension mechanism will be removed in a future release.
         *             Use class path instead.
         * @see <a href="../../../../technotes/guides/extensions/spec.html#dependency">
         *      Installed extension dependency</a>
         */
        @Deprecated
        public static final Name EXTENSION_INSTALLATION = new Name("Extension-Installation");

        /**
         * <code>Name</code> object for <code>Implementation-Title</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name IMPLEMENTATION_TITLE = new Name("Implementation-Title");

        /**
         * <code>Name</code> object for <code>Implementation-Version</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name IMPLEMENTATION_VERSION = new Name("Implementation-Version");

        /**
         * <code>Name</code> object for <code>Implementation-Vendor</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name IMPLEMENTATION_VENDOR = new Name("Implementation-Vendor");

        /**
         * <code>Name</code> object for <code>Implementation-Vendor-Id</code>
         * manifest attribute used for package versioning.
         * @deprecated Extension mechanism will be removed in a future release.
         *             Use class path instead.
         * @see <a href="../../../../technotes/guides/extensions/versioning.html#applet">
         *      Optional Package Versioning</a>
         */
        @Deprecated
        public static final Name IMPLEMENTATION_VENDOR_ID = new Name("Implementation-Vendor-Id");

       /**
         * <code>Name</code> object for <code>Implementation-URL</code>
         * manifest attribute used for package versioning.
         * @deprecated Extension mechanism will be removed in a future release.
         *             Use class path instead.
         * @see <a href="../../../../technotes/guides/extensions/versioning.html#applet">
         *      Optional Package Versioning</a>
         */
        @Deprecated
        public static final Name IMPLEMENTATION_URL = new Name("Implementation-URL");

        /**
         * <code>Name</code> object for <code>Specification-Title</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name SPECIFICATION_TITLE = new Name("Specification-Title");

        /**
         * <code>Name</code> object for <code>Specification-Version</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name SPECIFICATION_VERSION = new Name("Specification-Version");

        /**
         * <code>Name</code> object for <code>Specification-Vendor</code>
         * manifest attribute used for package versioning.
         * @see <a href="../../../../technotes/guides/versioning/spec/versioning2.html#wp90779">
         *      Java Product Versioning Specification</a>
         */
        public static final Name SPECIFICATION_VENDOR = new Name("Specification-Vendor");
    }

```
这里定义了大量的属性名，当一个jarfile的Manifest文件中有这些属性，这些属性就会被识别。

6. 在加载了上面的JarFile之后，`defineClass(String name, Resource res)`方法会继续调用一系列的`definePackage`方法，用于定义`Package`类：
```java
    protected Package definePackage(String name, Manifest man, URL url)
        throws IllegalArgumentException
    {
        String path = name.replace('.', '/').concat("/");
        String specTitle = null, specVersion = null, specVendor = null;
        String implTitle = null, implVersion = null, implVendor = null;
        String sealed = null;
        URL sealBase = null;

        Attributes attr = man.getAttributes(path);
        if (attr != null) {
            specTitle   = attr.getValue(Name.SPECIFICATION_TITLE);
            specVersion = attr.getValue(Name.SPECIFICATION_VERSION);
            specVendor  = attr.getValue(Name.SPECIFICATION_VENDOR);
            implTitle   = attr.getValue(Name.IMPLEMENTATION_TITLE);
            implVersion = attr.getValue(Name.IMPLEMENTATION_VERSION);
            implVendor  = attr.getValue(Name.IMPLEMENTATION_VENDOR);
            sealed      = attr.getValue(Name.SEALED);
        }
        attr = man.getMainAttributes();
        if (attr != null) {
            if (specTitle == null) {
                specTitle = attr.getValue(Name.SPECIFICATION_TITLE);
            }
            if (specVersion == null) {
                specVersion = attr.getValue(Name.SPECIFICATION_VERSION);
            }
            if (specVendor == null) {
                specVendor = attr.getValue(Name.SPECIFICATION_VENDOR);
            }
            if (implTitle == null) {
                implTitle = attr.getValue(Name.IMPLEMENTATION_TITLE);
            }
            if (implVersion == null) {
                implVersion = attr.getValue(Name.IMPLEMENTATION_VERSION);
            }
            if (implVendor == null) {
                implVendor = attr.getValue(Name.IMPLEMENTATION_VENDOR);
            }
            if (sealed == null) {
                sealed = attr.getValue(Name.SEALED);
            }
        }
        if ("true".equalsIgnoreCase(sealed)) {
            sealBase = url;
        }
        return definePackage(name, specTitle, specVersion, specVendor,
                             implTitle, implVersion, implVendor, sealBase);
    }

    protected Package definePackage(String name, String specTitle,
                                    String specVersion, String specVendor,
                                    String implTitle, String implVersion,
                                    String implVendor, URL sealBase)
        throws IllegalArgumentException
    {
        synchronized (packages) {
            Package pkg = getPackage(name);
            if (pkg != null) {
                throw new IllegalArgumentException(name);
            }
            pkg = new Package(name, specTitle, specVersion, specVendor,
                              implTitle, implVersion, implVendor,
                              sealBase, this);
            packages.put(name, pkg);
            return pkg;
        }
    }

```

7. 这样，当从JarFile中加载一个类的时候，就顺便加载了他的Manifest文件，然后加载了Package对象。我们再来看Package对象的方法：
```java
public class Package implements java.lang.reflect.AnnotatedElement {
    /**
     * Return the name of this package.
     *
     * @return  The fully-qualified name of this package as defined in section 6.5.3 of
     *          <cite>The Java&trade; Language Specification</cite>,
     *          for example, {@code java.lang}
     */
    public String getName() {
        return pkgName;
    }


    /**
     * Return the title of the specification that this package implements.
     * @return the specification title, null is returned if it is not known.
     */
    public String getSpecificationTitle() {
        return specTitle;
    }

    /**
     * Returns the version number of the specification
     * that this package implements.
     * This version string must be a sequence of nonnegative decimal
     * integers separated by "."'s and may have leading zeros.
     * When version strings are compared the most significant
     * numbers are compared.
     * @return the specification version, null is returned if it is not known.
     */
    public String getSpecificationVersion() {
        return specVersion;
    }

    /**
     * Return the name of the organization, vendor,
     * or company that owns and maintains the specification
     * of the classes that implement this package.
     * @return the specification vendor, null is returned if it is not known.
     */
    public String getSpecificationVendor() {
        return specVendor;
    }

    /**
     * Return the title of this package.
     * @return the title of the implementation, null is returned if it is not known.
     */
    public String getImplementationTitle() {
        return implTitle;
    }

    /**
     * Return the version of this implementation. It consists of any string
     * assigned by the vendor of this implementation and does
     * not have any particular syntax specified or expected by the Java
     * runtime. It may be compared for equality with other
     * package version strings used for this implementation
     * by this vendor for this package.
     * @return the version of the implementation, null is returned if it is not known.
     */
    public String getImplementationVersion() {
        return implVersion;
    }

    /**
     * Returns the name of the organization,
     * vendor or company that provided this implementation.
     * @return the vendor that implemented this package..
     */
    public String getImplementationVendor() {
        return implVendor;
    }

    /**
     * Returns true if this package is sealed.
     *
     * @return true if the package is sealed, false otherwise
     */
    public boolean isSealed() {
        return sealBase != null;
    }

    /**
     * Returns true if this package is sealed with respect to the specified
     * code source url.
     *
     * @param url the code source url
     * @return true if this package is sealed with respect to url
     */
    public boolean isSealed(URL url) {
        return url.equals(sealBase);
    }

    /**
     * Compare this package's specification version with a
     * desired version. It returns true if
     * this packages specification version number is greater than or equal
     * to the desired version number. <p>
     *
     * Version numbers are compared by sequentially comparing corresponding
     * components of the desired and specification strings.
     * Each component is converted as a decimal integer and the values
     * compared.
     * If the specification value is greater than the desired
     * value true is returned. If the value is less false is returned.
     * If the values are equal the period is skipped and the next pair of
     * components is compared.
     *
     * @param desired the version string of the desired version.
     * @return true if this package's version number is greater
     *          than or equal to the desired version number
     *
     * @exception NumberFormatException if the desired or current version
     *          is not of the correct dotted form.
     */
    public boolean isCompatibleWith(String desired)
        throws NumberFormatException
    {
        if (specVersion == null || specVersion.length() < 1) {
            throw new NumberFormatException("Empty version string");
        }

        String [] sa = specVersion.split("\\.", -1);
        int [] si = new int[sa.length];
        for (int i = 0; i < sa.length; i++) {
            si[i] = Integer.parseInt(sa[i]);
            if (si[i] < 0)
                throw NumberFormatException.forInputString("" + si[i]);
        }

        String [] da = desired.split("\\.", -1);
        int [] di = new int[da.length];
        for (int i = 0; i < da.length; i++) {
            di[i] = Integer.parseInt(da[i]);
            if (di[i] < 0)
                throw NumberFormatException.forInputString("" + di[i]);
        }

        int len = Math.max(di.length, si.length);
        for (int i = 0; i < len; i++) {
            int d = (i < di.length ? di[i] : 0);
            int s = (i < si.length ? si[i] : 0);
            if (s < d)
                return false;
            if (s > d)
                return true;
        }
        return true;
    }

```
可以发现，package类有很多get方法，这些方法基本和Attributes类的Name内部类中定义的名字一样，也就是说Package类能直接获取到Manifest文件中定义的变量。

与此同时，我们发现他也有一个`isCompatibleWith`方法，这个方法很有意思，他会将给定的一个版本号字符串与`Specification-Version`的值进行比较，用于判断当前的jar的版本是否不低于给定的版本号。

利用这个方法，我们就可以非常方便的在类加载时做一个验证，断言当前运行的版本号一定不低于我们给定的一个版本号。

## 打包分析
不过问题来了，随便打开几个包的Manifest文件，我这里以`fastjson`为例:
```
Manifest-Version: 1.0
Archiver-Version: Plexus Archiver
Built-By: wenshao
Created-By: Apache Maven 3.5.0
Build-Jdk: 1.8.0_151
```
我们发现这个文件非常简单，并没有之前定义的那些attributes。这样一来，package类也肯定是解析不到类似的方法的。那么我们如何在打包的时候加入这些信息呢？

如果是用gradle打包的话，这就用到了gradle的java插件的一个功能了。在给定的项目下添加一个打包命令的一个配置：
```
jar.manifest.attributes("Specification-Version": '1.0.0')
```
这样就可以将"Specification-Version"这个属性加到打包后的jarFile里了，详见参考资料中的gradle docs。

不过需要注意的是，这个值一定要是点号分隔的数字，不要加任何其他字符，否则调用isCompatibleWith方法时就会抛异常。

因此一般来说，我会这样进行配置，用以兼容以"-SNAPSHOT"结尾的版本号:
```
jar.manifest.attributes("Specification-Version": version.split("-")[0])
```

## 使用分析
打完包之后，我们就可以很happy的在组件启动时，进行版本检查：
```java
static{
    if(!TestMain.class.getPackage().isCompatibleWith("1.2.2")){
        //TODO 报一错出来
    }
}

其中的"1.2.2"可以配置在Lion或者Apollo这样的配置中心里，以统一管理。

不过蛋疼的是，不是所有的第三方包的jarfile里都自带版本信息的，比如上面的fastjson。。。
```

# 参考资料

[Gradle Docs](https://docs.gradle.org/current/userguide/building_java_projects.html#sec:jar_manifest)

[StackOverflow](https://stackoverflow.com/questions/20994766/jar-manifest-file-difference-between-specification-and-implementation)

[SOFA Ark](https://alipay.github.io/sofastack.github.io/)

[Java 自定义 ClassLoader 实现隔离运行不同版本jar包的方式](https://blog.csdn.net/t894690230/article/details/73252331)

[Java中隔离容器的实现](http://codemacro.com/2015/09/05/java-lightweight-container/)
