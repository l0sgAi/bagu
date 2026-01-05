# 🍀Spring框架相关

---

# I. IOC

### 1. 定义

IOC即控制反转，是Spring的一个核心特性，它支持将对象实例统一交给IOC容器进行管理，DI即依赖注入，是 IoC 的具体**实现方式**。容器在运行期间，动态地通过@Resource、@Autowired或构造器注入来将某种依赖关系注入到对象之中。

好处有：

- **解耦**：对象之间不再硬编码依赖，方便替换实现类，使得程序的体系结构灵活。

- **易于测试**：可以通过 Mock 轻易替换掉复杂的依赖。

- **集中管理**：对象的生命周期由容器统一配置，更加规范。

### 2. 生命周期

 **Bean 的生命周期是怎样的？（重点，建议背诵核心步骤）**

1. **实例化**（Instantiate）：JVM 给对象分配空间（即 new）。

2. **属性赋值**（Populate）：解析 @Autowired 等，注入依赖。

3. **初始化**（Initialization）：
   
   - 执行各种 Aware 接口方法（获取 BeanName, BeanFactory 等）。
   
   - 执行 BeanPostProcessor 的**前置**处理。
   
   - 执行 @PostConstruct 或 init-method。
   
   - 执行 BeanPostProcessor 的**后置**处理（**AOP 在这里发生**）。

4. **销毁**（Destruction）：执行 @PreDestroy 或 destroy-method。

 **注入方式有哪些？**

- **构造器注入**@RequiredConstructArgs（Spring 推荐：保证依赖不为空，避免循环依赖）。

- **Setter 注入**（可选依赖）。

- **注解注入**（@Autowired、@Resource）。

### 3. 进阶

**Spring 如何解决循环依赖？**

- Spring 通过**三级缓存**解决了**单例 Setter 注入**的循环依赖。
  
  - **一级缓存**：存放完全初始化好的成品 Bean。
  
  - **二级缓存**：存放半成品 Bean（已实例化但未填充属性）。
  
  - **三级缓存**：存放 ObjectFactory（工厂 Lambda），用于处理 AOP 代理对象的提前暴露。

- 注意：构造器循环依赖无法解决（会报 BeanCurrentlyInCreationException），其实循环依赖应该在编码阶段就要尽量避免。

---

# II. AOP

> AOP即面向切面编程，它将非业务功能的一些通用功能组件（如日志增强、信息缓存等）通用操作统一封装，并通过注解等方式在业务方法中的横切关注点注入这些增强代码，做到了公用代码逻辑的复用与解耦，提高了系统的可维护性和健壮性。

### 1. 身份声明：你是谁？

- **@Aspect**：告诉 Spring，“我是一个切面类，我里面写了拦截逻辑”。

- **@Component**：告诉 Spring，“请把我也当成一个 Bean 存到容器里”，否则切面不会生效。

### 2. 目标定位（在哪里干？）：

- **@Pointcut + 表达式**：这就像是一个“**过滤器**”或者“**扫描范围**”。
  
  - 它定义了哪些类的哪些方法需要被增强（被拦截）。
  
  - 它本身不写逻辑，只是起一个“起名字”的作用，方便后面引用。

### 3. 通知与逻辑（什么时候干？干什么？）：

- **通知注解（@Before / @After 等）**：指定了**“什么时候干”**（是在目标方法执行前、后，还是异常时）。

- **注解指向的 Pointcut**：关联了**“在哪里干”**（引用刚才定义好的切入点名称）。

- **方法体内的代码**：就是具体的**“增强逻辑”**（即：干什么，比如打印日志、检查权限）。

| **@Aspect**         | 切面声明 | 声明该类是一个切面类，包含通知和切入点。                             |
| ------------------- | ---- | ------------------------------------------------ |
| **@Pointcut**       | 切入点  | 定义拦截规则（哪些类的哪些方法需要被拦截）。避免重复写 execution 表达式。       |
| **@Before**         | 前置通知 | 在目标方法**执行前**运行。常用于权限校验、参数预处理。                    |
| **@After**          | 后置通知 | 在目标方法**执行后**运行（不论成功或异常）。常用于释放资源。                 |
| **@AfterReturning** | 返回通知 | 在目标方法**正常完成后**运行。可以获取并处理方法的返回值。                  |
| **@AfterThrowing**  | 异常通知 | 在目标方法**抛出异常后**运行。用于异常监控、日志报警。                    |
| **@Around**         | 环绕通知 | **功能最全**。包围了整个方法执行。可以手动控制 proceed() 的调用，甚至替换返回值。 |

---

# III. 其它

### 3.1 Spring的事务传播机制

**Spring 的事务传播机制（Transaction Propagation）** 是 Spring 事务管理中非常重要的概念。它主要解决的问题是：**当一个事务方法被另一个事务方法调用时，这个被调用的方法应该如何进行事务控制？**

例如：方法 A（有事务）调用了方法 B（也有事务注解），那么方法 B 是加入方法 A 的事务？还是自己新开一个事务？还是报错？这就是传播机制要规定的。

Spring 定义了 **7 种** 事务传播机制，记住主要的3种即可。

---

这三种是开发中最常遇到的，必须掌握。

#### 1. REQUIRED (默认值)

- **含义**：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。

- **场景**：这是 Spring @Transactional 的默认行为。

- **举例**：
  
  - A 调用 B。
  
  - 如果 A 有事务，B 就加入 A 的事务（它俩是同一个事务，要么一起成功，要么一起失败）。
  
  - 如果 A 没有事务，B 就自己开启一个新事务。

#### 2. REQUIRES_NEW

- **含义**：无论当前是否存在事务，都创建一个新的事务。如果当前存在事务，则把当前事务**挂起（Suspend）**。

- **特点**：两个事务完全独立，互不干扰。

- **举例**：
  
  - A 调用 B，B 的传播机制是 REQUIRES_NEW。
  
  - A 执行到 B 时，A 暂停。B 开启新事务，执行完并提交（或回滚）。
  
  - 然后 A 恢复并继续执行。
  
  - **关键点**：如果 B 报错回滚了，只要 A 捕获了异常，A 可以继续提交；如果 A 后面报错回滚了，B 已经提交了，不会受 A 的影响（B 不会回滚）。

- **应用**：写日志。不管主业务逻辑（A）是否成功，日志（B）都必须保存下来。

#### 3. NESTED

- **含义**：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则按 REQUIRED 属性执行。

- **特点**：它是 JDBC 的 **SavePoint（保存点）** 机制。它是主事务的一部分，但是可以独立回滚。

- **举例**：
  
  - A 调用 B。
  
  - A 开启事务，执行到 B 时，设置一个保存点。
  
  - B 执行。如果 B 报错，只回滚到 B 执行之前的保存点，A 可以选择捕获异常并执行其他逻辑（A 不一定会回滚）。
  
  - **关键点**：如果 A 最后报错回滚，B 也会随之回滚（因为 B 是 A 的一部分）。这与 REQUIRES_NEW 不同。

---

#### 总结

| 传播机制              | 场景：A 有事务             | 场景：A 无事务 | 备注                     |
| ----------------- | -------------------- | -------- | ---------------------- |
| **REQUIRED** (默认) | B 加入 A 的事务           | B 新建事务   | 经典“同生共死”               |
| **REQUIRES_NEW**  | A 挂起，B 新建事务          | B 新建事务   | 此时 B 与 A 隔离，互不影响       |
| **NESTED**        | B 在嵌套事务(SavePoint)运行 | B 新建事务   | A 回滚 B 必回滚；B 回滚 A 可不回滚 |
| **SUPPORTS**      | B 加入 A 的事务           | B 非事务运行  | 随波逐流                   |
| **NOT_SUPPORTED** | A 挂起，B 非事务运行         | B 非事务运行  | B 想“透口气”，不想被事务管        |
| **MANDATORY**     | B 加入 A 的事务           | **报错**   | B 必须要有人管               |
| **NEVER**         | **报错**               | B 非事务运行  | B 必须没人管                |

#### 重点难点辨析：REQUIRES_NEW vs NESTED

这是面试中最容易混淆的点：

1. **独立性**：
   
   - REQUIRES_NEW：B 是完全独立的事务。A 回滚不影响 B（只要 B 已经提交）。
   
   - NESTED：B 是 A 的子事务。A 回滚，B **一定**回滚。

2. **技术实现**：
   
   - REQUIRES_NEW：开启新的数据库连接/事务上下文。
   
   - NESTED：使用同一个数据库连接，利用 JDBC 的 SavePoint 功能。

---

### 3.2 SpringBoot的启动流程

**两个大阶段**：

1. **构建阶段**：new SpringApplication()

2. **运行阶段**：run() 方法（核心）

#### 第一阶段：构建 SpringApplication 对象

**代码入口**：SpringApplication.run(Main.class, args);  
在调用 run 之前，Spring Boot 会先 new 一个 SpringApplication 对象。

**在这个阶段主要做了 3 件事：**

1. **推断应用类型**：判断当前是普通的 Java 应用，还是 Web 应用（Servlet），或者是 Reactive（WebFlux）应用。

2. **加载初始化器（Initializers）**：利用 **SPI 机制**（读取 META-INF/spring.factories），加载并保存所有的 ApplicationContextInitializer。

3. **加载监听器（Listeners）**：同样利用 SPI 机制，加载并保存所有的 ApplicationListener。

> **面试话术**：第一步是初始化，主要是确定应用类型（是不是 Web），并从 spring.factories 文件中预加载所有的初始化器和监听器。

---

#### 第二阶段：执行 run() 方法 (核心流程)

这是启动过程的重头戏，我们可以将其拆解为 **6 个关键步骤**：

#### 1. 开启计时与获取监听器 (Starting)

- 启动 StopWatch 计时器（用来统计启动耗时）。

- 获取 SpringApplicationRunListener 并启动。这一步会触发 ApplicationStartingEvent 事件，告诉大家“Spring Boot 开始跑了”。

#### 2. 准备环境 (Prepare Environment)

- 加载 application.properties 或 application.yml 配置文件。

- 加载系统环境变量（System Env）、系统属性（System Properties）。

- 将这些配置封装成 ConfigurableEnvironment 对象。

- 发布 ApplicationEnvironmentPreparedEvent 事件。

#### 3. 创建容器 (Create Context)

- 根据第一阶段推断的应用类型，反射创建一个 ApplicationContext（Spring 容器）。
  
  - 如果是 Web 应用，通常创建 AnnotationConfigServletWebServerApplicationContext。

#### 4. 准备容器 (Prepare Context)

- 将准备好的 Environment 设置给 Context。

- 执行所有的 ApplicationContextInitializer 的 initialize 方法（进行初始化增强）。

- 将启动类（Main.class）注册为 Bean，作为后续自动装配的入口。

- 发布 ApplicationContextInitializedEvent 事件。

#### 5. 刷新容器 (Refresh Context) —— **最核心步骤**

调用 Spring 核心的 context.refresh() 方法。这是 Spring Framework 的知识点，主要包含：

- **扫描与解析**：解析 @ComponentScan、@Import，加载所有的 Bean Definition。

- **自动装配**：处理 @EnableAutoConfiguration，将各种 Starter 中的配置类加载进来。

- **实例化 Bean**：实例化所有非懒加载的单例 Bean，处理依赖注入（DI）。

- **启动 Web 服务器**：如果是 Web 应用，会在这个阶段（onRefresh 方法中）创建并启动 **Tomcat**（或 Jetty/Undertow）。

#### 6. 收尾与回调 (After Refresh)

- 容器刷新完成后，停止计时器，打印启动时长。

- **执行 Runners**：查找容器中所有的 ApplicationRunner 和 CommandLineRunner 接口的实现类并执行。
  
  - 注：我们在项目中如果想在启动后立马执行某段逻辑，通常就实现这两个接口。

- 发布 ApplicationReadyEvent 事件，标志着应用启动完成。

---

#### 三、 面试官爱问的“杀手锏”细节

如果上面的流程你背下来了，面试官可能会深挖以下几个点，掌握了这些能大大加分：

#### 1. 自动装配原理是什么？

- **回答**：核心注解是 @EnableAutoConfiguration。它通过 @Import(AutoConfigurationImportSelector.class) 实现。

- **机制**：它会利用 SpringFactoriesLoader 读取 META-INF/spring.factories（Spring Boot 2.7 以前）或 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports（Spring Boot 2.7+）文件，找到所有配置类，根据 @Conditional 条件判断是否生效，如果生效就注册为 Bean。

#### 2. Tomcat 是什么时候启动的？

- **回答**：Tomcat 不是在第一步就启动的，而是在 refresh() 方法的 onRefresh() 阶段启动的。Spring Boot 会创建一个内嵌的 Servlet 容器工厂，由它来启动 Tomcat。

#### 3. SPI 机制在启动流程中哪里用到了？

- **回答**：在 new SpringApplication() 构建阶段和 run() 的准备阶段都大量使用了。比如加载 ApplicationContextInitializer、ApplicationListener 以及核心的自动配置类，都是通过 SPI 从配置文件中读取类名的。

---

#### 四、 总结（一句话记忆法）

> **Spring Boot 启动流程就是：**  
> 先初始化（加载 SPI 配置），再准备环境（读配置文件），接着创建 IOC 容器，然后 **refresh**（扫描 Bean、自动装配、启动 Tomcat），最后回调 Runners（执行启动后的业务逻辑）。
