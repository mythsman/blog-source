---
title: 基于Swing的简单文本编辑器
id: 1
categories:
  - Java
date: 2016-06-02 20:54:17
tags:
  - Java
---

Java小作业，任务是写一个有改字体颜色大小的文本编辑器。其实相比windows自带的记事本功能还要弱，不过还是拿来练练手了。这里主要也就实现了简单的文件读写和字体等更改操作，还是非常简易的。

## 实现代码

```cpp
import java.awt.Color;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import javax.swing.JColorChooser;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JMenu;
import javax.swing.JMenuBar;
import javax.swing.JMenuItem;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.KeyStroke;

public class TextEditer extends JFrame {
	private static final long serialVersionUID = 1L;
	private JScrollPane scrollPane;
	public JTextArea textArea;
	private JMenuBar menubar;
	private TextEditer editer;
	public Font font;
	private Color fgColor, bgColor;
	private JMenu menuFile, menuEdit;
	private JMenuItem menuFileNew, menuFileOpen, menuFileSave, menuFileExit;
	private JMenuItem menuEditFont, menuEditFgColor, menuEditBgColor;

	public TextEditer() {
		setDefault();
		setMenubar();
		setListener();

	}

	private void setDefault() {
		editer = this;
		this.setBounds(100, 100, 100, 100);
		this.setSize(720, 540);
		this.setLocationRelativeTo(null);// 居中
		this.setTitle("文本编辑器");
		font = new Font("宋体", Font.PLAIN, 28);
		textArea = new JTextArea();
		textArea.setFont(font);
		fgColor = new Color(0, 0, 0);
		bgColor = new Color(255, 255, 255);
		textArea.setForeground(fgColor);
		textArea.setBackground(bgColor);
		textArea.setLineWrap(true);// 超出边界自动换行
		scrollPane = new JScrollPane(textArea);// 加入滚动条
		this.add(scrollPane);

	}

	private void setMenubar() {
		menubar = new JMenuBar();
		menuFile = new JMenu("文件(F)");
		menuEdit = new JMenu("编辑(E)");
		menubar.add(menuFile);
		menubar.add(menuEdit);

		menuFileNew = new JMenuItem("新建(N)");
		menuFileOpen = new JMenuItem("打开(O)");
		menuFileSave = new JMenuItem("保存(S)");
		menuFileExit = new JMenuItem("退出(X)");
		menuFile.add(menuFileNew);
		menuFile.add(menuFileOpen);
		menuFile.add(menuFileSave);
		menuFile.add(menuFileExit);
		// 设置alt+X快捷键
		menuFile.setMnemonic('F');
		menuFileNew.setMnemonic('N');
		menuFileOpen.setMnemonic('O');
		menuFileSave.setMnemonic('S');
		menuFileExit.setMnemonic('X');
		// 设置ctrl+X快捷键
		menuFileNew.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_N, InputEvent.CTRL_MASK));
		menuFileOpen.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_O, InputEvent.CTRL_MASK));
		menuFileSave.setAccelerator(KeyStroke.getKeyStroke(KeyEvent.VK_S, InputEvent.CTRL_MASK));

		menuEditFont = new JMenuItem("字体(T)");
		menuEditFgColor = new JMenuItem("前景色(F)");
		menuEditBgColor = new JMenuItem("背景色(B)");
		menuEdit.add(menuEditFont);
		menuEdit.add(menuEditFgColor);
		menuEdit.add(menuEditBgColor);
		menuEdit.setMnemonic('E');
		menuEditFont.setMnemonic('T');
		menuEditFgColor.setMnemonic('F');
		menuEditBgColor.setMnemonic('B');

		this.setJMenuBar(menubar);
	}

	private void setListener() {
		this.addWindowListener(new WindowAdapter() {
			@Override
			public void windowClosing(WindowEvent e) {
				System.exit(0);
			}
		});

		// 设置文本字体，调用之前写的FontChooser类
		menuEditFont.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent arg0) {
				FontChooser.showDialog(editer, "选择字体", true, textArea.getFont());
				textArea.setFont(FontChooser.getResFont());
			}
		});

		// 设置文本前景色
		menuEditFgColor.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				Color color = JColorChooser.showDialog(editer, "选择前景色", textArea.getForeground());
				textArea.setForeground(color);
			}
		});

		// 设置文本背景色
		menuEditBgColor.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				Color color = JColorChooser.showDialog(editer, "选择背景色", textArea.getBackground());
				textArea.setBackground(color);
			}
		});

		// 清空文本区
		menuFileNew.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				textArea.setText("");
			}
		});

		// 选择打开文件
		menuFileOpen.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				JFileChooser chooser = new JFileChooser();
				chooser.showOpenDialog(editer);
				File file = chooser.getSelectedFile();
				if (file == null)
					return;
				BufferedReader reader;
				try {
					reader = new BufferedReader(new FileReader(file));
					String line = "";
					String ans = "";
					while ((line = reader.readLine()) != null) {
						ans += line;
					}
					textArea.setText(ans);
					reader.close();
				} catch (IOException e1) {
					System.out.println("File open failure.");
					e1.printStackTrace();
				}
			}
		});

		// 保存文件
		menuFileSave.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				JFileChooser chooser = new JFileChooser();
				chooser.showOpenDialog(editer);
				File file = chooser.getSelectedFile();
				if (file == null)
					return;
				FileWriter writer;
				try {
					writer = new FileWriter(file);
					writer.write(textArea.getText());
					writer.flush();
					writer.close();
				} catch (IOException e1) {
					System.out.println("File open failure.");
					e1.printStackTrace();
				}
			}
		});

		// 退出
		menuFileExit.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
			}
		});

	}

	public static void main(String[] args) {
		TextEditer editer = new TextEditer();
		editer.setVisible(true);
	}

}
```

## 运行截图

![](/images/2016/06/02/1/1.png)
