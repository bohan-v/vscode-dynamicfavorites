import * as vscode from 'vscode';
import { CategoryNode } from './category_node';

export class CategoryTreeItem implements vscode.TreeItem {
  label?: string | vscode.TreeItemLabel | undefined;
  command?: vscode.Command | undefined;
  resourceUri?: vscode.Uri | undefined;
  collapsibleState?: vscode.TreeItemCollapsibleState | undefined;
  iconPath?: string | vscode.Uri | { light: string | vscode.Uri; dark: string | vscode.Uri; } | vscode.ThemeIcon | undefined;

  constructor(
    public readonly node: CategoryNode
  ) {
    this.label = node.label;
    this.collapsibleState = node.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
    
    if (node.icon) {
      this.iconPath = new vscode.ThemeIcon(node.icon);
    }

    if (!node.filePath) {
      return;
    }

    let fileUri = vscode.Uri.file(node.filePath);
    this.resourceUri = fileUri;
    this.command = {
      command: "vscode.open",
      title: "Open",
      arguments: [fileUri]
    };
  }
}
