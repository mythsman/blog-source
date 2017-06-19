---
title: 基于Swing的FontChooser对话框
id: 1
categories:
  - Java
date: 2016-06-01 14:28:12
tags:
  - Java
---

不知道为什么，原生的Swing有JFileChooser，JColorChooser但是却没有JFontChooser。虽然网上有很多类似的实现，但是鉴于是作业，我还是自己写了一个简单的FontChooser来练练手。而且真正写起来也不是那么的顺畅，果然还是发现了很多的坑。。。

## 功能分析

1. 既然是字体选择器，那么至少得能够选择“字体”，“样式”，“大小”。
2. 这类的对话框一般得是“阻塞“的，即弹出该对话框后，本来的对话框应该是点不动的直到弹出的对话框结束。
3. 仿照JFileChooser和JColorChooser，这类选择工具类的对话框设计为静态的比较好。
4. 对话框默认的字体一般是待修改的字体。
5. 选择成功得返回选择后的结果，选择退出得返回原先的结果。


## 实现代码

```cpp
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GraphicsEnvironment;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingConstants;

public class FontChooser extends JDialog {

	private static final long serialVersionUID = 1L;
	private static JDialog dlg;
	private static Font font, rawFont;
	private static JPanel panel;
	private static JComboBox<String> comboBoxFont, comboBoxStyle, comboBoxSize;
	private static JLabel text;
	private static JButton button;

	// 向外部提供的静态方法,可阻塞
	public static void showDialog(JFrame parent, String title, boolean modal, Font rawfont) {
		dlg = new JDialog(parent, title, modal);
		rawFont = rawfont;
		font = new Font(rawFont.getFontName(), rawFont.getStyle(), rawFont.getSize());
		setDefault();
		setComboBox();
		dlg.setVisible(true);
	}

	// 获得取得的字体
	public static Font getResFont() {
		return font;
	}

	private static void setDefault() {
		dlg.setSize(550, 280);
		dlg.setTitle("选择字体");
		dlg.setResizable(false);
		dlg.setLocationRelativeTo(null);
		comboBoxFont = new JComboBox<String>();
		comboBoxStyle = new JComboBox<String>();
		comboBoxSize = new JComboBox<String>();
		panel = new JPanel();
		dlg.setContentPane(panel);
		panel.setLayout(null);

		// 关闭窗口，则不更新字体
		dlg.addWindowListener(new WindowAdapter() {
			@Override
			public void windowClosing(WindowEvent e) {
				font = rawFont;
				dlg.dispose();
			}
		});

		JPanel panelFont = new JPanel();
		panelFont.add(new JLabel("字体:"));
		panelFont.add(comboBoxFont);
		panel.add(panelFont);
		panelFont.setBounds(10, 10, 150, 60);

		JPanel panelStyle = new JPanel();
		panelStyle.add(new JLabel("风格:"));
		panelStyle.add(comboBoxStyle);
		panel.add(panelStyle);
		panelStyle.setBounds(10, 70, 150, 60);

		JPanel panelSize = new JPanel();
		panelSize.add(new JLabel("大小:"));
		panelSize.add(comboBoxSize);
		panel.add(panelSize);
		panelSize.setBounds(10, 130, 150, 60);

		button = new JButton("确定");
		panel.add(button);
		button.setBounds(20, 190, 140, 30);
		// 点确定，则关闭窗口，保留结果
		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				dlg.dispose();
			}
		});

		JPanel panelText = new JPanel();
		text = new JLabel();
		text.setText("Hello World!");
		text.setFont(font);
		text.setBorder(BorderFactory.createLoweredBevelBorder());
		panelText.setLayout(new BorderLayout());
		panelText.add(text);

		panelText.setBounds(180, 30, 340, 200);
		text.setHorizontalAlignment(SwingConstants.CENTER);
		text.setVerticalAlignment(SwingConstants.CENTER);
		panel.add(panelText);

	}

	private static void setComboBox() {
		// 获得系统提供的字体
		String[] fontnames = GraphicsEnvironment.getLocalGraphicsEnvironment().getAvailableFontFamilyNames();
		for (int i = 0; i < fontnames.length; i++) {
			comboBoxFont.addItem(fontnames[i]);
		}
		comboBoxFont.setPreferredSize(new Dimension(100, 30));
		comboBoxFont.setSelectedItem(font.getFontName());
		comboBoxFont.addItemListener(new ItemListener() {
			@Override
			public void itemStateChanged(ItemEvent arg0) {
				if (arg0.getStateChange() == ItemEvent.SELECTED) {
					String s = (String) arg0.getItem();
					font = new Font(s, font.getStyle(), font.getSize());
					text.setFont(font);
				}
			}
		});

		comboBoxStyle.addItem("普通");
		comboBoxStyle.addItem("加粗");
		comboBoxStyle.addItem("倾斜");
		comboBoxStyle.addItem("加粗倾斜");
		if (font.getStyle() == Font.BOLD) {
			comboBoxStyle.setSelectedItem("加粗");
		} else if (font.getStyle() == Font.PLAIN) {
			comboBoxStyle.setSelectedItem("普通");
		} else if (font.getStyle() == Font.ITALIC) {
			comboBoxStyle.setSelectedItem("倾斜");
		} else {
			comboBoxStyle.setSelectedItem("加粗倾斜");
		}

		comboBoxStyle.setPreferredSize(new Dimension(100, 30));
		comboBoxStyle.addItemListener(new ItemListener() {
			@Override
			public void itemStateChanged(ItemEvent arg0) {
				if (arg0.getStateChange() == ItemEvent.SELECTED) {
					String s = (String) arg0.getItem();
					if (s.equals("普通")) {
						font = new Font(font.getFontName(), Font.PLAIN, font.getSize());
					} else if (s.equals("加粗")) {
						font = new Font(font.getFontName(), Font.BOLD, font.getSize());
					} else if (s.equals("倾斜")) {
						font = new Font(font.getFontName(), Font.ITALIC, font.getSize());
					} else {
						font = new Font(font.getFontName(), Font.BOLD | Font.ITALIC, font.getSize());
					}
					text.setFont(font);
				}
			}
		});

		for (int i = 5; i <= 50; i++) {
			comboBoxSize.addItem(i + "px");
		}
		comboBoxSize.setSelectedItem(font.getSize() + "px");
		comboBoxSize.setPreferredSize(new Dimension(100, 30));
		comboBoxSize.addItemListener(new ItemListener() {
			@Override
			public void itemStateChanged(ItemEvent arg0) {
				if (arg0.getStateChange() == ItemEvent.SELECTED) {
					String s = (String) arg0.getItem();
					s = s.substring(0, s.length() - 2);
					font = new Font(font.getFontName(), font.getStyle(), Integer.parseInt(s));
					text.setFont(font);
				}
			}
		});
	}

	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setSize(720, 540);
		frame.setLocationRelativeTo(null);
		frame.setVisible(true);
		FontChooser.showDialog(frame, "title", true, new Font("宋体", Font.BOLD, 20));
	}
}
```

## 运行截图

![](/images/2016/06/01/1/1.png)