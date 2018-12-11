---
title: sofa-ark类隔离技术分析调研
id: 1
date: 2018-12-09 19:24:13
category:
 - Java
tags:
 - Java
 - 依赖管理
---

# 问题痛点
最近维护了一段时间的组件包，在向同事进行推广的时候，经常会听到身边会有类似的抱怨：
* 我靠，为啥你们的包带了一大堆乱七八糟的依赖，把我的classpath都给污染的不像个样子了。
* 我靠，你们这个包依赖的xx包的版本跟我们自己依赖的xx包的版本不一样啊，会不会出锅？
* 我靠，我这个代码编译的时候没问题啊，为啥一用你们的组件就报一堆的NoSuchMethodError啊。

有时候自己写代码的时候也会遇到一些容易被忽略的问题：
* 哎，我看人家引这个包的时候都会exclude一些依赖，我要不要也学着exclude一下呢？不管了，先一起粘过来试试看。
* 哎，怎么我的classpath里的某个包有三四个不同的版本啊，跑的时候到底用的是哪个版本啊？不管了，反正差不多，先跑跑看。
* 哎，我怎么直接就可以用这个类了，这个类是哪个包引的？不管了，反正IDE爸爸提示我能用，先用着再说。

大多数情况下，忽略这些问题一般也不会造成太大的影响，就算出了线上bug，一般也能很快定位问题、强制指定一下依赖的版本号就好。但是不得不说，依赖调解是普通java开发人员经常会遇到的问题，无谓的浪费了我们大量的时间和精力。尤其是当项目越来越大，用到的组件越来越多时，内耗就更加明显。

# 业内方案
大概研究了一下，目前对于本地依赖调解也没有什么很好的银弹。绝大多数情况下，我们都是在流程、文档上来进行把控。而从技术角度说，或许有如下几种方案供我们选择。

## OSGI技术
使用OSGI技术，用felix、karaf或者Jigsaw这样的容器对jar包进行暴露和隔离。
OSGI技术实际上是对代码进行了更高一级的抽象，将“模块”作为一个基本单位，用Bundle包对jar包再进行一级权限管理，将一些导入或导出的资源配置在Manifest文件里。这样我们就可以在Bundle层面进行功能的引入和暴露。同时也在bundle层面引入了Activator的概念，用来向外部模块暴露自身的服务、或者是注册一些生命周期的代码。

目前的OSGI技术社区还是比较完整的，很多知名公司的大型企业软件都在用了这个技术。不过其实大家采用这个技术主要还是为了做应用的热加载和热更新，仅仅用来做依赖隔离确实有点杀鸡用牛刀了。而且对于OSGI容器自身就是一个守护进程，他的使用、管理和维护都会有额外的代价。因此一般来说我们都认为OSGI技术太"重"，不适合小公司、小项目、或者是使用很多小项目组成大项目的互联网公司使用。

不过OSGI技术给我们提供了一个不错的思路，总结下来有如下几点：
1. 对Jar包进行更高级的抽象，并支持对类和资源访问控制。
2. 程序运行在一个容器中，由容器来启动和管理各个业务组件。
3. 每个业务组件有一个独立的ClassLoader，因此不同业务组件之间的依赖不会互相影响。
4. 支持组件向容器进行服务的注册，以及服务的互相调用。

## Gradle5.0特性
Gradle项目也对依赖调解这个问题做了一个不错的尝试。在Gradle5.0中引入了"java-library"插件，试图让组件开发方在编写组件代码时，主动控制好自己的依赖是否暴露给组件接入方（这个插件在老版本中也有，不过只有在5.0版本中在真正有用）。

什么意思呢？就是原本我们使用gradle来引包的时候是这么写的：
```gradle
dependencies {
    compile 'commons-httpclient:commons-httpclient:3.1'
    compile 'org.apache.commons:commons-lang3:3.5'
}
```
这么做的话，当组件接入方接入这个组件的时候，就会默认通过传递依赖也依赖了这两个包，这两个包就会出现在组件接入方开发人员的IDE的classpath里。

但是，如果组件开发方只希望将httpclient包传递依赖给接入方而不愿意将commons-lang3包暴露给接入方（毕竟commons-lang3在3.5版本的api变动还是有很多坑的），这时候就可以用Gradle5.0中"java-library"插件的新特性了，我们可以将dependencies重写为:
```gradle
dependencies {
    api 'commons-httpclient:commons-httpclient:3.1'
    implementation 'org.apache.commons:commons-lang3:3.5'
}
```
使用"java-library"插件之后，"compile"可以被"implementation"和"api"替代。对于组件本身来说，通过"api"或"implementation"引入的包都会被添加到classpath中。而"api"和"implementation"的唯一区别就是，在组件接入方的classpath中(实际上是compileClasspath)，将只会出现通过"api"引入的包，而不会出现通过"implementation"引入的包。也就是说，当业务方接入了拥有上面这种依赖的组件时，他只会引入httpclient包，而不会引入commons-lang3包。

咦？那么问题来了，少引入了一个包岂不是肯定会在运行时报错么？他gradle又是通过什么方式来传递依赖控制的信息呢？毕竟打成jar包后包里可是没有任何依赖信息的。

其实"java-library"做的事情很简单，就是在将jar包上传maven仓库时修改了pom.xml文件中各个依赖包的scope。对于通过"api"引入的依赖来说，scope就是compile；而对于通过"implementation"引入的依赖来说，他的scope就变成了runtime。

比如在上面的例子中，打包上传后的pom.xml中的依赖就大概是这样:
```xml
<dependencies>
    <dependency>
        <groupId>commons-httpclient</groupId>
        <artifactId>commons-httpclient</artifactId>
        <version>3.1</version>
        <scope>compile</scope>
    </dependency>
        <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
        <version>3.5</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

因此业务方在接入这个组件时，他的compileclasspath当然不会引入runtime的依赖了。但是要注意，在运行时，依旧还是会出现依赖冲突。。。

说白了，gradle5.0的这个功能对于解决依赖冲突这个问题来说，实在是有点饮鸩止渴，他实际上是将编译期的依赖冲突暂时隐藏了起来，等到运行时再暴露出来。我们的IDE中的classpath是干净了，但是该调解的冲突还是要调解，否则就会在运行时给你好看，那这又跟续一秒有啥区别。

当然，gradle的出发点是好的，至少通过api跟implementation让组件开发者明确了自己到底要暴露哪些包。况且通过这种方式来区分，要比写在注释或文档中进行区分要方便多了，而且好歹classpath干净了。

## Sofa-ark项目
事实上，为了从根本上解决类冲突问题，我们还是需要OSGI那种通过ClassLoader进行类隔离的思路。但是OSGI还是太"重"了，有没有稍微"轻"一点的技术呢？还好蚂蚁金服给我们提供了他们的一个不错的实践——Sofa-ark项目。

sofa-ark项目从概念上其实并没有什么石破天惊的独创，可以说他就是**用FatJar技术去实现OSGI的功能**。下面我们主要就来分析一下这个sofa-ark项目，在讲sofa-ark项目之前，我们先讲一下FatJar技术。

# Fat-jar技术
OSGI技术刚才大概讲过，那么FatJar技术又是什么呢？我们知道，在用打包插件对springboot项目进行打包时，打出来的那一个jar包是可以直接通过`java -jar `直接运行的。可要知道，这并不是天经地义的事情，通常情况下，如果要运行一个jar包，至少得满足两个条件：
1. 在jar包中的Manifest文件中要通过"Main-Class"属性，告诉jvm去启动哪个类的main函数。
2. 在jvm的classpath中要有项目所有依赖的jar包。

但我们要知道，在用springboot打包插件进行打包的时候，我们并没有指定`Main-Class`，而且也没有将依赖下载到classpath的过程。这是因为这一切都是由打包插件帮我们做掉了。在打出来的包里，已经包含了所有配置信息，以及依赖的jar包。这个包一般被称为`executable-jar`或者`fat-jar`。

springboot的一个典型的fat-jar大抵如此：
```
example.jar
 |
 +-META-INF
 |  +-MANIFEST.MF
 +-org
 |  +-springframework
 |     +-boot
 |        +-loader
 |           +-<spring boot loader classes>
 +-BOOT-INF
    +-classes
    |  +-mycompany
    |     +-project
    |        +-YourClasses.class
    +-lib
       +-dependency1.jar
       +-dependency2.jar
```
在对项目进行打包的时候，插件会把所有依赖的包下载好，放到一个自定义的文件夹下（这里是`BOOT-INF/lib`）。但是仅仅放进来也是不够的，因为jvm并不知道要去这里拿这些依赖。为此，在启动真正的项目之前，我们还要想办法加载这些依赖。所以你会发现在jar包中有一块`org.springframework.boot.loader`包的代码，并且如果你打开MANIFEST.MF查看你会发现类似下面的配置：
```
Manifest-Version: 1.0
Start-Class: mycompany.project.YourClasses
Spring-Boot-Classes: BOOT-INF/classes/
Spring-Boot-Lib: BOOT-INF/lib/
Spring-Boot-Version: 1.5.4.RELEASE
Main-Class: org.springframework.boot.loader.JarLauncher
```
也就是说，jar包在启动时实际上启动的是springboot自己的JarLauncher，通过这个JarLauncher去加载`lib`下的依赖，然后去启动`Start-Class`配置对应下的类（这个配置实际上是在用插件打包时扫描@SpringBootApplication注解得到的）。

以上就是Fat-Jar技术的基本原理，其实核心就在于要定义一套Jar包的文件规范，并且写一个打包插件按照这个规范打包，然后写一个Launcher进行解包、用依赖包配置ClassLoader、用反射调用实际main函数。

需要注意的是，如果仅仅是在IDE中运行代码，是完全感知不到打包逻辑的，因为IDE会自动帮你下载Jar包、指定classPath。

# Sofa-ark的工作原理
讲了那么多准备知识，接下来就进入正题，讲一讲sofa-ark项目到底是怎么一回事。

> 在继续阅读之前，最好先去看一下sofa-ark项目的基本使用，否则可能会有阅读难度。

sofa-ark项目自称是“一款基于Java实现的轻量级类隔离加载容器”。在这个项目中，会打三种类型的包：
* Ark包
* Ark Biz包
* Ark Plugin包

## Ark Plugin
Ark Plugin包我们可以理解为一个组件，与普通组件包不同的是，Ark Plugin包原则上是不包含任何类文件的（除非是shade的场景，这在0.4.0以后的版本才出现），他只是一些依赖的集合，并且通过MANIFEST文件对这些依赖集合中的类进行访问控制。事实上，一个Ark Plugin项目在代码层面其实完全可以当成一个普通的项目（在不注册服务的情况下）。Ark Plugin项目最大的特点就在于他的打包。

### 包结构
一个典型的Ark Plugin包解压后大致如下：
```
.
│
├── com
│   └── alipay
│       └── sofa
│           └── ark
│               └── plugin
│                   └── mark
│
├── META-INF
│   └── MANIFEST.MF
│
├── conf
│   └── export.index
└── lib
    ├── commons-lang3-3.3.1.jar
    ├── sample-plugin-1.0.0.jar
    └── sample-plugin-common-1.0.0.jar
```
可以看到这个包的结构很简单，主要是以下几个部分：
1. `com/alipay/ark/plugin/mark`文件来表示这是一个Ark Plugin包。
2. `MANIFEST.MF`文件，用来保存需要export或者import的包或者类，以及用于服务注册的Activator类。
3. `lib/`文件夹，用来保存项目依赖到的jar包，以及项目本身的jar包。
4. `conf/export.index`文件，通过解析MANIFEST文件，并扫描`lib/`文件夹，用于存储实际导出的类。

### MANIFEST文件
MANIFEST.MF文件样例如下：
```
Manifest-Version: 1.0
groupId: com.alipay.sofa
artifactId: sample-plugin
version: 1.0.0
priority: 2000
pluginName: sample-demo-plugin
activator: com.alipay.sofa.ark.service.impl.SampleActivator
import-packages: javax.servlet,org.springframework
import-classes: com.alipay.sofa.rpc.config.ProviderConfig
export-packages: com.alipay.sofa.ark.service
export-classes: com.alipay.sofa.ark.common.CommonUtils,com.alipay.sofa.mock
```
MANIFEST文件中的配置基本都是打包插件直接控制的，默认的`sofa-ark-plugin-maven-plugin`（注意中间有一个plugin）的配置如下：
```
<plugins>
    <plugin>
        <groupId>com.alipay.sofa</groupId>
        <artifactId>sofa-ark-plugin-maven-plugin</artifactId>
        <version>0.2.0</version>
        <executions>
            <execution>
                <id>default-cli</id>
                <goals>
                    <goal>ark-plugin</goal>
                </goals>

                <configuration>
    
                    <!-- 指定打包的 ${pluginName}.ark.plugin 存放目录; 默认放在 ${project.build.directory} -->
                    <outputDirectory>./</outputDirectory>
    
                    <!-- 是否把 ark plugin 安装、发布到仓库，默认为true -->
                    <attach>true</attach>

                    <!-- ark plugin 最多仅能指定一个 com.alipay.sofa.ark.spi.service.PluginActivator 接口实现类 -->
                    <activator>com.alipay.sofa.ark.service.impl.SampleActivator</activator>

                    <!-- 配置优先级，数字越小，优先级越高，优先启动，优先导出类，默认1000 -->
                    <priority>2000</priority>

                    <!-- 配置插件的名字，务必配置对，运行时，是插件的唯一标识 ID。比如 sofa-rpc 插件，可以配置为 sofa-rpc; 默认为 ${artifactId} -->
                    <pluginName>${ark.plugin.name}</pluginName>

                    <!-- 配置导入类、资源 -->
                    <imported>
                        <!-- 配置需要优先从其他 ark plugin 加载的 package -->
                        <packages>
                            <package>javax.servlet</package>
                            <package>org.springframework.*</package>
                        </packages>

                        <!-- 配置需要优先从其他 ark plugin 加载的 class -->
                        <classes>
                            <class>com.alipay.sofa.rpc.config.ProviderConfig</class>
                        </classes>
                        
                        <!-- 配置需要优先从其他 ark plugin 加载的资源 -->
                        <resources>
                            <resource>META-INF/spring/bean.xml</resource>>
                        </resources>
                    </imported>

                    <!-- 配置导出类、资源 -->
                    <exported>
                        <!-- 配置包级别导出的类 -->
                        <packages>
                            <package>com.alipay.sofa.ark.service</package>
                        </packages>

                        <!-- 配置类级别导出类 -->
                        <classes>
                            <class>com.alipay.sofa.ark.common.CommonUtils</class>
                            <class>com.alipay.sofa.mock</class>
                        </classes>
                        
                        <!-- 配置 ark plugin 对外导出的资源 -->
                        <resources>
                            <resource>META-INF/spring/bean.xml</resource>>
                        </resources>                        
                    </exported>

                    <!-- 打包插件时，排除指定的包依赖；格式为: ${groupId:artifactId} 或者 ${groupId:artifactId:classifier} -->
                    <excludes>
                        <exclude>org.apache.commons:commons-lang3</exclude>
                    </excludes>

                    <!-- 打包插件时，排除和指定 groupId 相同的包依赖 -->
                    <excludeGroupIds>
                        <excludeGroupId>org.springframework</excludeGroupId>
                    </excludeGroupIds>

                    <!-- 打包插件时，排除和指定 artifactId 相同的包依赖 -->
                    <excludeArtifactIds>
                        <excludeArtifactId>sofa-ark-spi</excludeArtifactId>
                    </excludeArtifactIds>

                </configuration>
            </execution>

        </executions>
    </plugin>
</plugins>
```

### lib文件夹
`lib/`目录下存放的jar包，不仅包含了项目依赖的包，而且包含了项目自身的jar包。也就是说，Ark Plugin的包和原生jar包的关系并不是"代替"或是"扩展"，而是"包含"。

当然，由于plugin包和原生jar包是共用的同一个maven坐标，因此，我们就要用maven的"classifier"属性来区别。默认原生jar包的"classifier"就是空，而默认plugin包的"classifier"就是"ark-plugin"(由于版本不一致问题，最好还是在打包插件中显式指定一下classifier)。

当我们将打出来的包上传到Nexus或者其他maven包管理中心时，事实上我们会上传一个pom文件、两个jar包、以及一些自动生成的校验文件：
```
├── plugin-test-1.0-20181203.131726-1-ark-plugin.jar
├── plugin-test-1.0-20181203.131726-1-ark-plugin.jar.md5
├── plugin-test-1.0-20181203.131726-1-ark-plugin.jar.sha1
├── plugin-test-1.0-20181203.131726-1.jar
├── plugin-test-1.0-20181203.131726-1.jar.md5
├── plugin-test-1.0-20181203.131726-1.jar.sha1
├── plugin-test-1.0-20181203.131726-1.pom
├── plugin-test-1.0-20181203.131726-1.pom.md5
└── plugin-test-1.0-20181203.131726-1.pom.sha1
```
但是你会发现，Ark Plugin包和原生jar包事实上还是共用了同一个pom文件！这就意味着，当业务项目依赖了Ark Plugin包时，我们仍然会默认传递依赖进这个项目的间接依赖。这样的结果就是，即使Ark Plugin项目已经将自己的依赖添加到了jar包的lib目录下，但是这些依赖依然会出现在业务项目的classpath中。但是我们又不能将这些依赖全部排除掉，毕竟这里面还有业务方真正用到的那些类。

这显然不是我们期望看到的局面，虽然在运行时类是隔离的，但是在编译期，那些间接依赖还是会充斥业务开发人员的IDE中。

为了解决这个问题，在0.4.0版本后，在打包Ark Plugin时，增加了一个shade属性，用于指定需要shade进来的jar包的maven坐标。

所谓shade，就是指将某个jar包中所有的内容，复制到当前的jar包中。这就相当于我们在Ark plugin包中添加进了被shade进来的jar包的所有内容。这样做的好处就是，即使业务在使用时exclude了Ark Plugin包的所有依赖，业务在编译期仍然能正常使用那些shade进来的类。当然，这样做的前提是，我们需要在Ark Plugin包中导出这些类、告诉Ark Container，这些类是使用这个Ark Plugin来加载的。

因此，当我们在编写Ark Plugin时，我们应当遵循这样的规范，就是将那些需要暴露给业务方的接口作为一个模块，shade进Ark Plugin中，然后将这个模块导出，而将那些内部逻辑需要用到的一切都隐藏起来。当业务方调用这个Ark Plugin时，可以放心的将他所有的依赖排除掉。这样就既做到了编译期不引入间接依赖，又做到了运行期的依赖隔离。

### export.index文件
`conf/export.index`文件是根据MANIFEST文件中配置的`export`的信息扫描`lib`文件夹中的jar包得到的。一个典型的样例如下：
```
com.example.test.sofa.TestLib1
com.example.test.sofa.TestLib2
com.example.test.sofa.TestLib3
```
在Ark Plugin包中，最重要的其实就是这个`conf/export.index`文件，就是他告诉容器“到底什么类需要通过这个Ark Plugin进行加载”，如果有多个plugin 声明了相同的类，那么则会根据priority进行选择，判断一个类到底是用哪一个插件的ClassLoader来加载。

## Ark Biz
Ark Biz包实际上就是一个业务的包，是在多个ark plugin的基础上真正执行业务逻辑的基本单位。在用`sofa-ark-maven-plugin`打包时，会同时生成两个包，一个是Ark包，一个就是Ark Biz包。Ark Biz包的基本结构如下:
```
.
├── META-INF
│   └── MANIFEST.MF
├── com
│   └── alipay
│       └── sofa
│           └── ark
│               └── biz
│                   └── mark
├── lib
│   ├── spring-beans-4.3.4.RELEASE.jar
│   ├── spring-boot-1.4.2.RELEASE.jar
│   ├── spring-boot-autoconfigure-1.4.2.RELEASE.jar
│   ├── ...
│   └── velocity-1.7.jar
└── com
    └── example
        └── test
            └── TestMain.class

```
首先肯定会有个`com/alipay/sofa/ark/biz/mark`文件，告诉容器这是一个biz包。同时，我们也要注意到，biz包是不会将ark plugin依赖添加到自己的lib文件夹下的。

然后我们来看下Manifest文件:
```
Manifest-Version: 1.0
deny-import-classes: 
Ark-Biz-Name: sofa-test
deny-import-resources: 
deny-import-packages: 
Ark-Biz-Version: 1.1-SNAPSHOT
priority: 100
Main-Class: com.example.test.TestMain
```

虽然在他的MANIFEST文件中有"Main-Class"属性，指定了要执行的类，这个包只能算是半个可执行文件。因为他缺少了实际运行时的容器，所以如果要强行跑的话肯定是会报错。

慢着，我们在打包时都没有指定Main-Class，如果是非SpringBoot项目，甚至都没有加@SpringBootApplication注解，那么打包插件是怎么知道我要运行的是哪一个类呢？其实是打包插件做了一个很"呆"的处理：

com.alipay.sofa.ark.tools.MainClassFinder:
```java
    private String getMainClassName() {
        Set<MainClass> matchingMainClasses = new LinkedHashSet<>();
        if (this.annotationName != null) {
            for (MainClass mainClass : this.mainClasses) {
                if (mainClass.getAnnotationNames().contains(this.annotationName)) {
                    matchingMainClasses.add(mainClass);
                }
            }
        }
        if (matchingMainClasses.isEmpty()) {
            matchingMainClasses.addAll(this.mainClasses);
        }
        if (matchingMainClasses.size() > 1) {
            throw new IllegalStateException(
                "Unable to find a single main class from the following candidates "
                        + matchingMainClasses);
        }
        return matchingMainClasses.isEmpty() ? null : matchingMainClasses.iterator().next()
            .getName();
    }
```
事实上他会去找有@SpringBootApplication注解的类，这一点与SpringBoot的打包插件类似；如果找不到，那么就检测所有的类中有Main函数的，如果找到且只找到一个就皆大欢喜，否则就报错给你看。。。(平时喜欢在main函数里写测试用例而且还不记得删的同学要注意了哈)



回到上面的话题，既然Biz包都跑不动，我们为啥要生成他呢？事实上从这就看出sofa-ark项目的本质了。sofa-ark项目其实是一个以Ark Container为核心的容器生态。Ark Container可以被理解为OSGI中的那个守护进程，用来管理业务包和插件包，只不过Ark Container不是一个守护进程而只是一个启动类罢了。既然是容器，那么就肯定要支持多应用，Container就要和Biz解耦，从而做到一个Container可以运行多个Biz和多个Plugin。

对于单个应用的项目，我们当然可以不要Ark Biz包，而是直接用Container包装起来，做成一个可执行文件。但是如果需要多个业务同时运行，我们就可以以Biz包的形式，一个一个往容器里加了。

## Ark包

### 包结构
有了上面的基础，Ark包就很好理解了，它实际上就是一个Ark Container实例，里面存放了需要加载的Biz和Plugin。包结构大致如下:
```
.
├── META-INF
│   └── MANIFEST.MF
├── SOFA-ARK
│   ├── biz
│   │   └── sofa-boot-demo-web-1.0-SNAPSHOT-sofa-ark-biz.jar
│   ├── container
│   │   ├── META-INF
│   │   │   └── MANIFEST.MF
│   │   ├── com
│   │   │   └── alipay
│   │   │       └── sofa
│   │   │           └── ark
│   │   └── lib
│   │       ├── aopalliance-1.0.jar
│   │       ├── guava-16.0.1.jar
│   │       ├── guice-4.0.jar
│   │       ├── guice-multibindings-4.0.jar
│   │       ├── javax.inject-1.jar
│   │       ├── log4j-1.2.17.jar
│   │       ├── slf4j-api-1.7.21.jar
│   │       ├── slf4j-log4j12-1.7.21.jar
│   │       ├── sofa-ark-archive-0.1.0.jar
│   │       ├── sofa-ark-common-0.1.0.jar
│   │       ├── sofa-ark-container-0.1.0.jar
│   │       ├── sofa-ark-exception-0.1.0.jar
│   │       ├── sofa-ark-spi-0.1.0.jar
│   │       └── sofa-common-tools-1.0.11.jar
│   └── plugin
│       └── sofa-ark-rpc-plugin-2.2.5-ark-plugin.jar
└── com
    └── alipay
        └── sofa
            └── ark
                ├── bootstrap
                │   ├── ArkLauncher.class
                │   ├── ClasspathLauncher$ClassPathArchive.class
                │   ├── ClasspathLauncher.class
                │   ├── ContainerClassLoader.class
                │   ├── EntryMethod.class
                │   ├── ExecutableArchiveLauncher.class
                │   ├── Launcher.class
                │   ├── MainMethodRunner.class
                │   └── SofaArkBootstrap.class
                ├── loader
                │   ├── DirectoryBizModuleArchive.class
                │   ├── ExecutableArkBizJar$1.class
                │   ├── ExecutableArkBizJar$2.class
                │   ├── ExecutableArkBizJar$3.class
                │   ├── ExecutableArkBizJar.class
                │   ├── JarBizModuleArchive$1.class
                │   ├── JarBizModuleArchive.class
                │   ├── JarContainerArchive$1.class
                │   ├── JarContainerArchive.class
                │   ├── JarPluginArchive$1.class
                │   ├── JarPluginArchive.class
                │   ├── archive
                │   ├── data
                │   └── jar
                └── spi
                    └── archive
```
这个包实际上就是shade进了Ark Container的Jar包，在`SOFA-ARK/biz`和`SOFA-ARK/plugin`目录下分别保存了需要加载的业务包和插件包。

### Manifest文件

他的Manifest文件大致如下：
```
Manifest-Version: 1.0
Implementation-Title: sofa-ark-all
Implementation-Version: 0.1.0
Archiver-Version: Plexus Archiver
Built-By: qilong.zql
Sofa-Ark-Version: 0.1.0
Specification-Title: sofa-ark-all
Implementation-Vendor-Id: com.alipay.sofa
Main-Class: com.alipay.sofa.ark.bootstrap.ArkLauncher
Ark-Container-Root: SOFA-ARK/container/
Created-By: Apache Maven 3.2.5
Build-Jdk: 1.8.0_101
Specification-Version: 0.1.0
ArkVersion: 0.1.0
Timestamp: 2018-03-13T18:13:06Z
```
在执行Ark包时，他会启动ArkLauncher，用来启动Ark Container并加载业务包和插件包(每一个业务包和插件包都有自己独立的ClassLoader)然后再去启动每一个业务包。

### 类加载
最后我们再来简单看下，Ark Container是如何用ClassLoader进行运行时类隔离的。

以BizClassLoader为例，BizClassLoader用来控制每一个Biz加载类的逻辑。显然默认的委托模型是不中的，BizClassLoader采用了如下逻辑：


com.alipay.sofa.ark.container.service.classloader.BizClassLoader：
```java
    @Override
    protected Class<?> loadClassInternal(String name, boolean resolve) throws ArkLoaderException {

        // 1. sun reflect related class throw exception directly
        if (classloaderService.isSunReflectClass(name)) {
            throw new ArkLoaderException(
                String
                    .format(
                        "[ArkBiz Loader] %s : can not load class: %s, this class can only be loaded by sun.reflect.DelegatingClassLoader",
                        bizIdentity, name));
        }

        // 2. findLoadedClass
        Class<?> clazz = findLoadedClass(name);

        // 3. JDK related class
        if (clazz == null) {
            clazz = resolveJDKClass(name);
        }

        // 4. Ark Spi class
        if (clazz == null) {
            clazz = resolveArkClass(name);
        }

        // 5. Plugin Export class
        if (clazz == null) {
            clazz = resolveExportClass(name);
        }

        // 6. Biz classpath class
        if (clazz == null) {
            clazz = resolveLocalClass(name);
        }

        // 7. Java Agent ClassLoader for agent problem
        if (clazz == null) {
            clazz = resolveJavaAgentClass(name);
        }

        if (clazz != null) {
            if (resolve) {
                super.resolveClass(clazz);
            }
            return clazz;
        }

        throw new ArkLoaderException(String.format("[ArkBiz Loader] %s : can not load class: %s",
            bizIdentity, name));
    }
```
可以说这段代码写的逻辑很清楚，当Biz在运行时发现一个类需要被加载时，他会按照如下步骤搜索:
1. 如果已加载过，那就返回已加载好的那个类。
2. 如果这个类是JDK自己的，那么就用JDKClassLoader去加载。
3. 如果这个类是属于Ark容器的，那么就用ArkClassLoader去加载。
4. 如果这个类是某个插件export的，那么就用ExportClassLoader去加载。
5. 如果这个类是我业务自己的，那么就用当前的ClassLoader直接loadClass就好。
6. 否则就去试试是不是用了某个java agent。
7. 再找不到就报错给你看。

# 其他能力

上面的文章中，我们只是专注于使用sofa-ark进行类隔离。事实上他也支持类似OSGI的那种服务发布、热加载和热部署。

## 服务发布
利用Activator，你可以很方便的以jvm服务的形式发布plugin的服务。不过这不是我使用的重点，我也就没有过多研究。

## 热加载
当你启动ark包时，你会发现你的1234端口开放了一个telnet接口，当然这个端口默认是没有任何用的。不过当你引入了sofa-jarslink项目，你就真的可以像使用OSGI容器一样的利用这个端口动态管理你的Biz和Plugin了。

# 启动方式
## 非Springboot应用
在非SpringBoot中，Sofa-ark的Biz通过引入`sofa-ark-support-starter`，并且在主函数中显式launch来启动。
```
public class TestMain {
    public static void main(String[] args) {
        SofaArkBootstrap.launch(args);
        //TODO do your business
    }
}
```
注意到这个launch方法一定要是main函数的第一个方法。否则在他之前的代码就会被执行两次。

如果是在IDE中启动，那么这个launch方法会自己起一个Ark容器，然后再用反射重新调用自己的main函数。
如果是打包后启动，那么创建Ark容器的任务就交给了启动类了了，这个launch方法将不做任何事情。

## SpringBoot应用
在SpringBoot中，Sofa-ark的Biz通过引入`sofa-ark-springboot-starter`来启动。这个starter注册了spring的启动事件，并且在启动事件中调用SofaArkBootstrap.launch函数。其他的过程就和非SpringBoot应用类似了。

## IDE启动和打包启动的区别
为什么前面我们要区分IDE启动和非IDE启动呢？因为这两种启动方式不只是启动逻辑不同，执行逻辑也不一样。

在IDE中启动时，由于主类的静态代码块是会在容器启动之前就会加载一次的。可是在容器起来之后，由于容器会用心的ClassLoader再反射调用主类的main函数，因此他又会被加载一次，这一点需要额外注意。

但是，如果是打包后启动呢？容器的启动是在启动类中完成的、而不是主类，因此主类的静态代码块就会正常只被执行一次，这样就不会有问题了。

# 已知问题
关于sofa-ark项目，前前后后研究了一个礼拜的样子，也稍微有了一些使用心得，再总结一下这个项目的不足：
1. 用fatJar技术做依赖隔离其实并不优雅。因为不同插件实在是会引入很多重复的包，会导致最终的jar包很大。虽然plugin层可以复用，但是还是会有一些重复jar包的。
2. 目前采用的日志框架是蚂蚁内部的框架，实在是太丑陋，而且不支持关闭，用起来很难受。
3. 没有官方gradle插件，且开发组据说一时半会也不会考虑支持。当然，写起来其实不困难，为了内部使用，我没办法就只能自己花了点时间写了一套，先自己用一段时间看看。
4. 社区不够完善。这个项目刚开源也没多久，用的人也不是很多，所谓的社区也就只有github的issue了。而且看上去开发组也很忙，很多特性的支持都很慢。
5. 对应用侵入性比较强，有风险。为了运行sofa-ark，项目的整体打包逻辑都要变，而且代码都是跑在Ark Container里面，对于一个社区都不完善的不是很成熟的项目来说，这么用还是有很大风险的。
6. 对依赖进行导入导出的管理引入了一定的复杂性，还是有一定学习成本的。

最后再强调一点，sofa-ark项目并不是解决依赖冲突问题的银弹。对于一个已有的、已经使用了很多富客户端二方包的项目，迁移到sofa-ark后，你会经常发现很多"ClassCastException"。这是因为由不同Classloader创建的类是不一样的，不能将一个ClassLoader创建的实例，赋给由另一个ClassLoader声明的类。在springboot项目中，这种问题经常会发生。

因此，在已有的生态中仅仅是为了做依赖隔离而接入sofa-ark并不是一件省心的事情，各位还要慎用。

# 参考资料
[探索 OSGi 框架的组件运行机制](https://www.ibm.com/developerworks/cn/java/j-lo-osgi/index.html)

[gradle 5.0 The Java Library Plugin](https://docs.gradle.org/current/userguide/java_library_plugin.html#header)

[Spring Doc:The Executable Jar Format](https://docs.spring.io/spring-boot/docs/current/reference/html/executable-jar.html)

[sofa-ark Github](https://github.com/alipay/sofa-ark)

[sofa-stack官网文档](https://alipay.github.io/sofastack.github.io/docs/)

[Java隔离容器之sofa-ark使用说明及源码解析](https://juejin.im/post/5b6b982451882569fd2898d7)


