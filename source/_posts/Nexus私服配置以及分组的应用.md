---
title: Nexus私服配置以及分组的应用
id: 1
date: 2017-07-08 16:45:46
category:
 - Java
tags:
 - Java
 - Maven
---

## 前言
阴差阳错的实习部门分到了Agile Controller Campus的运维(或许吧)部门，部门主要任务大概是控制构建自动化测试的流水线，控制项目各个模块的项目进展以及维护版本一致等。本来指望能进来敲敲代码的，结果发现在这里基本不用写代码，主要是使用内部软件做好项目的配置工作，这倒是我之前一直没有接触过的工作，接触了两天，感觉还是挺有意思的，能从项目的上层了解到整个项目的架构，从整体上理解一个大型团队的工作方式，这里面的学问不比码代码少。
我接到的第一个任务就是一个实际中出现的问题。

## 问题
我们知道在大型的Java项目中，经常是一个小组负责一个模块，一个项目由好几个模块组成。如果各个模块之间有着某种依赖关系，那么在互相调用的时候，一定是要调用其他模块的稳定版本(即上一次测试通过的版本)，在自己调试的时候，测试和发布的是自己的不稳定版本。显然，这就要求各个模块在开发的时候需要相互隔离，最简单的做法就是对每一个小组开一个nexus私服用来托管其他模块的包以及自己开发的包，每此集成测试时都从各个私服中取出最新的模块，测试通过后再同步更新给各个私服。
显然，这样的话每一个小组都得维护一个自己的私服，每次集成时也要从各个私服去取，既浪费资源，而且脚本写起来比较非常麻烦。

## 解决思路
事实上，Nexus作为"世界第一也是唯一的免费通用仓库管理解决方案"，对这类问题有着非常好的解决方式。当然首先，我们得理清楚maven的版本控制层次。
在maven的世界里，原则上所有的包都由他的三维唯一确定:groupId,artifactId,version。但是，其实还有另外一个维度，那就是repository。这也很好理解，毕竟并不是所有的包都发布在全球统一的仓库，还有各个组织或个人私自搭建的仓库，用来托管自己的包。只要我们指定从不同的仓库里获取包，我们就可以做到即使是相同的三维，也有可能获取到不同的代码。

在Nexus里，至少提供了四种不同类型的仓库:

**宿主类型(hosted)**
hosted类型表示这是我们自己搭建的仓库，我们可以向这个仓库里添加自己需要的包，就像是搭建一个属于自己的中心仓库一样。

**代理类型(proxy)**
proxy类型存在的意义在于，在使用自己的私服时，如果仍需要从maven中心仓库去获取公开的包的时候，我们可以不需要额外指定中心仓库，而是使用这个代理类型的仓库，并且让这个仓库去指向那个中心仓库。默认配置的中心仓库名是central，指向远程的中心仓库"https://repo1.maven.org/maven2/"。这个类型的仓库原则上不能配置自己的包，他只能作为访问远程仓库的代理来使用。

**虚拟类型(virtual)**
这个类型的仓库一般不怎么用到，他主要是为了保证不同类型仓库之间的兼容。比如我们可以用它将一个maven2类型的仓库转成maven1类型的仓库。

**组类型(group)**
这是最能体现Nexus灵活性的一个配置。上面的这些类型的仓库，无论哪一种，其实都是实实在在的仓库，他们分别都能很好的独立使用，但是如果我们需要配置一个仓库，这个仓库里包含不同类型的仓库，那么我们就需要配置一个组，用这个组来包含不同类型的仓库。而这个组类型本身保存的并不是实实在在的仓库，而是对这些仓库的引用。
需要注意的是，组类型可以嵌套，但是他们不存在层级关系。也就是说如果group1包含了repo1,repo2,group2，那么实际上group1就直接包含了repo1,repo2和group2里的所有包，而且并没有这些中间的层级。

那么我们要做的事情就很简单了，我们只要在同一个私服上，对每一个模块开发小组新建不同的组类型的仓库，每一个小组的仓库里包含的都是自己模块的不稳定版以及其他模块的稳定版本。这样当每一次集成测试时，从每个小组的仓库组里获得最新的版本作为一个新组，对他进行测试并且通过后再用这个新组里的每个模块(稳定版本)去更新旧的模块即可。

## maven配置
这里顺便记分析下maven的配置。
maven的配置文件就是settings.xml了，这个文件的基础配置大概是这样的:
```xml
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
      <localRepository/>
      <interactiveMode/>
      <usePluginRegistry/>
      <offline/>
      <pluginGroups/>
      <servers/>
      <mirrors/>
      <proxies/>
      <profiles/>
      <activeProfiles/>
    </settings>
```
各个标签的具体用法可以参考官方文档，下面大体解释下一些重要配置。

**localRepository**
```xml
<localRepository>/path/to/local/repo</localRepository>
```
这个配置指明了本地maven库的包的地址。由于我们在使用maven时，可能会经常使用一些相同的包，为了提高提取效率以及减少中心库的压力，maven在第一次从远程下载某个包的时候就会将它放在本地的库中，方便以后直接取用。需要注意的是，在某些情况下，我们需要手动删除这里的包来保证我们使用的是最新版本的包。这个配置的默认值是在用户家目录下的.m2文件夹中，非常好找。

**servers**
```xml
  <servers>
    <server>
      <id>releases</id>
      <username>admin</username>
      <password>admin123</password>
    </server>
  </servers>
```
这个配置的目的在于，当我们要向私服中去deploy自己的包的时候，显然我们至少得有写入的权限，这里就定义了已知server的用户名和密码，以及这个server的唯一ID。当我们在项目的pom.xml里添加发布的配置时
```xml
    <distributionManagement>
        <repository>
            <id>releases</id>
            <name>Nexus Release Repository</name>
            <url>http://localhost:8081/nexus/content/repositories/test/</url>
        </repository>
    </distributionManagement>
```
只要指定正确仓库的id就可以定位到相同id的server，并从中获取用户名和密码。

**profiles**
```xml
  <profiles>
    <profile>
      <id>nexus</id>
      <activation>
        <jdk>1.8</jdk>
      </activation>
      <repositories>
        <repository>
          <id>nexus</id>
          <name>Repository for JDK 1.8 builds</name>
          <url>http://localhost:8081/nexus/content/groups/test-group</url>
          <layout>default</layout>
          <snapshotPolicy>always</snapshotPolicy>
        </repository>
      </repositories>
    </profile>
  </profiles>
```
profiles里指定了我们的maven获取包的远程仓库的地址，每一个仓库都有一个唯一的ID以及相应的url。我们可以保存不同的profile配置，每一个配置方案也有一个唯一的ID，我们只要在后面添加下面的配置就能够选择激活的profile配置。
```xml
  <activeProfiles>
    <activeProfile>nexus</activeProfile>
  </activeProfiles>
```

**mirrors**
```xml
  <mirrors>
    <mirror>
      <id>mirrorId</id>
      <mirrorOf>repositoryId</mirrorOf>
      <name>Human Readable Name for this Mirror.</name>
      <url>http://mirrorURL/</url>
    </mirror>
  </mirrors>
```
mirrors配置的意义在于，我们有时候在获取中心库的包的时候，由于网络的原因会导致下载太慢，这时候我们就想使用一些网络较好的镜像来代替那个中心库。这里的mirrorOf参数配置的就是我们希望替代的repositoryId(支持多选，反选等等)。将镜像地址保存在url里。

**proxies**
```xml
  <proxies>
    <proxy>
      <id>optional</id>
      <active>true</active>
      <protocol>http</protocol>
      <username>proxyuser</username>
      <password>proxypass</password>
      <host>proxy.host.net</host>
      <port>80</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
    </proxy>
  </proxies>
```
proxies配置主要是用来在某些情况下通过配置用户密码，做到使用代理访问远程仓库。主要用到的场景大概就是远程仓库库被GFW墙了或者本机没有外网权限，等需要使用代理的地方。

## Nexus脚本思路
有时候，我们可能需要一次行建大量的仓，或者需要重复这样的操作。每次都手动点击确认的话，不仅效率地下，而且容易出错，很不Unix。其实说白了这个Nexus的界面只是一个壳，我们点击操作的背后其实是修改Nexus的配置文件。这个配置文件通常是在`$NEXUS_HOME/sonatype-work/nexus/conf/nexus.xml`这里。
大概看一看:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<nexusConfiguration>
 ...
  <repositories>
...
    <repository>
      <id>public</id>
      <name>Public Repositories</name>
      <providerRole>org.sonatype.nexus.proxy.repository.GroupRepository</providerRole>
      <providerHint>maven2</providerHint>
      <localStatus>IN_SERVICE</localStatus>
      <notFoundCacheTTL>15</notFoundCacheTTL>
      <userManaged>true</userManaged>
      <exposed>true</exposed>
      <browseable>true</browseable>
      <writePolicy>READ_ONLY</writePolicy>
      <indexable>true</indexable>
      <localStorage>
        <provider>file</provider>
      </localStorage>
      <externalConfiguration>
        <mergeMetadata>true</mergeMetadata>
        <memberRepositories>
          <memberRepository>snapshots</memberRepository>
          <memberRepository>thirdparty</memberRepository>
          <memberRepository>central</memberRepository>
          <memberRepository>releases</memberRepository>
        </memberRepositories>
      </externalConfiguration>
    </repository>
    
    <repository>
      <id>test</id>
      <name>Test</name>
      <providerRole>org.sonatype.nexus.proxy.repository.Repository</providerRole>
      <providerHint>maven2</providerHint>
      <localStatus>IN_SERVICE</localStatus>
      <notFoundCacheTTL>1440</notFoundCacheTTL>
      <userManaged>true</userManaged>
      <exposed>true</exposed>
      <browseable>true</browseable>
      <writePolicy>ALLOW_WRITE</writePolicy>
      <indexable>true</indexable>
      <searchable>true</searchable>
      <localStorage>
        <provider>file</provider>
      </localStorage>
      <externalConfiguration>
        <repositoryPolicy>SNAPSHOT</repositoryPolicy>
      </externalConfiguration>
    </repository>
    ...
  </repositories>
...
</nexusConfiguration>
```
这样一看就很清楚了，我们所有的手动操作其实都是映射到这个文件中。只是需要注意当我们手动修改了这个配置文件之后，我们得重启Nexus服务。。。


## 参考资料
[Nexus Document](https://books.sonatype.com/nexus-book/reference/confignx-sect-manage-repo.html)
[Maven Document](http://maven.apache.org/guides/)
[Maven学习五之Nexus中各repository介绍](http://blog.csdn.net/woshixuye/article/details/8132780)
[Nexus私服使Maven更加强大](http://blog.csdn.net/liujiahan629629/article/details/39272321)