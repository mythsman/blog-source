---
title: 区间dp专题小结
id: 1
categories:
  - Algorithm
date: 2015-10-12 23:07:36
tags:
  - Algorithm
  - Dp
mathjax: true
---

区间DP是一类在区间上进行动态规划的最优问题，一般是根据问题设出一个表示状态的dp，可以是二维的也可以是三维的，一般情况下为二维。然后将问题划分成两个子问题，也就是一段区间分成左右两个区间，然后将左右两个区间合并到整个区间，或者说局部最优解合并为全局最优解，然后得解。
这类DP可以用常规的for循环来写，也可以用记忆化搜索来写。一般情况下记忆化搜索的代码比较好写，所以一般都用dfs来代替获得dp值。然而说到底，这只是一种思想，具体的代码根据题目的不同差别很大，而且有很多需要考虑的细节。

* * *

[POJ-1651-Multiplication-Puzzle:](http://acm.hust.edu.cn/vjudge/contest/view.action?cid=77874#problem/E)
```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;
int a[104], dp[104][104];
int dfs(int x, int y){
	if (dp[x][y] != -1)
		return dp[x][y];
	if (x + 1 >= y)
		return dp[x][y]=0;
	dp[x][y] = 0x7fffff;
	for (int i = x + 1; i < y; i++){
		dp[x][y] = min(dp[x][y], dfs(x, i) + dfs(i, y) + a[x] * a[i] * a[y]);
	}
	return dp[x][y];
}
int main(){
	int n;
	while (scanf("%d", &n) == 1){
		memset(a, 0, sizeof a);
		memset(dp, -1, sizeof dp);
		for (int i = 1; i <= n; i++){
			scanf("%d", &a[i]);
		}
		printf("%dn", dfs(1, n));
	}
}
```

* * *

[POJ-2955-Brackets:](http://acm.hust.edu.cn/vjudge/contest/view.action?cid=77874#problem/C)
```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;
char s[104];
int dp[104][104];
bool match(char a, char b){
	return a == '('&&b == ')' || a == '['&&b == ']';
}
int dfs(int x, int y){
	if (dp[x][y] != -1)
		return dp[x][y];
	if (x + 1 >= y)
		return dp[x][y] = 0;
	dp[x][y] = 0;
	for (int i = x; i < y; i++){
		for (int j = i + 1; j < y; j++){
			if (match(s[i], s[j])){
				dp[x][y] = max(dp[x][y], dfs(i + 1, j) + 1 + dfs(j + 1,y));
			}
		}

	}
	return dp[x][y];
}

int main(){
	while (true){
		memset(dp, -1, sizeof dp);
		gets(s);
		if (strcmp(s, "end") == 0)
			break;
		printf("%dn", 2 * dfs(0, strlen(s)));
	}
}
```
