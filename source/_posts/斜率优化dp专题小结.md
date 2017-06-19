---
title: 斜率优化dp专题小结
id: 1
categories:
  - Algorithm
date: 2015-10-11 23:00:52
tags:
  - Algorithm
  - Dp
mathjax: true
---

斜率优化dp是一种通过构造斜率表达式，用维护凸包的方法来去除多余的点以减少算法复杂度的方法。通常可以将问题规模减小一个维度，从而提高运行效率。
这个算法的关键是将dp的状态转移方程进行转换，比如对于如下状态转移方程：
$$dp[i]=Min(dp[j]+M+(sum[i]-sum[j])^2),j\in [1,i),i\in [1,n]$$
如果直接dp那么复杂度将会是(O(n_2)),某些情况下就会显得效率不够。这时候就可以用斜率dp进行优化，将其优化到$O(n)$。
首先我们需要将状态转移方程进行变形，在计算$dp[i]$的时候，对于任何x和y，如果x比y更优，那么也就是说:
$$\begin{aligned} & dp[x]+M+(sum[i]-sum[x])^2\ \lt dp[y]+M+(sum[i]-sum[y])^2\end{aligned}$$
成立。
将上式进行变形，可以得到一种类似斜率的表达形式:
$$
(dp[x]+num[x]^2-(dp[y]+num[y]^2))/(2*(num[x]-num[y]))<sum[i]
$$
令
$$
Cmp(x,y)=(dp[x]+num[x]^2-(dp[y]+num[y]^2))/(2*(num[x]-num[y]))
$$

现在从左到右，设$x\lt y\lt z$，如果$Cmp(z,y)\lt Cmp(y,x)$，那么y点便永远不可能成为最优解，可以直接将它踢出我们的最优解集。同时，由于$sum[i]$单调增，所以如果$Cmp(y,x)\lt sum[i]$那么x点也不可能成为最优解。
据此，我们可以便可以通过维护这样的一个队列，每加入一个元素就判断排除所有不可能是最优解的点从而进行优化。
斜率优化dp的套路基本是固定的，基本上就是用数组模拟队列，然后两个while循环判断是否可以去除无用的点。

* * *

[Hdoj3507--Print Article:](http://acm.hdu.edu.cn/showproblem.php?pid=3507)
```cpp
#include<stdio.h>
#include<string.h>
int a[500004];
int dp[500004];
int sum[500004];
int q[500004];
int getUp(int i, int j){
	return dp[i] + sum[i] * sum[i] - dp[j] - sum[j] * sum[j];
}
int getDown(int i, int j){
	return 2 * (sum[i] - sum[j]);
}
void init(){
	memset(a, 0, sizeof a);
	memset(dp, 0, sizeof dp);
	memset(sum, 0, sizeof sum);
	memset(q, 0, sizeof q);
}
int main(){
	int n, m;
	while (scanf("%d%d", &n, &m) == 2){
		init();
		for (int i = 1; i <= n; i++){
			scanf("%d", &a[i]);
			sum[i] = sum[i - 1] + a[i];
		}
		int head = 0, tail = 0;
		q[tail++] = 0;
		for (int i = 1; i <= n; i++){
			while (head + 1 < tail){
				int a1 = q[head], a2 = q[head + 1];
				if (getUp(a2, a1) <= getDown(a2, a1)*sum[i]){
					head++;
				}
				else{
					break;
				}
			}
                        int k=q[head];
			dp[i] = dp[k] + m + (sum[i] - sum[k])*(sum[i] - sum[k]);
			q[tail++] = i;
			while (head + 2 < tail){
				int a1 = q[tail - 3];
				int a2 = q[tail - 2];
				int a3 = q[tail - 1];

				if (getUp(a2, a1)*getDown(a3, a2) >= getDown(a2, a1)*getUp(a3, a2)){
					tail-=2;
					q[tail++]=a3;
				}
				else{
					break;
				}
			}
		}
		printf("%dn", dp[n]);
	}
}
```
* * *

[Hdoj3480--Division:](http://acm.hdu.edu.cn/showproblem.php?pid=3480)
```cpp
#include<cstdio>
#include<cstring>
using namespace std;
int a[10004];
int dp[5004][10004];
int q[10004];
int getUp(int i,int x,int y){
	return dp[i - 1][x] - dp[i - 1][y] +a[x+1]*a[x+1]-a[y+1]*a[y+1];
}
int getDown(int x, int y){
	return  a[x + 1] - a[y + 1];
}
int getRight(int i){
	return 2 * a[i];
}
int main(){
	int tt;
	scanf("%d", &tt);
	for (int t = 1; t <= tt; t++){
		int n, m;
		memset(a, 0, sizeof a);
		memset(dp, 0, sizeof dp);
		memset(q, 0, sizeof q);
		scanf("%d%d", &n, &m);
		for (int i = 1; i <= n; i++){
			scanf("%d", &a[i]);
		}
		sort(a + 1, a + 1 + n);
		for (int i = 1; i <= n; i++){
			dp[1][i] = (a[i] - a[1])*(a[i] - a[1]);
		}
		for (int i = 2; i <= m; i++){
			int head =0,tail = 0;
			q[tail++] = i - 1;
			for (int j = i; j <= n; j++){
				while (head + 1 < tail){
					int a1 = q[head];
					int a2 = q[head+1];
					if (getUp(i, a2, a1) <= getDown(a2, a1)*getRight(j)){
						head++;
					}
					else{
						break;
					}
				}
				int k = q[head];
				dp[i][j] = dp[i-1][k]+(a[j]-a[k+1])*(a[j]-a[k+1]);
				q[tail++] = j;
				while (head + 2 < tail){
					int a1 = q[tail - 3];
					int a2 = q[tail - 2];
					int a3 = q[tail - 1];
					if (getUp(i,a2,a1)*getDown(a3,a2)>=getUp(i,a3,a2)*getDown(a2,a1)){
						tail -= 2;
						q[tail++] = a3;
					}
					else{
						break;
					}
				}
			}		
		}	
		printf("Case %d: %dn",t, dp[m][n]);
	}
}
```
* * *

[Hdoj2829--Lawrence:](http://acm.hdu.edu.cn/showproblem.php?pid=2829)
```cpp
#include<cstdio>
#include<cstring>
using namespace std;
int sum[1004];
int a[1004];
int dp[1004][1004];
int q[100004];
int getUp(int i, int x, int y){
	return dp[i - 1][x] - dp[i - 1][y]-dp[0][x]+dp[0][y]+sum[x]*sum[x]-sum[y]*sum[y];
}
int getDown(int x, int y){
	return sum[x] - sum[y];
}
int main(){
	int n, m;
	while (scanf("%d%d", &n, &m), n || m){
		memset(sum, 0, sizeof sum);
		memset(dp, 0, sizeof dp);
		memset(q, 0, sizeof q);
		memset(a, 0, sizeof a);
		for (int i = 1; i <= n; i++){
			scanf("%d", &a[i]);
			sum[i] = sum[i - 1] + a[i];
			dp[0][i] = dp[0][i - 1] + a[i] * sum[i - 1];
		}
		for (int i = 1; i <= m; i++){
			int head = 0, tail = 0;
			q[tail++] = 0;
			for (int j = 1; j <= n; j++){	
				while (head + 1 < tail){
					int a1 = q[head];
					int a2 = q[head + 1];
					if (getUp(i, a2, a1) <= getDown(a2, a1)*sum[j]){
						head++;
					}
					else{
						break;
					}
				}
				int k = q[head];
				dp[i][j] = dp[i - 1][k] +dp[0][j]-dp[0][k]- (sum[j] - sum[k])*sum[k];
				q[tail++] = j;
				while (head + 2 < tail){
					int a1 = q[tail - 3];
					int a2 = q[tail - 2];
					int a3 = q[tail - 1];
					if (getUp(i, a2, a1)*getDown(a3, a2) >= getUp(i, a3, a2)*getDown(a2, a1)){
						tail -= 2;
						q[tail++] = a3;
					}
					else{
						break;
					}
				}
			}
		}
		printf("%dn", dp[m][n]);
	}
}
```

* * *

[Hdoj3045--Picnic Cows:](http://acm.hdu.edu.cn/showproblem.php?pid=3045)
```cpp
#include<cstdio>
#include<cstring>
#include<algorithm>
using namespace std;
long long a[400004];
long long sum[400004];
long long dp[400004];
long long q[400004];
long long getUp(long long x, long long y){
	return dp[x] - dp[y] - sum[x] + sum[y] + a[x+1] * x - a[y+1] * y;
}
long long getDown(long long x, long long y){
	return a[x + 1] - a[y + 1];
}
int main(){
	long long n, m;
	while (scanf("%I64d%I64d", &n, &m) == 2){
		memset(dp, 0, sizeof dp);
		memset(q, 0, sizeof q);
		memset(sum, 0, sizeof sum);
		memset(a, 0, sizeof a);
		for (long long i = 1; i <= n; i++){
			scanf("%I64d", &a[i]);
		}
		sort(a + 1, a + 1 + n);
		for (long long i = 1; i <= n; i++){
			sum[i] = sum[i - 1] + a[i];
		}
		long long head = 0, tail = 0;
		q[tail++] = 0;
		for (long long i = 1; i <= n; i++){
			while (head + 1 < tail){
				long long a1 = q[head], a2 = q[head + 1];
				if (getUp(a2, a1) <= getDown(a2, a1)*i){
					head++;
				}
				else{
					break;
				}
			}
			long long k = q[head];
			dp[i] = dp[k] + sum[i] - sum[k] - a[k + 1] * (i - k);
			if (i - m + 1 < m){
				continue;
			}
			q[tail++] = i - m + 1;
			while (head + 2 < tail){
				long long a1 = q[tail - 3];
				long long a2 = q[tail - 2];
				long long a3 = q[tail - 1];
				if (getUp(a2, a1)*getDown(a3, a2) >= getDown(a2, a1)*getUp(a3, a2)){
					tail -= 2;
					q[tail++] = a3;
				}
				else{
					break;
				}
			}
		}
		printf("%I64dn", dp[n]);
	}
}
```
