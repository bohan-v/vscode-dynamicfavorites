import * as vscode from 'vscode';
import { CategoryNode } from './category_node';
import { CategoryTreeItem } from './category_tree_item';

export class CategoriesProvider implements vscode.TreeDataProvider<CategoryNode> {
  private _onDidChangeTreeData: vscode.EventEmitter<CategoryNode | void | CategoryNode[] | null | undefined> = new vscode.EventEmitter<CategoryNode | undefined | null | void>();
  onDidChangeTreeData?: vscode.Event<CategoryNode | void | CategoryNode[] | null | undefined> = this._onDidChangeTreeData.event;

  constructor(public nodes: CategoryNode[]) {}

  getTreeItem(element: CategoryNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new CategoryTreeItem(element);
  }

  getChildren(element?: CategoryNode | undefined): vscode.ProviderResult<CategoryNode[]> {
    if (!element) {
      return this.nodes;
    } else {
      return element.children;
    }
  }

  update(nodes: CategoryNode[]) {
    this._onDidChangeTreeData.fire();
    this.nodes = nodes;
  }
}
