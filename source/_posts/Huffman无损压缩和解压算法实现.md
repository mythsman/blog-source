---
title: Huffman无损压缩和解压算法实现
id: 1
categories:
  - Algorithm
date: 2016-06-14 17:16:51
tags:
  - Algorithm
  - Java
---

高中学信息论的课后作业，本来自己的项目文档和中期汇报还没写，为了强行装x答应了下来，结果硬是熬夜到四点才敲完。。。。(以后绝不装逼了)

虽然算法看上去不难，但是不得不说还是走了很多弯路，学到了很多东西，在这里做个记录。

## 需求

用Huffman 编码实现文件的无损压缩和解压。

## 算法

算法当然用到了霍夫曼编码，构造霍夫曼树。具体过程也很简单，就是把读入的字节流按照字节进行频数分析，对频率高的字符用短编码，对频率低的用长编码。然后将编码的映射表和编码后的结果写入文件，这时候生成的文件就是压缩后的文件了。根据信息论的相关知识，这大概算是无损编码中压缩效率最高的了。

## 困难

相比我在遇到这个问题的时候，遇到的最大难度其实是文件的读写。由于平时对文件读写操作的练习不到位，出了很多洋相。比如忘记了java中char是两字节的；比如byte是有符号的；比如中文字符的编码问题；比如ObjectInputStream对象的available方法返回的是当前block的剩余字符而不是整个文件的剩余字符；除此之外，还要考虑压缩后的比特流长度可能不能构成完整的字节，因此要设计空白比特的填充处理；由于是压缩文件，因此还要考虑空间效率，不能直接用ArrayList<Byte>之类的东西存储数据，否则开销大的还不如不压缩。。。。。。估计是因为我太弱了，这种过程对我来说还是充满了挑战的。。。

## 代码

没有考虑读入和写入的效率问题，文件处理（尤其是压缩的写入过程）写的比较丑。。。
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

//霍夫曼树的节点
class Node {

	public Node left, right;
	public int source;
	public int weight;
	public String dest;

	public Node(int sour, int wei) {
		source = sour;
		weight = wei;
		left=right=null;
		dest="";
	}
}

//写入文件的头信息
class Header implements Serializable {

	private static final long serialVersionUID = 1L;
	public String[] mp;

	public Header(String[] m) {
		mp = m;

	}
}

/**
 * 压缩解压的主类
 * @author Myths
 *
 */
public class Huffman {

	public String[] mp;
	public int[] cnt;
	public String path;

	public Huffman(String path){
		this.path = path;
		mp = new String[256];
		cnt = new int[256];
	}

	//封装了解压的方法
	public void unzip() throws FileNotFoundException, IOException, ClassNotFoundException {
		ObjectInputStream ins = new ObjectInputStream(new FileInputStream(new File(path)));
		FileOutputStream writer = new FileOutputStream(new File(path.substring(0, path.length() - 5)));
		Header zipFile = (Header) ins.readObject();

		Map<String, Character> mp = new HashMap<String, Character>();
		for (int i = 0; i < 256; i++) {
			if (zipFile.mp[i] != null) {
				mp.put(zipFile.mp[i], (char) i);
			}
		}

		String buff = "";
		byte[] bf = null;
		while (ins.available() >= 4) {

			if (ins.available() == 4) {
				bf = new byte[4];
				for (int i = 0; i < 4; i++)
					bf[i] = ins.readByte();
				if (ins.available() == 0) {
					break;
				}
				for (int j = 0; j < 4; j++) {
					buff += b2s(bf[j]);
					while (buff.length() > 256) {
						String s = "";
						int cnt = 0;
						for (int i = 0; i < buff.length(); i++) {
							s += buff.charAt(i);
							if (mp.containsKey(s)) {
								writer.write(mp.get(s));

								cnt += s.length();
								s = "";
								break;
							}
						}
						writer.flush();
						buff = buff.substring(cnt, buff.length());
					}
				}
			}
			byte c = ins.readByte();
			buff += b2s(c);
			while (buff.length() > 256) {
				String s = "";
				int cnt = 0;
				for (int i = 0; i < buff.length(); i++) {
					s += buff.charAt(i);
					if (mp.containsKey(s)) {
						writer.write(mp.get(s));
						cnt += s.length();
						s = "";
						break;
					}
				}
				writer.flush();
				buff = buff.substring(cnt, buff.length());
			}

		}

		for (int i = 0; i < 4; i++) {
			if (bf[i] == 0) {
				buff += "0";
			} else if (bf[i] == 1) {
				buff += "1";
			}
		}

		String s = "";
		for (int i = 0; i < buff.length(); i++) {
			s += buff.charAt(i);
			if (mp.containsKey(s)) {
				writer.write(mp.get(s));
				s = "";
			}
		}
		writer.flush();
		writer.close();
		ins.close();
	}

	//封装了压缩的方法
	public void zip() throws IOException {
		readFrequency();
		huffmanEncrypt();
		FileInputStream ins = new FileInputStream(new File(path));
		Header zipFile = new Header(mp);
		ObjectOutputStream ous = new ObjectOutputStream(new FileOutputStream(path + ".huff"));
		ous.writeObject(zipFile);

		String buff = "";
		int c;
		while ((c = ins.read()) != -1) {
			buff += mp[c];
			while (buff.length() >= 8) {
				ous.writeByte((byte) (s2b(buff.substring(0, 8))));
				buff = buff.substring(8, buff.length());
			}
		}

		for (int i = 0; i < 4; i++) {
			if (i < buff.length()) {
				ous.writeByte(buff.charAt(i) - '0');
			} else {
				ous.writeByte(255);
			}
		}

		ous.flush();
		ous.close();
		ins.close();
	}

	//字节转二进制字符串
	public String b2s(byte c) {
		int cc = (c + 256) % 256;
		String s = "";
		while (cc > 0) {
			if (cc % 2 == 1) {
				s += "1";
			} else {
				s += "0";
			}
			cc /= 2;
		}
		while (s.length() < 8) {
			s += "0";
		}
		return s;
	}

	//二进制字符串转字节
	public byte s2b(String s) {
		byte c = 0;
		for (int i = 7; i >= 0; i--) {
			c *= 2;
			if (s.charAt(i) == '1') {
				c += 1;
			}

		}
		return c;
	}

	// 读取文件，并获得每个字符的频数
	public void readFrequency() throws IOException { 

		File file = new File(path);
		FileInputStream ins=new FileInputStream(file);
		int c;
		while ((c = ins.read()) != -1) {
			cnt[c] += 1;	
		}
		ins.close();
	}

	// 读取频数，返回Huffman映射表
	public void huffmanEncrypt() { 

		PriorityQueue<Node> pq = new PriorityQueue<Node>(256, new Comparator<Node>() {

			@Override
			public int compare(Node o1, Node o2) {

				return o1.weight - o2.weight;
			}

		});
		int times = 0;
		for (int i = 0; i < 256; i++) {
			if (cnt[i] > 0.5) {
				pq.add(new Node(i, cnt[i]));
				times++;
			}
		}

		for (int i = 0; i < times - 1; i++) {
			Node nodeFir, nodeSec;
			nodeFir = pq.poll();
			nodeSec = pq.poll();
			Node newNode = new Node(-1, nodeSec.weight + nodeFir.weight);
			newNode.left = nodeSec;
			newNode.right = nodeFir;
			pq.add(newNode);
		}

		Node root = pq.poll();
		Queue<Node> q = new LinkedBlockingQueue<Node>();
		q.add(root);
		while (!q.isEmpty()) {
			Node cur = q.poll(); // bfs遍历
			if (cur.source == -1) { // 非叶子节点
				if (cur.left != null) {
					cur.left.dest = cur.dest + "1";
					q.add(cur.left);
				}
				if (cur.right != null) {
					cur.right.dest = cur.dest + "0";
					q.add(cur.right);
				}
			} else { // 叶子节点
				mp[cur.source] = cur.dest;
			}
		}
	}

	public static void main(String[] args) throws IOException, ClassNotFoundException {

		 Huffman huff = new	 Huffman("C:\\Users\\Administrator\\Desktop\\in.txt.huff");

		 huff.unzip();

		//Huffman huff = new Huffman("C:\\Users\\Administrator\\Desktop\\in.txt");

		//huff.zip();
	}
}
```